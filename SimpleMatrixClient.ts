// Copyright (c) 2021 Sendanor. All rights reserved.

import { concat, forEach, isString, keys, map } from "../ts/modules/lodash";
import Observer, { ObserverCallback, ObserverDestructor } from "../ts/Observer";
import RequestClient from "../ts/RequestClient";
import LogService from "../ts/LogService";
import JsonAny, { isJsonObject, JsonObject } from "../ts/Json";
import { MatrixPasswordLoginDTO } from "./types/request/passwordLogin/MatrixPasswordLoginDTO";
import { MatrixTextMessageDTO } from "./types/message/textMessage/MatrixTextMessageDTO";
import { MatrixType } from "./types/core/MatrixType";
import { isMatrixLoginResponseDTO } from "./types/response/login/MatrixLoginResponseDTO";
import MatrixCreateRoomDTO from "./types/request/createRoom/MatrixCreateRoomDTO";
import MatrixCreateRoomResponseDTO, { isMatrixCreateRoomResponseDTO } from "./types/response/createRoom/MatrixCreateRoomResponseDTO";
import { isGetDirectoryRoomAliasResponseDTO } from "./types/response/directoryRoomAlias/GetDirectoryRoomAliasResponseDTO";
import RequestError from "../ts/request/types/RequestError";
import RequestStatus from "../ts/request/types/RequestStatus";
import MatrixSyncPresence from "./types/request/sync/types/MatrixSyncPresence";
import { join } from "lodash";
import MatrixSyncResponseDTO, {
    explainMatrixSyncResponseDTO,
    isMatrixSyncResponseDTO
} from "./types/response/sync/MatrixSyncResponseDTO";
import MatrixSyncResponseEventDTO from "./types/response/sync/types/MatrixSyncResponseEventDTO";
import MatrixSyncResponseAnyEventDTO
    from "./types/response/sync/types/MatrixSyncResponseAnyEventDTO";
import { getEventsFromMatrixSyncResponsePresenceDTO } from "./types/response/sync/types/MatrixSyncResponsePresenceDTO";
import { getEventsFromMatrixSyncResponseAccountDataDTO } from "./types/response/sync/types/MatrixSyncResponseAccountDataDTO";
import { getEventsFromMatrixSyncResponseToDeviceDTO } from "./types/response/sync/types/MatrixSyncResponseToDeviceDTO";
import MatrixRoomId from "./types/core/MatrixRoomId";
import MatrixSyncResponseJoinedRoomDTO, { getEventsFromMatrixSyncResponseJoinedRoomDTO } from "./types/response/sync/types/MatrixSyncResponseJoinedRoomDTO";
import MatrixSyncResponseInvitedRoomDTO, { getEventsFromMatrixSyncResponseInvitedRoomDTO } from "./types/response/sync/types/MatrixSyncResponseInvitedRoomDTO";
import MatrixSyncResponseLeftRoomDTO, { getEventsFromMatrixSyncResponseLeftRoomDTO } from "./types/response/sync/types/MatrixSyncResponseLeftRoomDTO";
import MatrixUserId from "./types/core/MatrixUserId";
import MatrixJoinRoomRequestDTO from "./types/request/joinRoom/MatrixJoinRoomRequestDTO";
import MatrixJoinRoomResponseDTO, { isMatrixJoinRoomResponseDTO } from "./types/response/joinRoom/types/MatrixJoinRoomResponseDTO";
import {
    SimpleMatrixClientState
} from "./types/SimpleMatrixClientState";
import PutRoomStateWithEventTypeDTO
    , { isPutRoomStateWithEventTypeDTO } from "./types/response/setRoomStateByType/PutRoomStateWithEventTypeDTO";

const LOG = LogService.createLogger('SimpleMatrixClient');

export enum SimpleMatrixClientEvent {

    EVENT = "SimpleMatrixClient:event"

}

