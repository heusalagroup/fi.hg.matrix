// Copyright (c) 2021 Sendanor. All rights reserved.

import { concat, forEach, isString, join, keys, map } from "../ts/modules/lodash";

import Observer, { ObserverCallback, ObserverDestructor } from "../ts/Observer";
import RequestClient from "../ts/RequestClient";
import LogService from "../ts/LogService";
import JsonAny from "../ts/Json";
import Json, { isJsonObject, JsonObject } from "../ts/Json";
import { MatrixPasswordLoginDTO } from "./types/request/passwordLogin/MatrixPasswordLoginDTO";
import { MatrixTextMessageDTO } from "./types/message/textMessage/MatrixTextMessageDTO";
import { MatrixType } from "./types/core/MatrixType";
import { isMatrixLoginResponseDTO } from "./types/response/login/MatrixLoginResponseDTO";
import MatrixCreateRoomDTO from "./types/request/createRoom/MatrixCreateRoomDTO";
import MatrixCreateRoomResponseDTO, { isMatrixCreateRoomResponseDTO } from "./types/response/createRoom/MatrixCreateRoomResponseDTO";
import { isGetDirectoryRoomAliasResponseDTO } from "./types/response/directoryRoomAlias/GetDirectoryRoomAliasResponseDTO";
import RequestError, { isRequestError } from "../ts/request/types/RequestError";
import RequestStatus from "../ts/request/types/RequestStatus";
import MatrixSyncPresence from "./types/request/sync/types/MatrixSyncPresence";
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
import MatrixRoomId, { isMatrixRoomId } from "./types/core/MatrixRoomId";
import MatrixSyncResponseJoinedRoomDTO, { getEventsFromMatrixSyncResponseJoinedRoomDTO } from "./types/response/sync/types/MatrixSyncResponseJoinedRoomDTO";
import MatrixSyncResponseInvitedRoomDTO, { getEventsFromMatrixSyncResponseInvitedRoomDTO } from "./types/response/sync/types/MatrixSyncResponseInvitedRoomDTO";
import MatrixSyncResponseLeftRoomDTO, { getEventsFromMatrixSyncResponseLeftRoomDTO } from "./types/response/sync/types/MatrixSyncResponseLeftRoomDTO";
import MatrixUserId, { isMatrixUserId } from "./types/core/MatrixUserId";
import MatrixJoinRoomRequestDTO from "./types/request/joinRoom/MatrixJoinRoomRequestDTO";
import MatrixJoinRoomResponseDTO, { isMatrixJoinRoomResponseDTO } from "./types/response/joinRoom/types/MatrixJoinRoomResponseDTO";
import { SimpleMatrixClientState } from "./types/SimpleMatrixClientState";
import PutRoomStateWithEventTypeDTO, { isPutRoomStateWithEventTypeDTO } from "./types/response/setRoomStateByType/PutRoomStateWithEventTypeDTO";
import MatrixRoomJoinedMembersDTO, { isMatrixRoomJoinedMembersDTO } from "./types/response/roomJoinedMembers/MatrixRoomJoinedMembersDTO";
import MatrixRegisterKind from "./types/request/register/types/MatrixRegisterKind";
import MatrixRegisterDTO from "./types/request/register/MatrixRegisterDTO";
import MatrixRegisterResponseDTO, { isMatrixRegisterResponseDTO } from "./types/response/register/MatrixRegisterResponseDTO";
import { isMatrixErrorDTO } from "./types/response/error/MatrixErrorDTO";
import MatrixErrorCode from "./types/response/error/types/MatrixErrorCode";
import SynapseRegisterResponseDTO, { isSynapseRegisterResponseDTO } from "./types/synapse/SynapseRegisterResponseDTO";
import SynapseRegisterRequestDTO from "./types/synapse/SynapseRegisterRequestDTO";

const LOG = LogService.createLogger('SimpleMatrixClient');

export enum SimpleMatrixClientEvent {

    EVENT = "SimpleMatrixClient:event"

}

export type SimpleMatrixClientDestructor = ObserverDestructor;

