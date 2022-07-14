// Copyright (c) 2021 Sendanor. All rights reserved.

import {
    concat,
    forEach,
    isString,
    keys
} from "../core/modules/lodash";
import { Observer,  ObserverCallback, ObserverDestructor } from "../core/Observer";
import { RequestClient } from "../core/RequestClient";
import { LogService } from "../core/LogService";
import { JsonAny } from "../core/Json";
import { JsonAny as Json, isJsonObject, JsonObject } from "../core/Json";
import { createMatrixPasswordLoginRequestDTO, MatrixPasswordLoginRequestDTO } from "./types/request/passwordLogin/MatrixPasswordLoginRequestDTO";
import { createMatrixTextMessageDTO, MatrixTextMessageDTO } from "./types/message/textMessage/MatrixTextMessageDTO";
import { MatrixType } from "./types/core/MatrixType";
import { isMatrixLoginResponseDTO } from "./types/response/login/MatrixLoginResponseDTO";
import { MatrixCreateRoomDTO } from "./types/request/createRoom/MatrixCreateRoomDTO";
import { MatrixCreateRoomResponseDTO,  isMatrixCreateRoomResponseDTO } from "./types/response/createRoom/MatrixCreateRoomResponseDTO";
import { isGetDirectoryRoomAliasResponseDTO } from "./types/response/directoryRoomAlias/GetDirectoryRoomAliasResponseDTO";
import { RequestError } from "../core/request/types/RequestError";
import { RequestStatus } from "../core/request/types/RequestStatus";
import { MatrixSyncPresence } from "./types/request/sync/types/MatrixSyncPresence";
import { MatrixSyncResponseDTO,
    explainMatrixSyncResponseDTO,
    isMatrixSyncResponseDTO
} from "./types/response/sync/MatrixSyncResponseDTO";
import { MatrixSyncResponseEventDTO } from "./types/response/sync/types/MatrixSyncResponseEventDTO";
import { MatrixSyncResponseAnyEventDTO } from "./types/response/sync/types/MatrixSyncResponseAnyEventDTO";
import { getEventsFromMatrixSyncResponsePresenceDTO } from "./types/response/sync/types/MatrixSyncResponsePresenceDTO";
import { getEventsFromMatrixSyncResponseAccountDataDTO } from "./types/response/sync/types/MatrixSyncResponseAccountDataDTO";
import { getEventsFromMatrixSyncResponseToDeviceDTO } from "./types/response/sync/types/MatrixSyncResponseToDeviceDTO";
import { MatrixRoomId,  isMatrixRoomId } from "./types/core/MatrixRoomId";
import { MatrixSyncResponseJoinedRoomDTO,  getEventsFromMatrixSyncResponseJoinedRoomDTO } from "./types/response/sync/types/MatrixSyncResponseJoinedRoomDTO";
import { MatrixSyncResponseInvitedRoomDTO,  getEventsFromMatrixSyncResponseInvitedRoomDTO } from "./types/response/sync/types/MatrixSyncResponseInvitedRoomDTO";
import { MatrixSyncResponseLeftRoomDTO,  getEventsFromMatrixSyncResponseLeftRoomDTO } from "./types/response/sync/types/MatrixSyncResponseLeftRoomDTO";
import { MatrixUserId,  isMatrixUserId } from "./types/core/MatrixUserId";
import { MatrixJoinRoomRequestDTO } from "./types/request/joinRoom/MatrixJoinRoomRequestDTO";
import { MatrixJoinRoomResponseDTO,  isMatrixJoinRoomResponseDTO } from "./types/response/joinRoom/MatrixJoinRoomResponseDTO";
import {
    SimpleMatrixClientState,
    stringifySimpleMatrixClientState
} from "./types/SimpleMatrixClientState";
import { PutRoomStateWithEventTypeResponseDTO,  isPutRoomStateWithEventTypeResponseDTO } from "./types/response/setRoomStateByType/PutRoomStateWithEventTypeResponseDTO";
import { MatrixRoomJoinedMembersDTO,  isMatrixRoomJoinedMembersDTO } from "./types/response/roomJoinedMembers/MatrixRoomJoinedMembersDTO";
import { MatrixRegisterKind } from "./types/request/register/types/MatrixRegisterKind";
import { MatrixRegisterRequestDTO } from "./types/request/register/MatrixRegisterRequestDTO";
import { MatrixRegisterResponseDTO,  isMatrixRegisterResponseDTO } from "./types/response/register/MatrixRegisterResponseDTO";
import { isMatrixErrorDTO } from "./types/response/error/MatrixErrorDTO";
import { MatrixErrorCode } from "./types/response/error/types/MatrixErrorCode";
import { SynapseRegisterResponseDTO,  isSynapseRegisterResponseDTO } from "./types/synapse/SynapseRegisterResponseDTO";
import { SynapseRegisterRequestDTO } from "./types/synapse/SynapseRegisterRequestDTO";
import { VoidCallback } from "../core/interfaces/callbacks";
import { LogLevel } from "../core/types/LogLevel";
import {
    MATRIX_AUTHORIZATION_HEADER_NAME,
    MATRIX_CREATE_ROOM_URL,
    MATRIX_JOIN_ROOM_URL,
    MATRIX_JOINED_MEMBERS_URL,
    MATRIX_LOGIN_URL,
    MATRIX_REGISTER_URL,
    MATRIX_ROOM_DIRECTORY_URL,
    MATRIX_ROOM_EVENT_STATE_FETCH_URL,
    MATRIX_ROOM_EVENT_STATE_UPDATE_URL,
    MATRIX_ROOM_FORGET_URL,
    MATRIX_ROOM_INVITE_URL,
    MATRIX_ROOM_LEAVE_URL,
    MATRIX_ROOM_SEND_EVENT_URL,
    MATRIX_SYNC_URL,
    MATRIX_WHOAMI_URL,
    MatrixSyncQueryParams,
    SYNAPSE_REGISTER_URL
} from "./constants/matrix-routes";
import { AuthorizationUtils } from "../core/AuthorizationUtils";
import { isMatrixWhoAmIResponseDTO } from "./types/response/whoami/MatrixWhoAmIResponseDTO";
import { createMatrixIdentifierDTO } from "./types/request/login/types/MatrixIdentifierDTO";
import { GetRoomStateByTypeResponseDTO, isGetRoomStateByTypeResponseDTO } from "./types/response/getRoomStateByType/GetRoomStateByTypeResponseDTO";
import { SetRoomStateByTypeRequestDTO } from "./types/request/setRoomStateByType/SetRoomStateByTypeRequestDTO";

const LOG = LogService.createLogger('SimpleMatrixClient');

export enum SimpleMatrixClientEvent {
    EVENT = "SimpleMatrixClient:event"
}

export type SimpleMatrixClientDestructor = ObserverDestructor;

const DEFAULT_WAIT_FOR_EVENTS_TIMEOUT = 30000;

interface SyncAgainCallback {
    (triggerEvents: boolean) : void;
}

/**
 * Super lightweight Matrix client and simple event listener.
 *
 * Far from perfect, but works both on browser and on OpenWRT with NodeJS 8 and full POC takes only
 * 50k as compiled single bundle file (including all the dependencies) :)
 */
export class SimpleMatrixClient {

    public static Event = SimpleMatrixClientEvent;