export type SimpleMatrixClientDestructor = ObserverDestructor;

/**
 * Super simple matrix event listener.
 *
 * Far from perfect, but works on OpenWRT and NodeJS 8 and full POC takes only 50k as compiled :)
 */
export class SimpleMatrixClient {

    private readonly _observer        : Observer<SimpleMatrixClientEvent>;
    private readonly _originalUrl     : string;
    private readonly _pollTimeout     : number;
    private readonly _pollWaitTime    : number;
    private readonly _timeoutCallback : (() => void);

    private _state             : SimpleMatrixClientState;
    private _homeServerUrl     : string;
    private _identityServerUrl : string;
    private _accessToken       : string | undefined;
    private _userId            : string | undefined;
    private _nextBatch         : string | undefined;
    private _timer             : any;
    private _syncing           : boolean;

    public constructor (
        url                : string,
        homeServerUrl      : string | undefined = undefined,
        identityServerUrl  : string | undefined = undefined,
        accessToken        : string | undefined = undefined,
        userId             : string | undefined = undefined,
        pollTimeout        : number = 30000,
        pollWaitTime       : number = 1000
    ) {

        this._state              = accessToken ? SimpleMatrixClientState.AUTHENTICATED : SimpleMatrixClientState.UNAUTHENTICATED;
        this._originalUrl        = url;
        this._homeServerUrl      = homeServerUrl ?? url;
        this._identityServerUrl  = identityServerUrl ?? url;
        this._nextBatch          = undefined;
        this._accessToken        = accessToken;
        this._userId             = userId;
        this._pollTimeout        = pollTimeout;
        this._pollWaitTime       = pollWaitTime;
        this._syncing            = false;

        this._observer           = new Observer<SimpleMatrixClientEvent>("SimpleMatrixClient");

        this._timeoutCallback    = this._onTimeout.bind(this);

    }

    public static Event = SimpleMatrixClientEvent;

    public getState () : SimpleMatrixClientState {
        return this._state;
    }

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

    public getAccessToken () : string | undefined {
        return this._accessToken;
    }

    public getUserId () : MatrixUserId | undefined {
        return this._userId;
    }

    public getHomeServerName () : string {
        const u = new URL(this._homeServerUrl);
        return u.hostname;
    }

    /**
     *
     * @param userId
     * @param password
     * @returns New instance of SimpleMatrixClient which is in authenticated state
     */
    public async login (
        userId: string,
        password: string
    ) : Promise<SimpleMatrixClient> {

        try {

            const requestBody : MatrixPasswordLoginDTO = {
                type: MatrixType.M_LOGIN_PASSWORD,
                identifier: {
                    type: MatrixType.M_ID_USER,
                    user: userId
                },
                password: password
            };

            LOG.debug(`Sending login with userId:`, userId);

            const response : any = await RequestClient.postJson(
                this._resolveHomeServerUrl(`/login`),
                requestBody as unknown as JsonAny
            );

            if (!isMatrixLoginResponseDTO(response)) {
                LOG.debug(`Invalid response received: `, response);
                throw new TypeError(`login: Response was invalid`);
            }

            LOG.debug(`Login response received: `, response);

            let originalUrl = this._originalUrl;
            let homeServerUrl = this._homeServerUrl;
            let identityServerUrl = this._identityServerUrl;

            if (response?.well_known) {

                const responseHomeServerUrl = response.well_known['m.homeserver']?.base_url;
                if (responseHomeServerUrl) {
                    homeServerUrl = responseHomeServerUrl;
                } else {
                    homeServerUrl = originalUrl;
                }

                const responseIdentityServerUrl = response.well_known['m.identity_server']?.base_url;
                if (responseIdentityServerUrl) {
                    identityServerUrl = responseIdentityServerUrl;
                } else {
                    identityServerUrl = homeServerUrl;
                }

            } else {
                homeServerUrl     = originalUrl;
                identityServerUrl = originalUrl;
            }

            const access_token = response?.access_token;
            if (!access_token) {
                throw new TypeError(`Response did not have access_token`);
            }

            const user_id = response?.user_id;
            if (!user_id) {
                throw new TypeError(`Response did not have user_id`);
            }

            return new SimpleMatrixClient(
                originalUrl,
                homeServerUrl,
                identityServerUrl,
                access_token,
                user_id,
                this._pollTimeout,
                this._pollWaitTime
            );

        } catch (err) {

            LOG.debug(`Could not login: `, err);

            throw new RequestError(RequestStatus.Forbidden, `Access denied`);

        }

    }