/**
 * Super lightweight Matrix client and simple event listener.
 *
 * Far from perfect, but works both on browser and on OpenWRT with NodeJS 8 and full POC takes only
 * 50k as compiled single bundle file (including all the dependencies) :)
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

    /**
     * Returns the current state of the client instance.
     */
    public getState () : SimpleMatrixClientState {
        return this._state;
    }

    /**
     * Destroys the current client instance, including all observers.
     *
     * You should not use this instance anymore after you call this method.
     */
    public destroy (): void {

        this._observer.destroy();

        this.stop();

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
    public start () {

        if (this._timer !== undefined) {
            clearTimeout(this._timer);
            this._timer = undefined;
        }

        this._initSync().catch((err : any) => {
            LOG.error('SYNC ERROR: ', err);
        });

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

        if (this._timer !== undefined) {
            clearTimeout(this._timer);
            this._timer = undefined;
        }

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

    public async register (
        requestBody  : MatrixRegisterDTO,
        kind         : MatrixRegisterKind | undefined = undefined,
        accessToken ?: string
    ) : Promise<MatrixRegisterResponseDTO> {

        try {

            LOG.debug(`Registering user:`, requestBody, kind);

            const access_token : string | undefined = this?._accessToken ?? accessToken ?? undefined;

            const response : any = await this._postJson(
                this._resolveHomeServerUrl(`/register`) + (kind ? `?kind=${q(kind)}`: ''),
                requestBody as unknown as JsonAny,
                access_token ? {
                    'Authorization': `Bearer ${access_token}`
                } : undefined
            );

            if (!isMatrixRegisterResponseDTO(response)) {
                LOG.debug(`Invalid response received: `, response);
                throw new TypeError(`register: Response was invalid`);
            }

            LOG.debug(`RegisterResponseDTO received: `, response);

            return response;

        } catch (err) {

            LOG.debug(`Could not register user: `, err);

            if (err instanceof RequestError) {

                const statusCode = err?.getStatusCode();

                if ( statusCode === 400 ) {

                    const errorBody: any = err?.getBody();

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

        try {

            const accessToken : string | undefined = this._accessToken;
            if (!accessToken) {
                throw new TypeError(`whoami: Client did not have access token`);
            }

            const url = this._resolveHomeServerUrl(`/account/whoami`);
            LOG.debug(`whoami: Fetching account whoami... `, url);

            const response : any = await this._getJson(url,
                {
                    'Authorization': `Bearer ${accessToken}`
                }
            );
            LOG.debug(`whoami: response = `, response);

            const user_id = response?.user_id ?? undefined;
            LOG.debug(`whoami: user_id = `, user_id);

            const userId = isString(user_id) ? user_id : undefined;
            this._userId = userId;
            return userId;

        } catch (err) {
            LOG.error(`whoami: Could not fetch user_id: `, err);
            return undefined;
        }

    }

    public async getRegisterNonce () : Promise<string> {

        try {

            LOG.debug(`Fetching nonce for registration...`);

            const url : string  = this._resolveSynapseServerUrl(`/register`);

            const nonceResponse : any = await this._getJson(url);

            const nonce = nonceResponse?.nonce ?? undefined;
            if (!nonce) throw new TypeError(`No nonce detected`);

            return nonce;

        } catch (err) {

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

            const url : string  = this._resolveSynapseServerUrl(`/register`);

            const response : any = await this._postJson(
                url,
                requestBody as unknown as JsonAny
            );

            if (!isSynapseRegisterResponseDTO(response)) {
                LOG.debug(`registerWithSharedSecret: Invalid response received: `, response);
                throw new TypeError(`registerWithSharedSecret: Response was invalid`);
            }

            LOG.debug(`registerWithSharedSecret: RegisterResponseDTO received: `, response);

            return response;

        } catch (err) {

            LOG.debug(`registerWithSharedSecret: Could not register user: `, err);

            if (err instanceof RequestError) {

                const statusCode = err?.getStatusCode();

                if ( statusCode === 400 ) {

                    const errorBody: any = err?.getBody();

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

            const requestBody : MatrixPasswordLoginDTO = {
                type: MatrixType.M_LOGIN_PASSWORD,
                identifier: {
                    type: MatrixType.M_ID_USER,
                    user: userId
                },
                password: password
            };

            LOG.debug(`Sending login with userId:`, userId);

            const response : any = await this._postJson(
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
     * Eg. if you say `'foo'` here, it will be converted to `'#foo:homeServerHostname'`.
     *
     * @param name
     */
    public async resolveRoomId (name: string) : Promise<string | undefined> {

        try {

            const roomName : string = this._normalizeRoomName(name);

            const response : any = await this._getJson(
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
     * Returns joined members from the homeserver
     *
     * @param roomId
     */
    public async getJoinedMembers (roomId: MatrixRoomId) : Promise<MatrixRoomJoinedMembersDTO> {

        const accessToken : string | undefined = this._accessToken;
        if (!accessToken) {
            throw new TypeError(`getRoomStateByType: Client did not have access token`);
        }

        const response : any = await this._getJson(
            this._resolveHomeServerUrl(`/rooms/${q(roomId)}/joined_members`),
            {
                'Authorization': `Bearer ${accessToken}`
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
    ) : Promise<JsonObject | undefined> {

        try {

            const accessToken : string | undefined = this._accessToken;
            if (!accessToken) {
                throw new TypeError(`getRoomStateByType: Client did not have access token`);
            }

            const response : any = await this._getJson(
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
        body      : JsonObject,
    ) : Promise<PutRoomStateWithEventTypeDTO> {

        try {

            const accessToken : string | undefined = this._accessToken;
            if (!accessToken) {
                throw new TypeError(`setRoomStateByType: Client did not have access token`);
            }

            const response : JsonAny | undefined = await this._putJson(
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

            const response : JsonAny | undefined = await this._postJson(
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

    private async _retryLater<T> (callback : any, timeout : number) : Promise<T> {
        return await new Promise((resolve, reject) => {
            try {
                setTimeout(() => {
                    try {
                        resolve(callback());
                    } catch (err) {
                        reject(err);
                    }
                }, timeout);
            } catch (err) {
                reject(err);
            }
        });
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
                throw new TypeError(`roomId invalid: ${roomId}`);
            }

            if (!isMatrixUserId(userId)) {
                throw new TypeError(`userId invalid: ${userId}`);
            }

            LOG.info(`Inviting user ${userId} to ${roomId}`);

            const accessToken : string | undefined = this._accessToken;
            if (!accessToken) {
                throw new TypeError(`inviteToRoom: Client did not have access token`);
            }

            const response : JsonAny | undefined = await this._postJson(
                this._resolveHomeServerUrl(`/rooms/${q(roomId)}/invite`),
                {
                    user_id: userId
                },
                {
                    'Authorization': `Bearer ${accessToken}`
                }
            );

            LOG.debug(`inviteToRoom: received: `, response);

        } catch (err) {

            if ( this.isAlreadyInTheRoom(err?.body) ) return;

            LOG.error(`inviteToRoom: Passing on error: `, err);
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

        const requestBody : MatrixTextMessageDTO = {
            msgtype: 'm.text',
            body: body
        };

        LOG.debug(`Sending message with body:`, requestBody);

        const response : Json | undefined = await this._postJson(
            this._resolveHomeServerUrl(`/rooms/${q(roomId)}/send/m.room.message`),
            requestBody as unknown as JsonAny,
            {
                'Authorization': `Bearer ${accessToken}`
            }
        );

        LOG.debug(`sendTextMessage response received: `, response);

    }

    private async _postJson (
        url      : string,
        body    ?: JsonAny,
        headers ?: {[key: string]: string}
    ) : Promise<Json| undefined> {

        try {
            return await RequestClient.postJson(url, body, headers);
        } catch (err) {

            if ( isRequestError(err) ) {
                const body = err.getBody();
                if ( isMatrixErrorDTO(body) && body.errcode === MatrixErrorCode.M_LIMIT_EXCEEDED ) {
                    const retry_after_ms = body?.retry_after_ms;
                    return await this._retryLater<Json | undefined>(async () => {
                        return await this._postJson(url, body, headers);
                    }, retry_after_ms)
                }
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
            return await RequestClient.putJson(url, body, headers);
        } catch (err) {

            if ( isRequestError(err) ) {
                const body = err.getBody();
                if ( isMatrixErrorDTO(body) && body.errcode === MatrixErrorCode.M_LIMIT_EXCEEDED ) {
                    const retry_after_ms = body?.retry_after_ms;
                    return await this._retryLater<Json | undefined>(async () => {
                        return await this._putJson(url, body, headers);
                    }, retry_after_ms)
                }
            }

            throw err;

        }

    }

    private async _getJson (
        url      : string,
        headers ?: {[key: string]: string}
    ) : Promise<Json| undefined> {

        try {

            return await RequestClient.getJson(url, headers);

        } catch (err) {

            if ( isRequestError(err) ) {
                const body = err.getBody();
                if ( isMatrixErrorDTO(body) && body?.errcode === MatrixErrorCode.M_LIMIT_EXCEEDED ) {
                    const retry_after_ms = body?.retry_after_ms;
                    return await this._retryLater<Json| undefined>(async () => {
                        return await this._getJson(url, headers);
                    }, retry_after_ms)
                }
            }

            throw err;

        }

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

            LOG.debug(`Joining to room ${roomId} with body:`, body);

            const response : MatrixCreateRoomResponseDTO | any = await this._postJson(
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

        } catch (err) {

            if ( this.isAlreadyInTheRoom(err?.body) ) {
                return {room_id: roomId};
            }

            LOG.debug(`Could not join to room ${roomId}: `, err);
            throw err;

        }

    }

    /**
     * Create a sync request.
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

        LOG.info(`sync with `, options);

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

        const response : any = await this._getJson(
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

    private _resolveSynapseServerUrl (path : string) : string {
        const homeUrl = this._homeServerUrl;
        const p1 = homeUrl[homeUrl.length-1] === '/' ? '' : '/';
        const p2 = path[0] === '/' ? '' : '/';
        return `${homeUrl}${p1}_synapse/admin/v1${p2}${path}`;
    }

}

function q (value: string) : string {
    return encodeURIComponent(value);
}

export default SimpleMatrixClient;