    public static setLogLevel (level: LogLevel) {
        LOG.setLogLevel(level);
    }


    private readonly _observer                 : Observer<SimpleMatrixClientEvent>;
    private readonly _originalUrl              : string;
    private readonly _homeServerUrl            : string;
    private readonly _identityServerUrl        : string;
    private readonly _accessToken              : string | undefined;

    private readonly _syncAgainTimeMs          : number;
    private readonly _syncRequestTimeoutMs     : number;
    private readonly _syncAgainTimeoutCallback : VoidCallback;
    private readonly _initSyncAgainTimeoutCallback : SyncAgainCallback;

    private _state              : SimpleMatrixClientState;
    private _userId             : string | undefined;
    private _stopSyncOnNext     : boolean;
    private _nextSyncBatch      : string | undefined;
    private _syncAgainTimer     : any    | undefined;
    private _initSyncAgainTimer : any    | undefined;

    /**
     * Create an instance of SimpleMatrixClient.
     *
     * @param url                 The URL of the Matrix server to login
     *
     * @param homeServerUrl       Optional. The Matrix server URL for a logged in session.
     *
     * @param identityServerUrl   Optional. The Matrix identity server URL for a logged in session.
     *
     * @param accessToken         Optional. The access key for a logged in session.
     *
     * @param userId              Optional. The Matrix user ID for a logged in session.
     *
     * @param pollTimeout         Optional. The default poll time in milliseconds to poll changes
     *                            from upstream Matrix server.
     *
     * @param pollWaitTime        Optional. The default wait time between polls, in milliseconds.
     *
     */
    public constructor (
        url                : string,
        homeServerUrl      : string       | undefined = undefined,
        identityServerUrl  : string       | undefined = undefined,
        accessToken        : string       | undefined = undefined,
        userId             : MatrixUserId | undefined = undefined,
        pollTimeout        : number = 30000,
        pollWaitTime       : number = 1000
    ) {

        this._stopSyncOnNext                = false;
        this._state                         = accessToken ? SimpleMatrixClientState.AUTHENTICATED : SimpleMatrixClientState.UNAUTHENTICATED;
        this._originalUrl                   = url;
        this._homeServerUrl                 = SimpleMatrixClient._normalizeUrl( homeServerUrl ?? url );
        this._identityServerUrl             = identityServerUrl ?? url;
        this._nextSyncBatch                 = undefined;
        this._accessToken                   = accessToken;
        this._userId                        = userId;
        this._syncRequestTimeoutMs          = pollTimeout;
        this._syncAgainTimeMs               = pollWaitTime;
        this._observer                      = new Observer<SimpleMatrixClientEvent>("SimpleMatrixClient");
        this._syncAgainTimeoutCallback      = this._onSyncAgainTimeout.bind(this);
        this._initSyncAgainTimeoutCallback  = this._onInitSyncAgain.bind(this);

    }

    /**
     * Returns the current state of the client instance.
     */
    public getState () : SimpleMatrixClientState {
        return this._state;
    }

    /**
     * Returns the current access token
     */
    public getAccessToken () : string | undefined {
        return this._accessToken;
    }

    /**
     * Returns the current logged in Matrix user ID
     */
    public getUserId () : MatrixUserId | undefined {
        return this._userId;
    }

    /**
     * Returns the hostname of the current Matrix home server
     */
    public getHomeServerName () : string {
        const u = new URL(this._homeServerUrl);
        return u.hostname;
    }

    public isAlreadyInTheRoom (body: any) : boolean {

        if (isMatrixErrorDTO(body)) {

            const errCode   : string = body?.errcode ?? '';
            const errString : string = body?.error   ?? '';

            if ( errCode === MatrixErrorCode.M_FORBIDDEN
                && errString.indexOf('already in the room') >= 0
            ) {
                return true;
            }

        }
        return false;

    }

    public isUnauthenticated () : boolean {
        return this._state === SimpleMatrixClientState.UNAUTHENTICATED;
    }

    public isAuthenticating () : boolean {
        return this._state === SimpleMatrixClientState.AUTHENTICATING;
    }

    public isAuthenticated () : boolean {
        return this._state === SimpleMatrixClientState.AUTHENTICATED;
    }

    public isStarting () : boolean {
        return this._state === SimpleMatrixClientState.AUTHENTICATED_AND_STARTING;
    }

    public isRestarting () : boolean {
        return this._state === SimpleMatrixClientState.AUTHENTICATED_AND_RESTARTING;
    }

    public isStarted () : boolean {
        return this._state === SimpleMatrixClientState.AUTHENTICATED_AND_STARTED;
    }

    public isStopping () : boolean {
        return this._stopSyncOnNext;
    }

    public isSyncing () : boolean {
        return this._state === SimpleMatrixClientState.AUTHENTICATED_AND_SYNCING;
    }

    /**
     * Destroys the current client instance, including all observers.
     *
     * You should not use this instance anymore after you call this method.
     */
    public destroy (): void {

        switch (this._state) {

            case SimpleMatrixClientState.UNAUTHENTICATED:
            case SimpleMatrixClientState.AUTHENTICATING:
            case SimpleMatrixClientState.AUTHENTICATED:
                break;

            case SimpleMatrixClientState.AUTHENTICATED_AND_STARTING:
            case SimpleMatrixClientState.AUTHENTICATED_AND_RESTARTING:
            case SimpleMatrixClientState.AUTHENTICATED_AND_STARTED:
            case SimpleMatrixClientState.AUTHENTICATED_AND_SYNCING:
                this._stopSyncing();
                break;

        }

        this._clearSyncAgainTimer();
        this._clearInitSyncAgainTimer();
        this._observer.destroy();

    }

    /**
     * Start listening some events.
     *
     * @param name
     * @param callback
     */
    public on (
        name: SimpleMatrixClientEvent,
        callback: ObserverCallback<SimpleMatrixClientEvent>
    ): SimpleMatrixClientDestructor {
        return this._observer.listenEvent(name, callback);
    }

    /**
     * Start the long polling event listener from Matrix server.
     *
     * @FIXME: This could be started automatically from listeners in our own observer. If so, this
     *         method could be changed to private later.
     */
    public start (triggerEvents : boolean = true) {
        this._startSyncing(triggerEvents);
    }

    /**
     * Stop the long polling event listener from Matrix server.
     *
     * It will not remove any listeners.
     *
     * @FIXME: This could be stopped automatically when listeners are removed from our own
     *     observer. If so, this method could be changed to private later.
     */
    public stop () {
        this._stopSyncing();
    }