    /**
     * Resolve room name (eg. alias) into room ID.
     *
     * @param name
     */
    public async resolveRoomId (name: string) : Promise<string | undefined> {

        try {

            const roomName : string = this._normalizeRoomName(name);

            const response : any = await RequestClient.getJson(
                this._resolveHomeServerUrl(`/directory/room/${q(roomName)}`)
            );

            if (!isGetDirectoryRoomAliasResponseDTO(response)) {
                LOG.debug(`resolveRoomId: response was not GetDirectoryRoomAliasResponseDTO: `, response);
                throw new TypeError(`Response was not GetDirectoryRoomAliasResponseDTO: ${response}`);
            }

            LOG.debug(`resolveRoomId: received: `, response);

            return response.room_id;

        } catch (err) {
            if (err instanceof RequestError && err.getStatusCode() === RequestStatus.NotFound) {
                return undefined;
            } else {
                throw err;
            }
        }

    }

    /**
     *
     * @param roomId
     * @param eventType
     * @param stateKey
     */
    public async getRoomStateByType (
        roomId    : string,
        eventType : string,
        stateKey  : string
    ) : Promise<JsonObject | undefined> {

        try {

            const accessToken : string | undefined = this._accessToken;
            if (!accessToken) {
                throw new TypeError(`getRoomStateByType: Client did not have access token`);
            }

            const response : any = await RequestClient.getJson(
                this._resolveHomeServerUrl(`/rooms/${q(roomId)}/state/${q(eventType)}/${q(stateKey)}`),
                {
                    'Authorization': `Bearer ${accessToken}`
                }
            );

            if (!isJsonObject(response)) {
                LOG.debug(`resolveRoomId: response was not JsonObject: `, response);
                throw new TypeError(`Response was not JsonObject: ${JSON.stringify(response)}`);
            }

            LOG.debug(`resolveRoomId: received: `, response);

            // @ts-ignore
            return response;

        } catch (err) {
            if (err instanceof RequestError && err.getStatusCode() === RequestStatus.NotFound) {
                return undefined;
            } else {
                throw err;
            }
        }

    }

    /**
     *
     * @param roomId
     * @param eventType
     * @param stateKey
     * @param body
     */
    public async setRoomStateByType (
        roomId    : string,
        eventType : string,
        stateKey  : string,
        body      : JsonObject,
    ) : Promise<PutRoomStateWithEventTypeDTO> {

        try {

            const accessToken : string | undefined = this._accessToken;
            if (!accessToken) {
                throw new TypeError(`setRoomStateByType: Client did not have access token`);
            }

            const response : JsonAny | undefined = await RequestClient.putJson(
                this._resolveHomeServerUrl(`/rooms/${q(roomId)}/state/${q(eventType)}/${q(stateKey)}`),
                body,
                {
                    'Authorization': `Bearer ${accessToken}`
                }
            );

            if (!isPutRoomStateWithEventTypeDTO(response)) {
                LOG.debug(`setRoomStateByType: response was not PutRoomStateWithEventTypeDTO: `, response);
                throw new TypeError(`Response was not PutRoomStateWithEventTypeDTO: ${JSON.stringify(response)}`);
            }

            LOG.debug(`setRoomStateByType: received: `, response);

            // @ts-ignore
            return response;

        } catch (err) {
            LOG.error(`setRoomStateByType: Passing on error: `, err);
            throw err;
        }

    }

