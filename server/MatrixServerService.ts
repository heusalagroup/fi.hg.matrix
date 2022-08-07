// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { DeviceRepositoryService } from "./types/repository/device/DeviceRepositoryService";
import { RoomRepositoryService } from "./types/repository/room/RoomRepositoryService";
import { UserRepositoryService } from "./types/repository/user/UserRepositoryService";
import { EventRepositoryService } from "./types/repository/event/EventRepositoryService";
import { createUserRepositoryItem, UserRepositoryItem } from "./types/repository/user/UserRepositoryItem";
import { JwtEngine } from "../../backend/JwtEngine";
import { createDeviceRepositoryItem, DeviceRepositoryItem } from "./types/repository/device/DeviceRepositoryItem";
import { createDevice } from "./types/repository/device/Device";
import { JwtUtils } from "../../backend/JwtUtils";
import { LogService } from "../../core/LogService";
import { createUser, User } from "./types/repository/user/User";
import { REPOSITORY_NEW_IDENTIFIER } from "../../core/simpleRepository/types/Repository";
import { JwtService } from "../../backend/JwtService";
import { createRoomRepositoryItem, RoomRepositoryItem } from "./types/repository/room/RoomRepositoryItem";
import { createRoom } from "./types/repository/room/Room";
import { MatrixRoomVersion } from "../types/MatrixRoomVersion";
import { MatrixVisibility } from "../types/request/createRoom/types/MatrixVisibility";
import { LogLevel } from "../../core/types/LogLevel";
import { createRoomStateEventEntity } from "./types/repository/event/entities/RoomStateEventEntity";
import { createEventRepositoryItem, EventRepositoryItem } from "./types/repository/event/EventRepositoryItem";
import { MatrixType } from "../types/core/MatrixType";
import { ReadonlyJsonObject } from "../../core/Json";
import { MatrixRoomCreateEventDTO } from "../types/event/roomCreate/MatrixRoomCreateEventDTO";

const LOG = LogService.createLogger('MatrixServerService');

/**
 * Default expiration time in minutes
 */
const DEFAULT_ACCESS_TOKEN_EXPIRATION_TIME = 300;

export interface CreateRoomResponse {
    readonly roomId: string;
    readonly room: RoomRepositoryItem;
}

export class MatrixServerService {

    public static setLogLevel (level: LogLevel) {
        LOG.setLogLevel(level);
    }

    private readonly _url           : string;
    private readonly _hostname      : string;
    private readonly _defaultRoomVersion : MatrixRoomVersion;
    private readonly _deviceService : DeviceRepositoryService;
    private readonly _userService   : UserRepositoryService;
    private readonly _roomService   : RoomRepositoryService;
    private readonly _eventService  : EventRepositoryService;
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
        deviceService: DeviceRepositoryService,
        userService: UserRepositoryService,
        roomService: RoomRepositoryService,
        eventService: EventRepositoryService,
        jwtEngine: JwtEngine,
        accessTokenExpirationTime : number = DEFAULT_ACCESS_TOKEN_EXPIRATION_TIME,
        defaultRoomVersion : MatrixRoomVersion = MatrixRoomVersion.V8
    ) {
        this._url = url;
        this._hostname = hostname;
        this._deviceService = deviceService;
        this._userService = userService;
        this._roomService = roomService;
        this._eventService = eventService;
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
        const createdUser = await this._userService.createUser(
            createUserRepositoryItem(
                REPOSITORY_NEW_IDENTIFIER,
                createUser(
                    REPOSITORY_NEW_IDENTIFIER,
                    username,
                    password,
                    email
                ),
                username,
                email
            )
        );
        if (!createdUser) throw new TypeError(`MatrixServerService.createUser: Could not create user: ${username}`);
        return createUser(
            createdUser?.id,
            createdUser?.target?.username,
            createdUser?.target?.password,
            createdUser?.target?.email
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

        const user : UserRepositoryItem | undefined = await this._userService.findByUsername(username);
        if ( !user || password !== user?.target?.password ) {
            if ( !user ) {
                LOG.debug(`loginWithPassword: User not found: "${username}"`);
            } else {
                LOG.debug(`loginWithPassword: Password mismatch for: "${username}"`);
            }
            return undefined;
        }

        let foundDevice = undefined;
        if ( deviceId ) {
            foundDevice = await this._deviceService.findDeviceByDeviceId(deviceId);
            if ( !foundDevice ) {
                foundDevice = await this._deviceService.findDeviceById(deviceId);
            }
        }

        if ( !foundDevice ) {
            foundDevice = await this._deviceService.saveDevice(
                createDeviceRepositoryItem(
                    'new',
                    createDevice(
                        'new',
                        user.id,
                        deviceId
                    )
                )
            );
        }

        if ( foundDevice.userId !== user.id ) {
            LOG.warn(`loginWithPassword: Device was found/created but belong to different user than: "${username}"`);
            return undefined;
        }

        if ( !foundDevice?.id ) {
            LOG.warn(`Could not create or find device ID "${deviceId}" for user "${username}"`);
            return undefined;
        }

        LOG.debug(`Login successful for device "${deviceId}" and user "${username}", generating access key`);
        return this._jwtEngine.sign(
            JwtUtils.createSubPayloadExpiringInMinutes(foundDevice.id, this._accessTokenExpirationTime)
        );

    }

    /**
     * Verifies access token and returns the device it belongs to.
     *
     * @param accessToken
     * @returns string The device id if access token is valid
     */
    public async verifyAccessToken (accessToken : string) : Promise<string|undefined> {
        const deviceId: string = JwtService.decodePayloadSubject(accessToken);
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
        const device = await this._deviceService.findDeviceById(deviceId);
        LOG.debug(`getDeviceById: device [${deviceId}] = `, device);
        return device;
    }

    /**
     * Returns the user record by internal ID
     *
     * @param userId
     */
    public async findUserById (userId: string) : Promise<UserRepositoryItem | undefined> {
        return await this._userService.findUserById(userId);
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

        const createdRoomItem : RoomRepositoryItem = await this._roomService.createRoom(
            createRoomRepositoryItem(
                REPOSITORY_NEW_IDENTIFIER,
                createRoom(
                    REPOSITORY_NEW_IDENTIFIER,
                    roomVersion,
                    visibility
                )
            )
        );

        const roomId : string = createdRoomItem.id;
        LOG.info(`User ${userId} created room by id: ${roomId} with visibility ${visibility} and version ${roomVersion}`);

        return {
            roomId,
            room: createdRoomItem
        };

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
        return await this._eventService.createEvent(
            createEventRepositoryItem(
                REPOSITORY_NEW_IDENTIFIER,
                createRoomStateEventEntity(
                    REPOSITORY_NEW_IDENTIFIER,
                    type,
                    content,
                    originServerTs,
                    senderId,
                    roomId,
                    stateKey
                )
            )
        );
    }

    /**
     * Creates room create event (`m.room.create`).
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

    public getCurrentTimestamp () : number {
        return (new Date()).getTime();
    }

}
