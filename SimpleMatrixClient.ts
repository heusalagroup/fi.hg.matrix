import { forEach, keys } from "../ts/modules/lodash";
import Observer, { ObserverCallback, ObserverDestructor } from "../ts/Observer";
import RequestClient from "../ts/RequestClient";
import LogService from "../ts/LogService";
import JsonAny from "../ts/Json";

const LOG = LogService.createLogger('SimpleMatrixClient');

export enum SimpleMatrixClientEvent {

    EVENT = "SimpleMatrixClient:event"

}

export type SimpleMatrixClientDestructor = ObserverDestructor;

export interface MatrixEventContentDTO {
    readonly body    : string;
    readonly msgtype : string;
}

export interface MatrixEventDTO {

    readonly content          : MatrixEventContentDTO;
    readonly room_id          : string;
    readonly event_id         : string;
    readonly origin_server_ts : number;
    readonly sender           : string;
    readonly type             : string;

}

export interface MatrixTextMessageDTO {

    readonly msgtype          : string;
    readonly body             : string;

}

/**
 * Super simple matrix event listener.
 *
 * Far from perfect, but works on OpenWRT and NodeJS 8 and full POC takes only 50k as compiled :)
 */
export class SimpleMatrixClient {

    private readonly _observer     : Observer<SimpleMatrixClientEvent>;
    private readonly _url          : string;
    private readonly _accessToken  : string;
    private readonly _userId       : string;
    private readonly _pollTimeout     : number;
    private readonly _pollWaitTime     : number;
    private readonly _timeoutCallback : (() => void);

    private _nextBatch : string;
    private _timer     : any;
    private _syncing   : boolean;

    public constructor (
        url: string,
        accessToken: string,
        userId: string,
        pollTimeout : number = 30000,
        pollWaitTime : number = 1000
    ) {

        this._url = url;
        this._accessToken = accessToken;
        this._userId = userId;
        this._pollTimeout = pollTimeout;
        this._pollWaitTime = pollWaitTime;
        this._syncing = false;

        this._observer = new Observer<SimpleMatrixClientEvent>("SimpleMatrixClient");

        this._timeoutCallback = this._onTimeout.bind(this);

    }

    public static Event = SimpleMatrixClientEvent;

    public destroy (): void {

        this._observer.destroy();

        if (this._timer !== undefined) {
            clearTimeout(this._timer);
            this._timer = undefined;
        }

    }

    public on (
        name: SimpleMatrixClientEvent,
        callback: ObserverCallback<SimpleMatrixClientEvent>
    ): SimpleMatrixClientDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public start () {

        if (this._timer !== undefined) {
            clearTimeout(this._timer);
            this._timer = undefined;
        }

        this._initSync().catch((err : any) => {
            LOG.error('SYNC ERROR: ', err);
        });

    }

    public async sendTextMessage (roomId: string, body: string) : Promise<void> {

        const requestBody : MatrixTextMessageDTO = {
            msgtype: 'm.text',
            body: body
        };

        LOG.debug(`Sending message with body:`, requestBody);

        const response = await RequestClient.postJson(`${this._url}/_matrix/client/r0/rooms/${roomId}/send/m.room.message?access_token=${encodeURIComponent(this._accessToken)}`, requestBody as unknown as JsonAny);

        LOG.debug(`Message sending response received: `, response);

    }



    private async _initSync () {

        LOG.info(`Initial sync request started`);

        const response = await RequestClient.getJson(`${this._url}/_matrix/client/r0/sync?filter={"room":{"timeline":{"limit":1}}}&access_token=${encodeURIComponent(this._accessToken)}`)

        LOG.info(`Initial sync response received`);

        // @ts-ignore
        const next_batch : string | undefined = response?.next_batch;

        if (next_batch) {
            this._nextBatch = next_batch;
        } else {
            LOG.error(`No next_batch in the response: `, response)
        }

        this._timer = setTimeout(this._timeoutCallback, this._pollWaitTime);
        LOG.info('Timer started...');

    }

    private async _syncSince (next: string) {

        const response : any = await RequestClient.getJson(`${this._url}/_matrix/client/r0/sync?since=${encodeURIComponent(next)}&timeout=${this._pollTimeout}&access_token=${encodeURIComponent(this._accessToken)}`)

        // @ts-ignore
        const next_batch : string | undefined = response?.next_batch;
        if (next_batch) {
            this._nextBatch = next_batch;
        } else {
            LOG.error(`No next_batch in the response: `, response)
        }

        // LOG.debug('Response: ', response);

        forEach(keys(response), (property : any) => {

            const value : any = response[property];

            // LOG.debug('value = ', value);

            // @ts-ignore
            const events : MatrixEventDTO[] = value?.events ?? [];

            if (events) {
                this._sendMatrixEventList(events, undefined);
            }

            const join = value?.join;
            if (property === 'rooms' && join ) {
                forEach(keys(join), (roomId : any ) => {
                    const obj : any = join[roomId];
                    // LOG.debug('obj = ', obj);

                    forEach(keys(obj), (property : any) => {
                        const roomValue = obj[property];

                        const events : MatrixEventDTO[] | undefined = roomValue?.events;
                        if ( events ) {
                            this._sendMatrixEventList(events, roomId);
                        // } else {
                        //     LOG.debug('Room join: ', roomId, roomValue);
                        }
                    });

                })
            }

        })


    }

    private _sendMatrixEventList (events : MatrixEventDTO[], room_id : string | undefined) {
        forEach(events, (event) => {
            this._sendMatrixEvent(event, room_id);
        });
    }

    private _sendMatrixEvent (event : MatrixEventDTO, room_id : string | undefined) {
        this._observer.triggerEvent(SimpleMatrixClientEvent.EVENT, room_id ? {...event, room_id} : event);
    }

    private _onTimeout () {

        if (this._syncing) {
            LOG.warn( `Warning! Already syncing...`);
            return;
        }

        // LOG.info('On timeout...');

        this._syncing = true;
        this._syncSince(this._nextBatch).then(() => {

            this._syncing = false;

            if (this._timer !== undefined) {
                clearTimeout(this._timer);
                this._timer = undefined;
            }

            this._timer = setTimeout(this._timeoutCallback, this._pollWaitTime);
            // LOG.info('Timer started again...');

        }, (err) => {

            this._syncing = false;
            LOG.error(`ERROR: `, err);

            if (this._timer !== undefined) {
                clearTimeout(this._timer);
                this._timer = undefined;
            }

            this._timer = setTimeout(this._timeoutCallback, this._pollWaitTime);
            // LOG.info('Timer started again...');

        });

    }

}

export default SimpleMatrixClient;