    /**
     * Forgets a room.
     *
     * Once every member has forgot it, the room will be marked for deletion.
     *
     * @param roomId
     */
    public async forgetRoom (
        roomId    : string
    ) : Promise<void> {

        try {

            const accessToken : string | undefined = this._accessToken;
            if (!accessToken) {
                throw new TypeError(`forgetRoom: Client did not have access token`);
            }

            const response : JsonAny | undefined = await RequestClient.postJson(
                this._resolveHomeServerUrl(`/rooms/${q(roomId)}/forget`),
                {},
                {
                    'Authorization': `Bearer ${accessToken}`
                }
            );

            LOG.debug(`forgetRoom: received: `, response);

        } catch (err) {
            LOG.error(`forgetRoom: Passing on error: `, err);
            throw err;
        }

    }

    /**
     * Leave from a room.
     *
     * @param roomId
     */
    public async leaveRoom (
        roomId    : string
    ) : Promise<void> {

        try {

            const accessToken : string | undefined = this._accessToken;
            if (!accessToken) {
                throw new TypeError(`leaveRoom: Client did not have access token`);
            }

            const response : JsonAny | undefined = await RequestClient.postJson(
                this._resolveHomeServerUrl(`/rooms/${q(roomId)}/leave`),
                {},
                {
                    'Authorization': `Bearer ${accessToken}`
                }
            );

            LOG.debug(`leaveRoom: received: `, response);

        } catch (err) {
            LOG.error(`leaveRoom: Passing on error: `, err);
            throw err;
        }

    }

    public async sendTextMessage (roomId: string, body: string) : Promise<void> {

        const accessToken : string | undefined = this._accessToken;
        if (!accessToken) {
            throw new TypeError(`sendTextMessage: Client did not have access token`);
        }

        const requestBody : MatrixTextMessageDTO = {
            msgtype: 'm.text',
            body: body
        };

        LOG.debug(`Sending message with body:`, requestBody);

        const response = await RequestClient.postJson(
            this._resolveHomeServerUrl(`/rooms/${q(roomId)}/send/m.room.message`),
            requestBody as unknown as JsonAny,
            {
                'Authorization': `Bearer ${accessToken}`
            }
        );

        LOG.debug(`sendTextMessage response received: `, response);

    }

    public async createRoom (
        body: MatrixCreateRoomDTO
    ) : Promise<MatrixCreateRoomResponseDTO> {

        const accessToken : string | undefined = this._accessToken;
        if (!accessToken) {
            throw new TypeError(`createRoom: Client did not have access token`);
        }

        LOG.debug(`Creating room with body:`, body);

        const response : MatrixCreateRoomResponseDTO | any = await RequestClient.postJson(
            this._resolveHomeServerUrl( `/createRoom` ),
            body as unknown as JsonAny,
            {
                'Authorization': `Bearer ${accessToken}`
            }
        );

        if (!isMatrixCreateRoomResponseDTO(response)) {
            LOG.debug(`response = `, response);
            throw new TypeError(`Response was not MatrixCreateRoomResponseDTO: ` + response);
        }

        LOG.debug(`Create room response received: `, response);

        return response;

    }

    public async joinRoom (
        roomId : MatrixRoomId,
        body   : MatrixJoinRoomRequestDTO | undefined = undefined
    ) : Promise<MatrixJoinRoomResponseDTO> {

        const accessToken : string | undefined = this._accessToken;
        if (!accessToken) {
            throw new TypeError(`createRoom: Client did not have access token`);
        }

        LOG.debug(`Joining to room ${roomId} with body:`, body);

        const response : MatrixCreateRoomResponseDTO | any = await RequestClient.postJson(
            this._resolveHomeServerUrl( `/rooms/${q(roomId)}/join` ),
            (body ?? {}) as unknown as JsonAny,
            {
                'Authorization': `Bearer ${accessToken}`
            }
        );

        if (!isMatrixJoinRoomResponseDTO(response)) {
            LOG.debug(`response = `, response);
            throw new TypeError(`Could not join to ${roomId}: Response was not MatrixJoinRoomResponseDTO: ` + response);
        }

        LOG.debug(`Joined to room ${roomId}: `, response);

        return response;

    }