    public async register (
        requestBody  : MatrixRegisterRequestDTO,
        kind         : MatrixRegisterKind | undefined = undefined,
        accessToken ?: string
    ) : Promise<MatrixRegisterResponseDTO> {

        try {

            LOG.debug(`register: Registering user:`, requestBody, kind);

            const access_token : string | undefined = this?._accessToken ?? accessToken ?? undefined;

            const response : any = await this._postJson(
                this._homeServerUrl + MATRIX_REGISTER_URL(kind),
                requestBody as unknown as JsonAny,
                access_token ? {
                    [MATRIX_AUTHORIZATION_HEADER_NAME]: AuthorizationUtils.createBearerHeader(accessToken)
                } : undefined
            );

            if (!isMatrixRegisterResponseDTO(response)) {
                LOG.debug(`Invalid response received: `, response);
                throw new TypeError(`register: Response was invalid`);
            }

            LOG.debug(`register: RegisterResponseDTO received: `, response);

            return response;

        } catch (err : any) {

            LOG.warn(`register: Could not register user: `, err);

            if (err instanceof RequestError) {

                const statusCode = err?.getStatusCode();

                if ( statusCode === 400 ) {

                    const errorBody: any = err?.getBody() ?? err?.body;

                    if ( isMatrixErrorDTO(errorBody) ) {
                        switch (errorBody.errcode) {
                            case MatrixErrorCode.M_USER_IN_USE:
                                throw new RequestError(RequestStatus.Conflict, `User already exists`);
                            case MatrixErrorCode.M_INVALID_USERNAME:
                                throw new RequestError(RequestStatus.BadRequest, `Username invalid`);
                            case MatrixErrorCode.M_EXCLUSIVE:
                                throw new RequestError(RequestStatus.Conflict, `User name conflicts with exclusive namespace`);
                            default:
                                throw new RequestError(RequestStatus.InternalServerError, `Failed to register user`);
                        }

                    } else {
                        throw new RequestError(RequestStatus.InternalServerError, `Failed to register user`);
                    }

                } else if ( statusCode === 401 ) {
                    throw new RequestError(RequestStatus.Unauthorized);

                } else if ( statusCode === 403 ) {
                    throw new RequestError(RequestStatus.Forbidden);

                } else if ( statusCode === 429 ) {
                    // Rate limited
                    // FIXME: implement special exception that contains the retry_after_ms property and/or handle it here
                    throw new RequestError(429);

                } else {
                    throw new RequestError(RequestStatus.InternalServerError, `Failed to register user`);
                }

            } else {
                throw new RequestError(RequestStatus.InternalServerError, `Failed to register user`);
            }

        }

    }

    public async whoami () : Promise<string | undefined> {

        const accessToken : string | undefined = this._accessToken;
        if (!accessToken) {
            throw new TypeError(`whoami: Client did not have access token`);
        }

        try {

            LOG.debug(`whoami: Fetching account whoami... `);

            const response : any = await this._getJson(
                this._homeServerUrl + MATRIX_WHOAMI_URL,
                {
                    [MATRIX_AUTHORIZATION_HEADER_NAME]: AuthorizationUtils.createBearerHeader(accessToken)
                }
            );
            LOG.debug(`whoami: response = `, response);

            if (!isMatrixWhoAmIResponseDTO(response)) {
                // @FIXME: This probably should result in an error promise
                LOG.error(`whoami: Response was not MatrixWhoAmIResponseDTO: `, response);
                return undefined;
            }

            const user_id = response?.user_id ?? undefined;
            LOG.debug(`whoami: user_id = `, user_id);

            const userId = isString(user_id) ? user_id : undefined;
            this._userId = userId;
            return userId;

        } catch (err : any) {
            LOG.error(`whoami: Could not fetch user_id: `, err);
            return undefined;
        }

    }

    public async getRegisterNonce () : Promise<string> {

        try {

            LOG.debug(`Fetching nonce for registration...`);

            const nonceResponse : any = await this._getJson(this._homeServerUrl + SYNAPSE_REGISTER_URL);

            const nonce = nonceResponse?.nonce ?? undefined;
            if (!nonce) throw new TypeError(`No nonce detected`);

            return nonce;

        } catch (err : any) {

            LOG.debug(`Could not fetch nonce for registration: `, err);

            throw new TypeError(`Could not fetch nonce for the register request. Is it Synapse?`);

        }

    }

    /**
     * This call requires correctly configured Synapse and a shared secret code.
     *
     * See `SynapseUtils.createRegisterDTO(...)` and `.getRegisterNonce()` to create a DTO.
     * Note, it requires NodeJS crypto module.
     *
     * @param requestBody
     * @see https://matrix-org.github.io/synapse/latest/admin_api/register_api.html
     */
    public async registerWithSharedSecret (
        requestBody  : SynapseRegisterRequestDTO
    ) : Promise<SynapseRegisterResponseDTO> {

        try {

            LOG.debug(`registerWithSharedSecret: Registering user:`, requestBody);

            const response : any = await this._postJson(
                this._homeServerUrl + SYNAPSE_REGISTER_URL,
                requestBody as unknown as JsonAny
            );

            if (!isSynapseRegisterResponseDTO(response)) {
                LOG.debug(`registerWithSharedSecret: Invalid response received: `, response);
                throw new TypeError(`registerWithSharedSecret: Response was invalid`);
            }

            LOG.debug(`registerWithSharedSecret: RegisterResponseDTO received: `, response);

            return response;

        } catch (err : any) {

            LOG.warn(`registerWithSharedSecret: Could not register user: `, err);

            if (err instanceof RequestError) {

                const statusCode = err?.getStatusCode();

                if ( statusCode === 400 ) {

                    const errorBody: any = err?.getBody() ?? err?.body;

                    if ( isMatrixErrorDTO(errorBody) ) {
                        switch (errorBody.errcode) {
                            case MatrixErrorCode.M_USER_IN_USE:
                                throw new RequestError(RequestStatus.Conflict, `User already exists`);
                            case MatrixErrorCode.M_INVALID_USERNAME:
                                throw new RequestError(RequestStatus.BadRequest, `Username invalid`);
                            case MatrixErrorCode.M_EXCLUSIVE:
                                throw new RequestError(RequestStatus.Conflict, `User name conflicts with exclusive namespace`);
                            default:
                                throw new RequestError(RequestStatus.InternalServerError, `Failed to register user`);
                        }

                    } else {
                        throw new RequestError(RequestStatus.InternalServerError, `Failed to register user`);
                    }

                } else if ( statusCode === 401 ) {
                    throw new RequestError(RequestStatus.Unauthorized);

                } else if ( statusCode === 403 ) {
                    throw new RequestError(RequestStatus.Forbidden);

                } else if ( statusCode === 429 ) {
                    // Rate limited
                    // FIXME: implement special exception that contains the retry_after_ms property and/or handle it here
                    throw new RequestError(429);

                } else {
                    throw new RequestError(RequestStatus.InternalServerError, `Failed to register user`);
                }

            } else {
                throw new RequestError(RequestStatus.InternalServerError, `Failed to register user`);
            }

        }

    }

    /**
     * Log in to the matrix server
     *
     * @param userId    The Matrix user ID to log into
     * @param password  The Matrix user password
     * @returns New instance of SimpleMatrixClient which is initialized in to the authenticated
     *     state
     */
    public async login (
        userId   : MatrixUserId,
        password : string
    ) : Promise<SimpleMatrixClient> {

        try {

            const requestBody : MatrixPasswordLoginRequestDTO = createMatrixPasswordLoginRequestDTO(
                createMatrixIdentifierDTO(userId),
                password
            );

            LOG.debug(`Sending login with userId:`, userId);

            const response : any = await this._postJson(
                this._homeServerUrl + MATRIX_LOGIN_URL,
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

                const responseHomeServerUrl = response.well_known[MatrixType.M_HOMESERVER]?.base_url;
                if (responseHomeServerUrl) {
                    homeServerUrl = responseHomeServerUrl;
                } else {
                    homeServerUrl = originalUrl;
                }

                const responseIdentityServerUrl = response.well_known[MatrixType.M_IDENTITY_SERVER]?.base_url;
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
                this._syncRequestTimeoutMs,
                this._syncAgainTimeMs
            );

        } catch (err : any) {

            LOG.debug(`Could not login: `, err);

            throw new RequestError(RequestStatus.Forbidden, `Access denied`);

        }

    }

