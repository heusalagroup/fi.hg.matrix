// Copyright (c) 2022-2023. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { JwtDecodeServiceImpl } from "../../backend/JwtDecodeServiceImpl";
import { createEventEntity } from "./types/repository/event/entities/EventEntity";
import { createRoom } from "./types/repository/room/Room";
import { UserRepositoryItem } from "./types/repository/user/UserRepositoryItem";
import { JwtEngine } from "../../core/jwt/JwtEngine";
import { DeviceRepositoryItem } from "./types/repository/device/DeviceRepositoryItem";
import { LogService } from "../../core/LogService";
import { createUser, User } from "./types/repository/user/User";
import { createRoomRepositoryItem, RoomRepositoryItem } from "./types/repository/room/RoomRepositoryItem";
import { MatrixRoomVersion } from "../types/MatrixRoomVersion";
import { MatrixVisibility } from "../types/request/createRoom/types/MatrixVisibility";
import { LogLevel } from "../../core/types/LogLevel";
import { createEventRepositoryItem, EventRepositoryItem } from "./types/repository/event/EventRepositoryItem";
import { MatrixType } from "../types/core/MatrixType";
import { ReadonlyJsonObject } from "../../core/Json";
import { MatrixRoomCreateEventDTO } from "../types/event/roomCreate/MatrixRoomCreateEventDTO";
import { RoomMembershipState } from "../types/event/roomMember/RoomMembershipState";
import { RoomMemberContent3rdPartyInviteDTO } from "../types/event/roomMember/RoomMemberContent3rdPartyInviteDTO";
import { createRoomMemberContentDTO } from "../types/event/roomMember/RoomMemberContentDTO";

const LOG = LogService.createLogger('MatrixServerService');

/**
 * Default expiration time in minutes
 */
const DEFAULT_ACCESS_TOKEN_EXPIRATION_TIME = 300;

export interface CreateRoomResponse {
    readonly roomId: string;
    readonly room: RoomRepositoryItem;
}

export function createCreateRoomResponse (
    roomId: string,
    room: RoomRepositoryItem
) : CreateRoomResponse {
    return {
        roomId,
        room,
    };
}

/**
 * Provides services to implement Matrix HomeServer features.
 *
 * Methods in this service should only provide means to implement features,
 * e.g. not have control itself. Actual control of things must reside in the user
 * side of this service.
 *
 * @see HsBackendController
 */
export class MatrixServerService {

    public static setLogLevel (level: LogLevel) {
        LOG.setLogLevel(level);
    }

    private readonly _url           : string;
    private readonly _hostname      : string;
    private readonly _defaultRoomVersion : MatrixRoomVersion;
    private readonly _jwtEngine     : JwtEngine;
    private readonly _accessTokenExpirationTime : number;

    /**
     *
     * @param url
     * @param hostname
     * @param deviceService
     * @param userService
     * @param roomService
     * @param eventService
     * @param jwtEngine
     * @param accessTokenExpirationTime Expiration time in minutes for access tokens
     * @param defaultRoomVersion Defaults to room version 8
     */
    public constructor (
        url: string,
        hostname: string,
        jwtEngine: JwtEngine,
        accessTokenExpirationTime : number = DEFAULT_ACCESS_TOKEN_EXPIRATION_TIME,
        defaultRoomVersion : MatrixRoomVersion = MatrixRoomVersion.V8
    ) {
        this._url = url;
        this._hostname = hostname;
        this._jwtEngine = jwtEngine;
        this._accessTokenExpirationTime = accessTokenExpirationTime;
        this._defaultRoomVersion = defaultRoomVersion;
    }

    public getHostName () : string {
        return this._hostname;
    }

    public getDefaultRoomVersion () : MatrixRoomVersion {
        return this._defaultRoomVersion;
    }

    public getURL () : string {
        return this._url;
    }

    /**
     * Called once after every member has been initialized
     */
    public async initialize () : Promise<void> {

    }

    /**
     *
     * @param username
     * @param password
     * @param email
     */
    public async createUser (
        username  : string,
        password  : string,
        email    ?: string
    ) : Promise<User> {
        // const createdUser = await this._userService.createUser(
        //     createUserRepositoryItem(
        //         REPOSITORY_NEW_IDENTIFIER,
        //         createUser(
        //             REPOSITORY_NEW_IDENTIFIER,
        //             username,
        //             password,
        //             email
        //         ),
        //         username,
        //         email
        //     )
        // );
        // if (!createdUser) throw new TypeError(`MatrixServerService.createUser: Could not create user: ${username}`);
        return createUser(
            '',
            username,
            password,
            email,
        );
    }