    public async sync (options : {
        filter       ?: string | JsonObject,
        since        ?: string,
        full_state   ?: boolean,
        set_presence ?: MatrixSyncPresence,
        timeout      ?: number
    }) : Promise<MatrixSyncResponseDTO> {

        LOG.info(`_sync with `, options);

        const accessToken : string | undefined = this._accessToken;
        if (!accessToken) {
            throw new TypeError(`_initSync: Client did not have access token`);
        }

        const {
            filter,
            since,
            full_state,
            set_presence,
            timeout
        } = options;

        const queryParams : {
            filter       ?: string,
            since        ?: string,
            full_state   ?: string,
            set_presence ?: string,
            timeout      ?: string
        } = {};

        if (filter !== undefined) {
            if ( isString(filter) ) {
                queryParams.filter = filter;
            } else if (isJsonObject(filter)) {
                queryParams.filter = JSON.stringify(filter);
            } else {
                throw new TypeError(`Invalid value for filter option: ${filter}`);
            }
        }

        if (since !== undefined) {
            queryParams.since = since;
        }

        if (full_state !== undefined) {
            queryParams.full_state = full_state ? 'true' : 'false';
        }

        if (set_presence !== undefined) {
            queryParams.set_presence = set_presence;
        }

        if (timeout !== undefined) {
            queryParams.timeout = `${timeout}`;
        }

        const queryString = join(
            map(
                keys(queryParams),
                (key : string) : string => {
                    // @ts-ignore
                    const value : string = queryParams[key];
                    return `${q(key)}=${q(value)}`;
                }
            ),
            '&'
        );

        const response : any = await RequestClient.getJson(
            this._resolveHomeServerUrl(`/sync?${queryString}`),
            {
                'Authorization': `Bearer ${accessToken}`
            }
        );

        if (!isMatrixSyncResponseDTO(response)) {
            LOG.debug(`_sync: response not MatrixSyncResponseDTO: `, JSON.stringify(response, null ,2));
            throw new TypeError(`Response was not MatrixSyncResponseDTO: ${explainMatrixSyncResponseDTO(response)}`);
        }

        return response;

    }


    private _sendMatrixEventList (events : readonly MatrixSyncResponseAnyEventDTO[], room_id : string | undefined) {
        forEach(events, (event) => {
            this._sendMatrixEvent(event, room_id);
        });
    }

    private _sendMatrixEvent (event : MatrixSyncResponseAnyEventDTO, room_id : string | undefined) {
        this._observer.triggerEvent(SimpleMatrixClientEvent.EVENT, room_id ? {...event, room_id} : event);
    }