    /**
     * Authenticate to the Matrix server using access key
     *
     * @param access_token  The Matrix access key
     * @returns New instance of SimpleMatrixClient which is initialized in to the authenticated
     *     state
     */
    public async authenticate (
        access_token : string
    ) : Promise<SimpleMatrixClient> {

        try {

            return new SimpleMatrixClient(
                this._originalUrl,
                undefined,
                undefined,
                access_token,
                undefined,
                this._syncRequestTimeoutMs,
                this._syncAgainTimeMs
            );

        } catch (err : any) {

            LOG.debug(`Could not login: `, err);

            throw new RequestError(RequestStatus.Forbidden, `Access denied`);

        }

    }

    /**
     * Resolve room name (eg. alias) into room ID.
     *
     * Eg. if you say `'foo'` here, it will be converted to `'#foo:homeServerHostname'`.
     *
     * @param name
     */
    public async resolveRoomId (name: string) : Promise<string | undefined> {

        try {

            const roomName : string = this._normalizeRoomName(name);

            const response : any = await this._getJson(
                this._homeServerUrl + MATRIX_ROOM_DIRECTORY_URL(roomName)
            );

            if (!isGetDirectoryRoomAliasResponseDTO(response)) {
                LOG.debug(`resolveRoomId: response was not GetDirectoryRoomAliasResponseDTO: `, response);
                throw new TypeError(`Response was not GetDirectoryRoomAliasResponseDTO: ${response}`);
            }

            LOG.debug(`resolveRoomId: received: `, response);

            return response.room_id;

        } catch (err : any) {
            if (err instanceof RequestError && err.getStatusCode() === RequestStatus.NotFound) {
                return undefined;
            } else {
                LOG.warn(`resolveRoomId: Passing on error: `, err);
                throw err;
            }
        }

    }

    /**
     * Returns joined members from the homeserver
     *
     * @param roomId
     */
    public async getJoinedMembers (roomId: MatrixRoomId) : Promise<MatrixRoomJoinedMembersDTO> {

        const accessToken : string | undefined = this._accessToken;
        if (!accessToken) {
            throw new TypeError(`getJoinedMembers: Client did not have access token`);
        }

        const response : any = await this._getJson(
            this._homeServerUrl + MATRIX_JOINED_MEMBERS_URL(roomId),
            {
                [MATRIX_AUTHORIZATION_HEADER_NAME]: AuthorizationUtils.createBearerHeader(accessToken)
            }
        );

        if (!isMatrixRoomJoinedMembersDTO(response)) {
            LOG.debug(`getJoinedMembers: response was not MatrixRoomJoinedMembersDTO: `, response);
            throw new TypeError(`Response was not MatrixRoomJoinedMembersDTO: ${response}`);
        }

        LOG.debug(`getJoinedMembers: received: `, response);

        return response;

    }

    /**
     * Returns a room state value of tuple `roomId,eventType,StateKey`.
     *
     * @param roomId
     * @param eventType
     * @param stateKey
     */
    public async getRoomStateByType (
        roomId    : string,
        eventType : string,
        stateKey  : string
    ) : Promise<GetRoomStateByTypeResponseDTO | undefined> {

        try {

            const accessToken : string | undefined = this._accessToken;
            if (!accessToken) {
                throw new TypeError(`getRoomStateByType: Client did not have access token`);
            }

            LOG.debug(`getRoomStateByType: roomId="${roomId}", eventType="${eventType}", stateKey="${stateKey}" `);

            const response : any = await this._getJson(
                this._homeServerUrl + MATRIX_ROOM_EVENT_STATE_FETCH_URL(roomId, eventType, stateKey),
                {
                    [MATRIX_AUTHORIZATION_HEADER_NAME]: AuthorizationUtils.createBearerHeader(accessToken)
                }
            );

            if (!isGetRoomStateByTypeResponseDTO(response)) {
                LOG.debug(`getRoomStateByType: response was not GetRoomStateByTypeResponseDTO: `, response);
                throw new TypeError(`Response was not GetRoomStateByTypeResponseDTO: ${JSON.stringify(response)}`);
            }

            LOG.debug(`getRoomStateByType: received: `, response);

            return response;

        } catch (err : any) {
            if (err instanceof RequestError && err.getStatusCode() === RequestStatus.NotFound) {
                return undefined;
            } else {
                LOG.warn(`getRoomStateByType: Passing on error: `, err);
                throw err;
            }
        }

    }

    /**
     * Sets room state value of tuple `roomId,eventType,StateKey`
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
        body      : SetRoomStateByTypeRequestDTO,
    ) : Promise<PutRoomStateWithEventTypeResponseDTO> {
        try {

            const accessToken : string | undefined = this._accessToken;
            if (!accessToken) {
                throw new TypeError(`setRoomStateByType: Client did not have access token`);
            }

            const response : JsonAny | undefined = await this._putJson(
                this._homeServerUrl + MATRIX_ROOM_EVENT_STATE_UPDATE_URL(roomId, eventType, stateKey),
                body as unknown as JsonObject,
                {
                    [MATRIX_AUTHORIZATION_HEADER_NAME]: AuthorizationUtils.createBearerHeader(accessToken)
                }
            );

            if (!isPutRoomStateWithEventTypeResponseDTO(response)) {
                LOG.debug(`setRoomStateByType: response was not PutRoomStateWithEventTypeDTO: `, response);
                throw new TypeError(`Response was not PutRoomStateWithEventTypeDTO: ${JSON.stringify(response)}`);
            }

            LOG.debug(`setRoomStateByType: received: `, response);

            // @ts-ignore
            return response;

        } catch (err : any) {
            LOG.error(`setRoomStateByType: Passing on error: `, err);
            throw err;
        }

    }

    /**
     * Forgets a room.
     *
     * Once every member has forgot it, the room will be marked for deletion in homeserver.
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

            const response : JsonAny | undefined = await this._postJson(
                this._homeServerUrl + MATRIX_ROOM_FORGET_URL(roomId),
                {},
                {
                    [MATRIX_AUTHORIZATION_HEADER_NAME]: AuthorizationUtils.createBearerHeader(accessToken)
                }
            );

            LOG.debug(`forgetRoom: received: `, response);

        } catch (err : any) {
            LOG.warn(`forgetRoom: Passing on error: `, err);
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

            const response : JsonAny | undefined = await this._postJson(
                this._homeServerUrl + MATRIX_ROOM_LEAVE_URL(roomId),
                {},
                {
                    [MATRIX_AUTHORIZATION_HEADER_NAME]: AuthorizationUtils.createBearerHeader(accessToken)
                }
            );

            LOG.debug(`leaveRoom: received: `, response);

        } catch (err : any) {
            LOG.warn(`leaveRoom: Passing on error: `, err);
            throw err;
        }

    }

    /**
     * Invite user to a room.
     *
     * @param roomId
     * @param userId
     */
    public async inviteToRoom (
        roomId : MatrixRoomId,
        userId : MatrixUserId
    ) : Promise<void> {

        try {

            if (!isMatrixRoomId(roomId)) {
                throw new TypeError(`inviteToRoom: roomId invalid: ${roomId}`);
            }

            if (!isMatrixUserId(userId)) {
                throw new TypeError(`inviteToRoom: userId invalid: ${userId}`);
            }

            LOG.info(`Inviting user ${userId} to ${roomId}`);

            const accessToken : string | undefined = this._accessToken;
            if (!accessToken) {
                throw new TypeError(`inviteToRoom: Client did not have access token`);
            }

            const response : JsonAny | undefined = await this._postJson(
                this._homeServerUrl + MATRIX_ROOM_INVITE_URL(roomId),
                {
                    user_id: userId
                },
                {
                    [MATRIX_AUTHORIZATION_HEADER_NAME]: AuthorizationUtils.createBearerHeader(accessToken)
                }
            );

            LOG.debug(`inviteToRoom: received: `, response);

        } catch (err : any) {

            if ( this.isAlreadyInTheRoom(err?.body) ) return;

            LOG.warn(`inviteToRoom: Passing on error: `, err);
            throw err;
        }

    }