    /**
     * Get a nonce for registration
     *
     * @see https://github.com/heusalagroup/hghs/issues/1
     * @TODO
     */
    public async createAdminRegisterNonce () : Promise<string> {
        return 'nonce';
    }

    /**
     *
     * @param username
     * @param password
     * @param deviceId This is the optional device ID provided by the client
     * @see https://github.com/heusalagroup/hghs/issues/28
     */
    public async loginWithPassword (
        username  : string,
        password  : string,
        deviceId ?: string | undefined
    ) : Promise<string | undefined> {

        if (!username) {
            LOG.debug(`loginWithPassword: Username is required`);
            return undefined;
        }

        if (!password) {
            LOG.debug(`loginWithPassword: Password is required for user "${username}"`);
            return undefined;
        }

        LOG.debug(`_accessTokenExpirationTime : `, this._accessTokenExpirationTime);
        LOG.debug(`deviceId : `, deviceId);

        // const user : UserRepositoryItem | undefined = await this._userService.findByUsername(username);
        // if ( !user || password !== user?.target?.password ) {
        //     if ( !user ) {
        //         LOG.debug(`loginWithPassword: User not found: "${username}"`);
        //     } else {
        //         LOG.debug(`loginWithPassword: Password mismatch for: "${username}"`);
        //     }
        //     return undefined;
        // }
        //
        // let foundDevice = undefined;
        // if ( deviceId ) {
        //     foundDevice = await this._deviceService.findDeviceByDeviceId(deviceId);
        //     if ( !foundDevice ) {
        //         foundDevice = await this._deviceService.findDeviceById(deviceId);
        //     }
        // }
        //
        // if ( !foundDevice ) {
        //     foundDevice = await this._deviceService.saveDevice(
        //         createDeviceRepositoryItem(
        //             'new',
        //             createDevice(
        //                 'new',
        //                 user.id,
        //                 deviceId
        //             )
        //         )
        //     );
        // }
        //
        // if ( foundDevice.userId !== user.id ) {
        //     LOG.warn(`loginWithPassword: Device was found/created but belong to different user than: "${username}"`);
        //     return undefined;
        // }
        //
        // if ( !foundDevice?.id ) {
        //     LOG.warn(`Could not create or find device ID "${deviceId}" for user "${username}"`);
        //     return undefined;
        // }
        //
        // LOG.debug(`Login successful for device "${deviceId}" and user "${username}", generating access key`);
        // return this._jwtEngine.sign(
        //     JwtUtils.createSubPayloadExpiringInMinutes(foundDevice.id, this._accessTokenExpirationTime)
        // );

    }

    /**
     * Verifies access token and returns the device it belongs to.
     *
     * @param accessToken
     * @returns string The device id if access token is valid
     */
    public async verifyAccessToken (accessToken : string) : Promise<string|undefined> {
        const deviceId: string = JwtDecodeServiceImpl.decodePayloadSubject(accessToken);
        LOG.debug(`verifyAccessToken: deviceId = `, deviceId);
        if ( !this._jwtEngine.verify(accessToken) ) {
            LOG.warn(`verifyAccessToken: Token verification failed: `, deviceId, accessToken);
            return undefined;
        }
        return deviceId;
    }

    /**
     * Returns the device record by internal ID
     *
     * @param deviceId
     */
    public async findDeviceById (deviceId : string) : Promise<DeviceRepositoryItem | undefined> {
        // const device = await this._deviceService.findDeviceById(deviceId);
        // LOG.debug(`getDeviceById: device [${deviceId}] = `, device);
        // return device;
        LOG.debug(`deviceId = `, deviceId);
        return undefined;
    }

    /**
     * Returns the user record by internal ID
     *
     * @param userId
     */
    public async findUserById (userId: string) : Promise<UserRepositoryItem | undefined> {
        LOG.debug(`userId = `, userId);
        // return await this._userService.findUserById(userId);
        return undefined;
    }

