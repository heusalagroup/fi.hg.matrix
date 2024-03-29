// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { SimpleMatrixClient } from "./SimpleMatrixClient";
import { LogService } from "../core/LogService";
import { Observer, ObserverCallback } from "../core/Observer";
import { DEFAULT_IO_SERVER_HOSTNAME } from "./constants/matrix-backend";
import { SimpleSharedClientService, SharedClientServiceDestructor} from "../core/simpleRepository/types/SimpleSharedClientService";
import { SimpleSharedClientServiceEvent } from "../core/simpleRepository/types/SimpleSharedClientServiceEvent";

const LOG = LogService.createLogger('MatrixSharedClientService');

/**
 * This service can be used to offer shared access to SimpleMatrixClient
 * instance. We use it for our services using MatrixCrudRepository.
 */
export class MatrixSharedClientService implements SimpleSharedClientService {

    public Event = SimpleSharedClientServiceEvent;

    private _observer           : Observer<SimpleSharedClientServiceEvent>;
    private _client             : SimpleMatrixClient | undefined;
    private _initInProgress     : boolean;
    private _loginInProgress    : boolean;
    private _defaultServer      : string;

    public constructor () {
        this._observer = new Observer<SimpleSharedClientServiceEvent>("MatrixSharedClientService");
        this._client = undefined;
        this._initInProgress = true;
        this._loginInProgress = false;
        this._defaultServer = DEFAULT_IO_SERVER_HOSTNAME;
    }

    public destroy (): void {
        this._observer.destroy();
    }

    public getClient () : SimpleMatrixClient | undefined {
        return this._client;
    }

    public setDefaultServer (value: string) {
        this._defaultServer = value;
    }

    public isInitializing () : boolean {
        return this._initInProgress;
    }

    /**
     *
     * @param name
     * @param callback
     */
    public on (
        name: SimpleSharedClientServiceEvent,
        callback: ObserverCallback<SimpleSharedClientServiceEvent>
    ): SharedClientServiceDestructor {
        return this._observer.listenEvent(name, callback);
    }

    /**
     *
     * @param url
     */
    public async login (
        url: string
    ) : Promise<void> {
        if (this._loginInProgress) {
            throw new TypeError('Another login already in progress');
        }
        LOG.debug(`login: Parsing URL "${url}"`);
        const u = new URL(url);
        const proto = u?.protocol;
        const hostname = u?.hostname ?? this._defaultServer;
        const port = u?.port;
        const username = decodeURIComponent(u?.username ?? '');
        const password = decodeURIComponent(u?.password ?? '');
        const hsUrl = `${proto}//${hostname}:${port}`;
        LOG.debug(`Creating client to "${hsUrl}"`);
        let client : SimpleMatrixClient = new SimpleMatrixClient(hsUrl);
        this._loginInProgress = true;
        LOG.debug(`Logging in to "https://${hostname}" as "${username}" with "${password}"`);
        client = await client.login(username, password);
        LOG.info(`Logged in to "${hostname}" as "${username}"`);
        this._loginInProgress = false;
        this._client = client;
        if (this._observer.hasCallbacks(SimpleSharedClientServiceEvent.LOGGED_IN)) {
            this._observer.triggerEvent(SimpleSharedClientServiceEvent.LOGGED_IN);
        }
    }

    /**
     *
     * @param url
     */
    public async initialize (
        url      : string
    ) : Promise<void> {
        LOG.debug(`Initialization started: `, url);
        this._initInProgress = true;
        await this.login(url);
        LOG.debug(`Initialization finished: `, url);
        this._initInProgress = false;
        if(this._observer.hasCallbacks(SimpleSharedClientServiceEvent.INITIALIZED)) {
            this._observer.triggerEvent(SimpleSharedClientServiceEvent.INITIALIZED);
        }
    }

    /**
     *
     */
    public async waitForInitialization () : Promise<void> {
        if (this._initInProgress) {
            let listener : any;
            try {
                await new Promise<void>((resolve, reject) => {
                    try {
                        listener = this._observer.listenEvent(
                            SimpleSharedClientServiceEvent.INITIALIZED,
                            () => {
                                try {
                                    if (listener) {
                                        listener();
                                        listener = undefined;
                                    }

                                    resolve();
                                } catch(err) {
                                    reject(err);
                                }
                            }
                        );
                    } catch(err) {
                        reject(err);
                    }
                });
            } finally {
                if (listener) {
                    listener();
                    listener = undefined;
                }
            }
        }
    }

}