    /**
     * Send text message to the room.
     *
     * @param roomId The room ID
     * @param body   The message string
     */
    public async sendTextMessage (roomId: string, body: string) : Promise<void> {

        const accessToken : string | undefined = this._accessToken;
        if (!accessToken) {
            throw new TypeError(`sendTextMessage: Client did not have access token`);
        }

        const requestBody : MatrixTextMessageDTO = createMatrixTextMessageDTO(body);
        LOG.debug(`Sending message with body:`, requestBody);

        const response : Json | undefined = await this._postJson(
            this._homeServerUrl + MATRIX_ROOM_SEND_EVENT_URL(roomId, MatrixType.M_ROOM_MESSAGE),
            requestBody as unknown as JsonAny,
            {
                [MATRIX_AUTHORIZATION_HEADER_NAME]: AuthorizationUtils.createBearerHeader(accessToken)
            }
        );

        LOG.debug(`sendTextMessage response received: `, response);

    }

    /**
     * Create a room.
     *
     * @param body
     */
    public async createRoom (
        body: MatrixCreateRoomDTO
    ) : Promise<MatrixCreateRoomResponseDTO> {

        const accessToken : string | undefined = this._accessToken;
        if (!accessToken) {
            throw new TypeError(`createRoom: Client did not have access token`);
        }

        LOG.debug(`Creating room with body:`, body);

        const response : MatrixCreateRoomResponseDTO | any = await this._postJson(
            this._homeServerUrl + MATRIX_CREATE_ROOM_URL,
            body as unknown as JsonAny,
            {
                [MATRIX_AUTHORIZATION_HEADER_NAME]: AuthorizationUtils.createBearerHeader(accessToken)
            }
        );

        if (!isMatrixCreateRoomResponseDTO(response)) {
            LOG.debug(`response = `, response);
            throw new TypeError(`Response was not MatrixCreateRoomResponseDTO: ` + response);
        }

        LOG.debug(`Create room response received: `, response);

        return response;

    }

    /**
     * Join to a room.
     *
     * @param roomId
     * @param body
     */
    public async joinRoom (
        roomId : MatrixRoomId,
        body   : MatrixJoinRoomRequestDTO | undefined = undefined
    ) : Promise<MatrixJoinRoomResponseDTO> {

        try {

            const accessToken : string | undefined = this._accessToken;
            if (!accessToken) {
                throw new TypeError(`createRoom: Client did not have access token`);
            }

            LOG.debug(`joinRoom: Joining to room "${roomId}" with body:`, body);

            const response : MatrixCreateRoomResponseDTO | any = await this._postJson(
                this._homeServerUrl + MATRIX_JOIN_ROOM_URL( roomId ),
                (body ?? {}) as unknown as JsonAny,
                {
                    [MATRIX_AUTHORIZATION_HEADER_NAME]: AuthorizationUtils.createBearerHeader(accessToken)
                }
            );

            if (!isMatrixJoinRoomResponseDTO(response)) {
                LOG.debug(`response = `, response);
                throw new TypeError(`Could not join to "${roomId}": Response was not MatrixJoinRoomResponseDTO: ` + response);
            }

            LOG.debug(`joinRoom: Joined to room "${roomId}": `, response);

            return response;

        } catch (err : any) {

            LOG.warn(`joinRoom: Error: `, err);

            if ( this.isAlreadyInTheRoom(err?.body) ) {
                return {room_id: roomId};
            }

            const body = err?.getBody() ?? err?.body;
            if ( isMatrixErrorDTO(body) && body.errcode === MatrixErrorCode.M_FORBIDDEN ) {
                LOG.warn(`joinRoom: Passing on error: Could not join to room "${roomId}": ${body?.errcode}: ${body?.error}`);
                throw err;
            } else {
                LOG.warn(`joinRoom: Passing on error: Could not join to room "${roomId}": `, err);
                throw err;
            }

        }

    }

    /**
     * Create the sync request.
     *
     * Note! This is the raw method for the Matrix HTTP request, and is not related to the internal
     * sync states.
     *
     * @param options
     */
    public async sync (options : {
        filter       ?: string | JsonObject,
        since        ?: string,
        full_state   ?: boolean,
        set_presence ?: MatrixSyncPresence,
        timeout      ?: number
    }) : Promise<MatrixSyncResponseDTO> {

        LOG.debug(`sync with `, options);

        const accessToken : string | undefined = this._accessToken;
        if (!accessToken) {
            throw new TypeError(`sync: Client ${this._userId} did not have access token`);
        }

        const {
            filter,
            since,
            full_state,
            set_presence,
            timeout
        } = options;

        const queryParams : MatrixSyncQueryParams = {};

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

        const response : any = await this._getJson(
            `${this._homeServerUrl}${MATRIX_SYNC_URL(queryParams)}`,
            {
                [MATRIX_AUTHORIZATION_HEADER_NAME]: AuthorizationUtils.createBearerHeader(accessToken)
            }
        );

        if (!isMatrixSyncResponseDTO(response)) {
            LOG.debug(`_sync: response not MatrixSyncResponseDTO: `, JSON.stringify(response, null ,2));
            throw new TypeError(`Response was not MatrixSyncResponseDTO: ${explainMatrixSyncResponseDTO(response)}`);
        }

        return response;

    }