    private _onTimeout () {

        if (this._syncing) {
            LOG.warn( `Warning! Already syncing...`);
            return;
        }

        // LOG.info('On timeout...');

        const nextBatch = this._nextBatch;

        if (!nextBatch) throw new TypeError(`_onTimeout: No nextBatch defined`);

        this._syncing = true;
        this._syncSince(nextBatch).then(() => {

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

    private _normalizeRoomName (name : string) {

        if ( !name || !isString(name) ) {
            throw new TypeError(`_normalizeRoomName: name is invalid: ${name}`);
        }

        if (name[0] !== '#') {
            name = `#${name}`;
        }

        if ( name.indexOf(':') < 0 ) {
            name = `${name}:${this.getHomeServerName()}`;
        }

        return name;

    }

    private async _initSync () {

        LOG.info(`Initial sync request started`);

        if (this._state !== SimpleMatrixClientState.AUTHENTICATED) {
            throw new TypeError(`_initSync: Client was not authenticated`);
        }

        const accessToken : string | undefined = this._accessToken;
        if (!accessToken) {
            throw new TypeError(`_initSync: Client did not have access token`);
        }

        this._state = SimpleMatrixClientState.AUTHENTICATED_AND_STARTING;

        const response = this.sync({

            // FIXME: Create reusable filter on the server
            filter: {
                room:{
                    timeline:{
                        limit:1
                    }
                }
            }
        });

        LOG.info(`Initial sync response received`);

        // @ts-ignore
        const next_batch : string | undefined = response.next_batch;

        if (next_batch) {
            this._nextBatch = next_batch;
        } else {
            LOG.error(`No next_batch in the response: `, response)
        }

        this._timer = setTimeout(this._timeoutCallback, this._pollWaitTime);
        LOG.info('Timer started...');

        this._state = SimpleMatrixClientState.AUTHENTICATED_AND_STARTED;

    }

    private async _syncSince (next: string) {

        const accessToken : string | undefined = this._accessToken;
        if (!accessToken) {
            throw new TypeError(`_syncSince: Client did not have access token`);
        }

        const response : MatrixSyncResponseDTO = await this.sync({
            since: next,
            timeout: this._pollTimeout
        });

        // @ts-ignore
        const next_batch : string | undefined = response.next_batch;
        if (next_batch) {
            this._nextBatch = next_batch;
        } else {
            LOG.error(`No next_batch in the response: `, response)
        }

        // LOG.debug('Response: ', response);

        const nonRoomEvents : readonly MatrixSyncResponseEventDTO[] = concat(
            response?.presence     ? getEventsFromMatrixSyncResponsePresenceDTO(response?.presence)        : [],
            response?.account_data ? getEventsFromMatrixSyncResponseAccountDataDTO(response?.account_data) : [],
            response?.to_device    ? getEventsFromMatrixSyncResponseToDeviceDTO(response?.to_device)       : [],
        );

        this._sendMatrixEventList(nonRoomEvents, undefined);

        const joinObject = response?.rooms?.join ?? {};
        const joinRoomIds = keys(joinObject);
        forEach(joinRoomIds, (roomId : MatrixRoomId) => {
            const roomObject : MatrixSyncResponseJoinedRoomDTO = joinObject[roomId];
            const events = getEventsFromMatrixSyncResponseJoinedRoomDTO(roomObject);
            this._sendMatrixEventList(events, roomId);
        });

        const inviteObject = response?.rooms?.invite ?? {};
        const inviteRoomIds = keys(inviteObject);
        forEach(inviteRoomIds, (roomId : MatrixRoomId) => {
            const roomObject : MatrixSyncResponseInvitedRoomDTO = inviteObject[roomId];
            const events = getEventsFromMatrixSyncResponseInvitedRoomDTO(roomObject);
            this._sendMatrixEventList(events, roomId);
        });

        const leaveObject = response?.rooms?.leave ?? {};
        const leaveRoomIds = keys(leaveObject);
        forEach(leaveRoomIds, (roomId : MatrixRoomId) => {
            const roomObject : MatrixSyncResponseLeftRoomDTO = leaveObject[roomId];
            const events = getEventsFromMatrixSyncResponseLeftRoomDTO(roomObject);
            this._sendMatrixEventList(events, roomId);
        });

    }

    private _resolveHomeServerUrl (path : string) : string {
        const homeUrl = this._homeServerUrl;
        const p1 = homeUrl[homeUrl.length-1] === '/' ? '' : '/';
        const p2 = path[0] === '/' ? '' : '/';
        return `${homeUrl}${p1}_matrix/client/r0${p2}${path}`;
    }

}

function q (value: string) : string {
    return encodeURIComponent(value);
}

export default SimpleMatrixClient;