    /**
     * Create a room
     *
     * @param userId
     * @param deviceId
     * @param roomVersion
     * @param visibility
     */
    public async createRoom (
        userId: string,
        deviceId: string,
        roomVersion: MatrixRoomVersion,
        visibility: MatrixVisibility
    ) : Promise<CreateRoomResponse> {

        LOG.debug(`User ${userId} from device ${deviceId} is creating a room with visibility ${visibility} and version ${roomVersion}`);

        // const createdRoomItem : RoomRepositoryItem = await this._roomService.createRoom(
        //     createRoomRepositoryItem(
        //         REPOSITORY_NEW_IDENTIFIER,
        //         createRoom(
        //             REPOSITORY_NEW_IDENTIFIER,
        //             roomVersion,
        //             visibility
        //         )
        //     )
        // );
        //
        // const roomId : string = createdRoomItem.id;
        // LOG.info(`User ${userId} created room by id: ${roomId} with visibility ${visibility} and version ${roomVersion}`);
        //
        // return {
        //     roomId,
        //     room: createdRoomItem
        // };

        return createCreateRoomResponse(
            'undefined',
            createRoomRepositoryItem(
                'undefined',
                createRoom(
                    'undefined',
                    roomVersion,
                    visibility,
                ),
            ),
        );

    }

    /**
     * Create room state event
     */
    public async createRoomStateEvent (
        senderId: string,
        roomId: string,
        content: ReadonlyJsonObject,
        type: MatrixType | string,
        stateKey: string,
        originServerTs: number = this.getCurrentTimestamp()
    ) : Promise<EventRepositoryItem> {
        LOG.debug(`stateKey = `, stateKey);
        return createEventRepositoryItem(
            'undefined',
            createEventEntity(
                'undefined',
                type,
                content,
                originServerTs,
                senderId,
                roomId,
            ),
        );
        // return await this._eventService.createEvent(
        //     createEventRepositoryItem(
        //         REPOSITORY_NEW_IDENTIFIER,
        //         createRoomStateEventEntity(
        //             REPOSITORY_NEW_IDENTIFIER,
        //             type,
        //             content,
        //             originServerTs,
        //             senderId,
        //             roomId,
        //             stateKey
        //         )
        //     )
        // );
    }

    /**
     * Creates `m.room.create` event.
     *
     * @see https://github.com/heusalagroup/hghs/issues/23
     */
    public async createRoomCreateEvent (
        senderId        : string,
        roomId          : string,
        roomVersion     : MatrixRoomVersion = MatrixRoomVersion.V1,
        creatorId       : string = senderId,
        extraContent    : Partial<MatrixRoomCreateEventDTO> | undefined = undefined,
        originServerTs  : number = this.getCurrentTimestamp()
    ) : Promise<EventRepositoryItem> {
        const content : ReadonlyJsonObject = {
            ...(extraContent ?? {}) as ReadonlyJsonObject,
            creator: creatorId,
            room_version: roomVersion
        };
        return await this.createRoomStateEvent(
            senderId,
            roomId,
            content,
            MatrixType.M_ROOM_CREATE,
            "",
            originServerTs
        );
    }

    /**
     * Creates `m.room.member` event
     *
     * @see https://github.com/heusalagroup/hghs/issues/24
     */
    public async createRoomMemberEvent (
        senderId                          : string,
        roomId                            : string,
        membership                        : RoomMembershipState,
        reason                           ?: string | undefined,
        userId                            : string = senderId,
        avatar_url                       ?: string | undefined,
        displayname                      ?: string | null | undefined,
        is_direct                        ?: boolean | undefined,
        join_authorised_via_users_server ?: string | undefined,
        third_party_invite               ?: RoomMemberContent3rdPartyInviteDTO,
        originServerTs                    : number = this.getCurrentTimestamp()
    ) : Promise<EventRepositoryItem> {
        const content = createRoomMemberContentDTO(
            membership,
            reason,
            avatar_url,
            displayname,
            is_direct,
            join_authorised_via_users_server,
            third_party_invite
        );
        return await this.createRoomStateEvent(
            senderId,
            roomId,
            content,
            MatrixType.M_ROOM_MEMBER,
            userId,
            originServerTs
        );
    }

    public getCurrentTimestamp () : number {
        return (new Date()).getTime();
    }

}