    /**
     *
     * @param events
     * @param onlyInRooms
     * @param timeout Optional. The default is 30 seconds.
     * @param triggerEvents Optional. If true, events from the first sync call are triggered.
     */
    public async waitForEvents (
        events      : string[],
        onlyInRooms : string[] | undefined = undefined,
        timeout     : number | undefined = undefined,
        triggerEvents : boolean = true
    ) : Promise<boolean> {

        if (timeout === undefined) {
            timeout = DEFAULT_WAIT_FOR_EVENTS_TIMEOUT;
        }

        if (onlyInRooms === undefined) {
            LOG.debug(`Waiting for events ${events.join(' | ')} in all rooms`);
        } else {
            LOG.debug(`Waiting for events ${events.join(' | ')} in rooms ${onlyInRooms.join(', ')}`);
        }

        return await new Promise((resolve, reject) => {
            try {

                let listener        : any;
                let timeoutListener : any;

                const onStop = () => {

                    LOG.debug(`waitForEvents: On stop`);

                    if ( listener ) {
                        listener();
                        listener = undefined;
                    }

                    if ( timeoutListener ) {
                        clearTimeout(timeoutListener);
                        timeoutListener = undefined;
                    }

                    this._stopSyncing();

                };

                const onTimeout = () => {
                    LOG.debug(`waitForEvents: On timeout`);
                    timeoutListener = undefined;
                    onStop();
                    resolve(false);
                };

                const onEvent = (
                    event : SimpleMatrixClientEvent,
                    data  : MatrixSyncResponseAnyEventDTO & {room_id?: string}
                ) => {

                    const type = data?.type;
                    const roomId = data?.room_id;

                    if ( onlyInRooms !== undefined && !(roomId && onlyInRooms.includes(roomId)) ) {
                        LOG.debug(`waitForEvents: Event was not in watched room list: `, type, roomId, data);
                        return;
                    }

                    if ( type && events.includes(type) ) {
                        LOG.debug(`waitForEvents: Event found: `, type, roomId, data);
                        onStop();
                        resolve(true);
                    } else {
                        LOG.debug(`waitForEvents: Ignored event: `, type, roomId, data);
                    }

                };

                try {
                    timeoutListener = setTimeout(onTimeout, timeout);
                    listener = this.on(SimpleMatrixClientEvent.EVENT, onEvent);
                    LOG.debug(`waitForEvents: Started listening events`);
                    this._startSyncing(triggerEvents);
                } catch (err : any) {
                    LOG.error(`waitForEvents: Error: `, err);
                    reject(err);
                    onStop();
                }

            } catch (err : any) {
                LOG.error(`waitForEvents: Outer error: `, err);
                reject(err);
            }
        });

    }


    private async _retryLater<T> (callback : any, timeout : number) : Promise<T> {
        let timer : any;
        return await new Promise((resolve, reject) => {
            try {
                LOG.debug(`_retryLater: Waiting for a moment (${timeout})`);
                timer = setTimeout(() => {

                    timer = undefined;

                    try {
                        LOG.debug(`_retryLater: Restoring now`);
                        resolve(callback());
                    } catch (err: any) {
                        reject(err);
                    }
                }, timeout);
            } catch (err: any) {

                if (timer) {
                    clearTimeout(timer);
                    timer = undefined;
                }

                reject(err);
            }
        });
    }

    private async _postJson (
        url      : string,
        body    ?: JsonAny,
        headers ?: {[key: string]: string}
    ) : Promise< Json| undefined > {

        try {

            LOG.debug(`_postJson: Executing POST request ${url} with `, body, headers);
            const result = await RequestClient.postJson(url, body, headers);

            LOG.debug(`_postJson: Response received for POST request ${url} as `, result);
            return result;

        } catch (err : any) {

            LOG.warn(`_postJson: Error: `, err);

            const responseBody = err?.getBody() ?? err?.body;
            if ( isMatrixErrorDTO(responseBody) ) {
                const errCode = responseBody?.errcode;
                if ( errCode === MatrixErrorCode.M_LIMIT_EXCEEDED ) {
                    const retry_after_ms = responseBody?.retry_after_ms ?? 1000;
                    LOG.warn(`_postJson: Limit reached, retrying: `, retry_after_ms, url, body, headers);
                    return await this._retryLater<Json | undefined>(async () => {
                        LOG.error(`Calling again: `, url, body, headers);
                        return await this._postJson(url, body, headers);
                    }, retry_after_ms)
                } else {
                    LOG.warn(`_postJson: Passing on error code ${errCode}: ${responseBody?.error}`);
                }
            } else {
                LOG.warn(`_postJson: Passing on error with no body: `, err);
            }

            throw err;

        }

    }

    private async _putJson (
        url      : string,
        body    ?: JsonAny,
        headers ?: {[key: string]: string}
    ) : Promise<Json| undefined> {

        try {

            LOG.debug(`_putJson: Executing PUT request ${url} with `, body, headers);

            const result = await RequestClient.putJson(url, body, headers);
            LOG.debug(`_putJson: Response received for PUT request ${url} as `, result);
            return result;

        } catch (err : any) {

            LOG.warn(`_putJson: Error: `, err);

            const responseBody = err?.getBody() ?? err?.body;
            if ( isMatrixErrorDTO(responseBody) ) {
                const errCode = responseBody?.errcode;
                if ( responseBody?.errcode === MatrixErrorCode.M_LIMIT_EXCEEDED ) {
                    const retry_after_ms = responseBody?.retry_after_ms ?? 1000;
                    LOG.warn(`_putJson: Limit reached, retrying: `, retry_after_ms, url, body, headers);
                    return await this._retryLater<Json | undefined>(async () => {
                        LOG.error(`Calling again: `, url, body, headers);
                        return await this._putJson(url, body, headers);
                    }, retry_after_ms)
                } else {
                    LOG.warn(`Passing on: Error with code ${errCode}: ${responseBody.error}`);
                }
            } else {
                LOG.warn(`Passing on: Error did not have body: `, err);
            }

            throw err;

        }

    }

    private async _getJson (
        url      : string,
        headers ?: {[key: string]: string}
    ) : Promise<Json| undefined> {

        try {
            LOG.debug(`_getJson: Executing GET request ${url} with `, headers);
            const result = await RequestClient.getJson(url, headers);
            LOG.debug(`_getJson: Response received for PUT request ${url} as `, result);
            return result;
        } catch (err : any) {

            LOG.warn(`_getJson: Error: `, err);

            const responseBody = err?.getBody() ?? err?.body;
            if ( isMatrixErrorDTO(responseBody) ) {
                const errCode = responseBody?.errcode;
                if ( responseBody?.errcode === MatrixErrorCode.M_LIMIT_EXCEEDED ) {
                    const retry_after_ms = responseBody?.retry_after_ms ?? 1000;
                    LOG.error(`_getJson: Limit reached, retrying: `, retry_after_ms, url, headers);
                    return await this._retryLater<Json| undefined>(async () => {
                        LOG.error(`Calling again: `, url, headers);
                        return await this._getJson(url, headers);
                    }, retry_after_ms)
                } else {
                    LOG.warn(`_getJson: Passing on: Error with code ${errCode}: ${responseBody?.error}`);
                }
            } else {
                LOG.warn(`_getJson: Passing on: Error did not have body: `, err);
            }

            throw err;

        }

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

    private static _normalizeUrl (url : string) {
        if ( url && url[url.length-1] === '/' ) {
            return url.substring(0, url.length-1);
        } else {
            return url;
        }
    }

    // ***************** Methods related to event listening and syncing below ***************** //

    private _setState (value : SimpleMatrixClientState) {
        LOG.debug(`_setState: `, value, stringifySimpleMatrixClientState(value), this._stopSyncOnNext );
        this._state = value;
    }

    /**
     * Start the long polling event listener from Matrix server.
     *
     * The state SHOULD be AUTHENTICATED.
     *
     * Nothing is done if the state is AUTHENTICATED_AND_STARTING, AUTHENTICATED_AND_RESTARTING,
     * AUTHENTICATED_AND_STARTED or AUTHENTICATED_AND_SYNCING -- except if stop request has been
     * scheduled, which will be cancelled.
     *
     * The state must not be UNAUTHENTICATED or AUTHENTICATING.
     *
     * @FIXME: This could be started automatically from listeners in our own observer. If so, this
     *         method could be changed to private later.
     */
    public _startSyncing (triggerEvents: boolean) {

        switch (this._state) {

            case SimpleMatrixClientState.AUTHENTICATED:
                break;

            case SimpleMatrixClientState.AUTHENTICATED_AND_STARTING:
            case SimpleMatrixClientState.AUTHENTICATED_AND_RESTARTING:
            case SimpleMatrixClientState.AUTHENTICATED_AND_STARTED:
            case SimpleMatrixClientState.AUTHENTICATED_AND_SYNCING:
                if (this._stopSyncOnNext) {
                    this._stopSyncOnNext = false;
                    LOG.debug(`_startSyncing: Cancelled previous stop request (state was ${stringifySimpleMatrixClientState(this._state)})`);
                } else {
                    LOG.warn(`_startSyncing: Warning! Client was already started (was ${stringifySimpleMatrixClientState(this._state)})`);
                }
                return;

            default:
            case SimpleMatrixClientState.UNAUTHENTICATED:
            case SimpleMatrixClientState.AUTHENTICATING:
                throw new TypeError(`_startSyncing: Client was ${stringifySimpleMatrixClientState(this._state)}`);

        }

        if (this.isStopping()) {
            LOG.warn(`_startSyncing: Warning! Cancelled previous stop request, although state was AUTHENTICATED.`);
            this._stopSyncOnNext = false;
        }

        this._clearSyncAgainTimer();

        LOG.debug(`start: Initializing sync`);
        this._initSync(triggerEvents).catch((err : any) => {
            LOG.error('SYNC ERROR: ', err);
        });

    }

    /**
     * Stops the internal long polling loop against the Matrix server.
     *
     * State should be AUTHENTICATED_AND_STARTED.
     *
     * Will schedule stop later if state is AUTHENTICATED_AND_STARTING,
     * AUTHENTICATED_AND_RESTARTING or AUTHENTICATED_AND_SYNCING.
     *
     * Will not do anything (but warning) if state is UNAUTHENTICATED, AUTHENTICATING or
     * AUTHENTICATED.
     *
     * @FIXME: This could be stopped automatically when listeners are removed from our own
     *     observer. If so, this method could be changed to private later.
     */
    public _stopSyncing () {

        switch (this._state) {

            case SimpleMatrixClientState.UNAUTHENTICATED:
            case SimpleMatrixClientState.AUTHENTICATING:
            case SimpleMatrixClientState.AUTHENTICATED:
                LOG.warn(`_stopSyncing: Warning! Client was not started (was ${stringifySimpleMatrixClientState(this._state)})`);
                return;

            case SimpleMatrixClientState.AUTHENTICATED_AND_STARTING:
            case SimpleMatrixClientState.AUTHENTICATED_AND_RESTARTING:
            case SimpleMatrixClientState.AUTHENTICATED_AND_SYNCING:
                if (!this._stopSyncOnNext) {
                    LOG.debug(`_stopSyncing: Scheduled stop (state was ${stringifySimpleMatrixClientState(this._state)})`);
                    this._stopSyncOnNext = true;
                } else {
                    LOG.warn(`_stopSyncing: Warning! Stop was already scheduled (state was ${stringifySimpleMatrixClientState(this._state)})`);
                }
                return;

            case SimpleMatrixClientState.AUTHENTICATED_AND_STARTED:
                LOG.debug(`_stopSyncing: Stopping timer and moving to AUTHENTICATED state (was AUTHENTICATED_AND_STARTED)`);
                this._clearSyncAgainTimer();
                this._setState(SimpleMatrixClientState.AUTHENTICATED);
                return;

        }

    }

    /**
     * Will start a timeout until this._syncNextBatch() is called.
     *
     * The state must be AUTHENTICATED_AND_STARTED;
     *
     * @private
     */
    private _startSyncAgainTimer () {

        if ( this._state !== SimpleMatrixClientState.AUTHENTICATED_AND_STARTED ) {
            throw new TypeError(`_startSyncRetryTimer: Client was not AUTHENTICATED_AND_STARTED (was ${stringifySimpleMatrixClientState(this._state)})`);
        }

        this._clearSyncAgainTimer();

        this._syncAgainTimer = setTimeout(this._syncAgainTimeoutCallback, this._syncAgainTimeMs);

    }

    /**
     * Will start a timeout until this._initSync() is called again after a failed request.
     *
     * The state must be AUTHENTICATED_AND_RESTARTING.
     *
     * @private
     */
    private _startInitSyncAgainLater () {

        if ( this._state !== SimpleMatrixClientState.AUTHENTICATED_AND_RESTARTING ) {
            throw new TypeError(`_startSyncRetryTimer: Client was not AUTHENTICATED_AND_RESTARTING (${stringifySimpleMatrixClientState(this._state)})`);
        }

        this._clearInitSyncAgainTimer();

        this._initSyncAgainTimer = setTimeout(this._initSyncAgainTimeoutCallback, this._syncAgainTimeMs);

    }

    /**
     * Called when normal syncing is active and timeout is received.
     *
     * @private
     */
    private _onSyncAgainTimeout () {

        this._syncAgainTimer = undefined;

        if (this._stopSyncOnNext) {
            this._stopSyncOnNext = false;
            LOG.debug(`_onSyncRetryTimeout: Sync cancelled by previous stop request.`);
            return;
        }

        if ( this._state !== SimpleMatrixClientState.AUTHENTICATED_AND_STARTED ) {
            LOG.error(`_onSyncRetryTimeout: Client was not AUTHENTICATED_AND_STARTED (was ${stringifySimpleMatrixClientState(this._state)})`);
        } else {
            this._syncNextBatch().catch(err => {
                LOG.error(`_onSyncRetryTimeout: Error: `, err);
            });
        }

    }

    /**
     * Called when it's time to try again previous failed init sync
     *
     * @private
     */
    private _onInitSyncAgain (triggerEvents: boolean) {

        this._initSyncAgainTimer = undefined;

        if (this._stopSyncOnNext) {
            this._stopSyncOnNext = false;
            LOG.debug(`_onInitSyncAgain: Sync cancelled by previous stop request.`);
            return;
        }

        if ( this._state !== SimpleMatrixClientState.AUTHENTICATED_AND_RESTARTING ) {
            LOG.error(`_onInitSyncAgain: Client was not AUTHENTICATED_AND_RESTARTING (${stringifySimpleMatrixClientState(this._state)})`);
            return;
        }

        this._setState(SimpleMatrixClientState.AUTHENTICATED);

        this._initSync(triggerEvents).catch(err => {
            LOG.error(`_onInitSyncAgain: Error: `, err);
        });

    }

    private _clearSyncAgainTimer () {
        if (this._syncAgainTimer !== undefined) {
            clearTimeout(this._syncAgainTimer);
            this._syncAgainTimer = undefined;
        }
    }

    private _clearInitSyncAgainTimer () {
        if (this._initSyncAgainTimer !== undefined) {
            clearTimeout(this._initSyncAgainTimer);
            this._initSyncAgainTimer = undefined;
        }
    }

    private _triggerMatrixEventList (events : readonly MatrixSyncResponseAnyEventDTO[], room_id : string | undefined) {
        forEach(events, (event) => {
            this._triggerMatrixEvent(event, room_id);
        });
    }

    private _triggerMatrixEvent (event : MatrixSyncResponseAnyEventDTO, room_id : string | undefined) {
        this._observer.triggerEvent(SimpleMatrixClientEvent.EVENT, room_id ? {...event, room_id} : event);
    }

    /**
     * The state MUST be AUTHENTICATED_AND_STARTED to call this method.
     *
     * While this method is executing the state will be AUTHENTICATED_AND_SYNCING.
     *
     * It will result in a state:
     *
     *   1) AUTHENTICATED_AND_STARTED if successful
     *   2) AUTHENTICATED if previous stop request was received
     *
     * @private
     */
    private async _syncNextBatch () {

        switch (this._state) {

            case SimpleMatrixClientState.AUTHENTICATED_AND_STARTED:
                break;

            default:
            case SimpleMatrixClientState.UNAUTHENTICATED:
            case SimpleMatrixClientState.AUTHENTICATING:
            case SimpleMatrixClientState.AUTHENTICATED:
            case SimpleMatrixClientState.AUTHENTICATED_AND_RESTARTING:
            case SimpleMatrixClientState.AUTHENTICATED_AND_STARTING:
            case SimpleMatrixClientState.AUTHENTICATED_AND_SYNCING:
                throw new TypeError(`_syncNextBatch: State was ${stringifySimpleMatrixClientState(this._state)}`);

        }

        const nextBatch = this._nextSyncBatch;
        if (!nextBatch) throw new TypeError(`_onTimeout: No previous nextBatch defined`);

        const restartTimer = () => {

            this._clearSyncAgainTimer();

            if (this._stopSyncOnNext) {
                this._stopSyncOnNext = false;
                this._setState(SimpleMatrixClientState.AUTHENTICATED);
            } else {
                this._setState(SimpleMatrixClientState.AUTHENTICATED_AND_STARTED);
                this._startSyncAgainTimer();
            }

        };

        try {
            LOG.debug('_syncNextBatch: ', nextBatch);
            this._setState(SimpleMatrixClientState.AUTHENTICATED_AND_SYNCING);
            await this._syncSinceBatch(nextBatch);
            restartTimer();
        } catch (err : any) {
            LOG.error(`_syncNextBatch: ERROR: `, err);
            restartTimer();
        }

    }

    /**
     * The state must be AUTHENTICATED to call this method.
     *
     * While this method is executing the state will be AUTHENTICATED_AND_STARTING.
     *
     * This method controls state change to:
     *
     *    1) AUTHENTICATED_AND_STARTED if successful
     *    2) AUTHENTICATED if previous stop request was received while the request was executing
     *    3) AUTHENTICATED_AND_RESTARTING if not successful (see _startInitSyncAgainLater)
     *
     * @private
     */
    private async _initSync (
        triggerEvents : boolean
    ) {

        if ( this._state !== SimpleMatrixClientState.AUTHENTICATED ) {
            throw new TypeError(`_initSync: Client was not authenticated (${stringifySimpleMatrixClientState(this._state)})`);
        }

        const accessToken : string | undefined = this._accessToken;
        if (!accessToken) {
            throw new TypeError(`_initSync: Client did not have access token`);
        }

        LOG.info(`_initSync: Initial sync request started`);

        try {

            this._setState(SimpleMatrixClientState.AUTHENTICATED_AND_STARTING);

            const response : MatrixSyncResponseDTO = await this.sync({
                // FIXME: Create reusable filter on the server
                filter: {
                    room:{
                        timeline:{
                            limit:1
                        }
                    }
                }
            });

            LOG.debug(`_initSync: Initial sync response received`);

            if (this._stopSyncOnNext) {
                this._stopSyncOnNext = false;
                this._setState(SimpleMatrixClientState.AUTHENTICATED);
                LOG.debug('_initSync: Started successfully, but stop was already scheduled.');
                if (triggerEvents) this._triggerSyncEvents(response);
                return;
            }

            const next_batch : string | undefined = response.next_batch;
            if ( !next_batch ) {
                LOG.warn(`_initSync: Warning! No next_batch in the response: `, response);
                this._setState(SimpleMatrixClientState.AUTHENTICATED_AND_RESTARTING);
                this._startInitSyncAgainLater();
                if (triggerEvents) this._triggerSyncEvents(response);
                return;
            }

            this._nextSyncBatch = next_batch;
            this._setState(SimpleMatrixClientState.AUTHENTICATED_AND_STARTED);
            LOG.debug('_initSync: Started successfully');
            if (triggerEvents) this._triggerSyncEvents(response);

            this._startSyncAgainTimer();

        } catch (err : any) {
            LOG.error(`_initSync: Error: `, err);
            if (this._stopSyncOnNext) {
                this._stopSyncOnNext = false;
                this._setState(SimpleMatrixClientState.AUTHENTICATED);
            } else {
                this._setState(SimpleMatrixClientState.AUTHENTICATED_AND_RESTARTING);
                this._startInitSyncAgainLater();
            }
        }

    }

    private async _syncSinceBatch (next: string) {

        const accessToken : string | undefined = this._accessToken;
        if (!accessToken) {
            throw new TypeError(`_syncSince: Client did not have access token`);
        }

        const response : MatrixSyncResponseDTO = await this.sync({
            since: next,
            timeout: this._syncRequestTimeoutMs
        });

        const next_batch : string | undefined = response.next_batch;
        if (next_batch) {
            this._nextSyncBatch = next_batch;
            LOG.debug(`next_batch = `, next_batch);
        } else {
            LOG.error(`No next_batch in the response: `, response)
        }

        // LOG.debug('Response: ', response);
        this._triggerSyncEvents(response);

    }

    private _triggerSyncEvents (response: MatrixSyncResponseDTO) {

        const nonRoomEvents : readonly MatrixSyncResponseEventDTO[] = concat(
            response?.presence     ? getEventsFromMatrixSyncResponsePresenceDTO(response?.presence)        : [],
            response?.account_data ? getEventsFromMatrixSyncResponseAccountDataDTO(response?.account_data) : [],
            response?.to_device    ? getEventsFromMatrixSyncResponseToDeviceDTO(response?.to_device)       : [],
        );

        this._triggerMatrixEventList(nonRoomEvents, undefined);

        const joinObject = response?.rooms?.join ?? {};
        const joinRoomIds = keys(joinObject);
        forEach(joinRoomIds, (roomId : MatrixRoomId) => {
            const roomObject : MatrixSyncResponseJoinedRoomDTO = joinObject[roomId];
            const events = getEventsFromMatrixSyncResponseJoinedRoomDTO(roomObject);
            this._triggerMatrixEventList(events, roomId);
        });

        const inviteObject = response?.rooms?.invite ?? {};
        const inviteRoomIds = keys(inviteObject);
        forEach(inviteRoomIds, (roomId : MatrixRoomId) => {
            const roomObject : MatrixSyncResponseInvitedRoomDTO = inviteObject[roomId];
            const events = getEventsFromMatrixSyncResponseInvitedRoomDTO(roomObject);
            this._triggerMatrixEventList(events, roomId);
        });

        const leaveObject = response?.rooms?.leave ?? {};
        const leaveRoomIds = keys(leaveObject);
        forEach(leaveRoomIds, (roomId : MatrixRoomId) => {
            const roomObject : MatrixSyncResponseLeftRoomDTO = leaveObject[roomId];
            const events = getEventsFromMatrixSyncResponseLeftRoomDTO(roomObject);
            this._triggerMatrixEventList(events, roomId);
        });


    }

}

