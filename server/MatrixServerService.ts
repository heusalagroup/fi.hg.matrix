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
import { createMatrixWhoAmIResponseDTO, MatrixWhoAmIResponseDTO } from "../types/response/whoami/MatrixWhoAmIResponseDTO";
import { JwtService } from "../../backend/JwtService";
import { createMatrixErrorDTO, MatrixErrorDTO } from "../types/response/error/MatrixErrorDTO";
import { MatrixErrorCode } from "../types/response/error/types/MatrixErrorCode";
import { MatrixUtils } from "../MatrixUtils";
import { createMatrixCreateRoomResponseDTO, MatrixCreateRoomResponseDTO } from "../types/response/createRoom/MatrixCreateRoomResponseDTO";
import { MatrixCreateRoomDTO } from "../types/request/createRoom/MatrixCreateRoomDTO";
import { createRoomRepositoryItem, RoomRepositoryItem } from "./types/repository/room/RoomRepositoryItem";
import { createRoom } from "./types/repository/room/Room";
import { MatrixRoomVersion, parseMatrixRoomVersion } from "../types/MatrixRoomVersion";
import { MatrixVisibility } from "../types/request/createRoom/types/MatrixVisibility";
import { MatrixRoomId } from "../types/core/MatrixRoomId";

const LOG = LogService.createLogger('MatrixServerService');

export interface InternalWhoAmIObject {
    readonly userId: string;
    readonly deviceId: string;
    readonly device: DeviceRepositoryItem;
}

/**
 * Default expiration time in minutes
 */
const DEFAULT_ACCESS_TOKEN_EXPIRATION_TIME = 300;

export class MatrixServerService {

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
            foundDevice = await this._deviceService.getDeviceByDeviceId(deviceId);
            if ( !foundDevice ) {
                foundDevice = await this._deviceService.getDeviceById(deviceId);
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

    private async _whoAmI (accessToken: string) : Promise<InternalWhoAmIObject> {

        LOG.debug(`whoAmI: accessToken = `, accessToken);
        if ( !accessToken ) {
            LOG.warn(`Warning! No authentication token provided.`);
            throw createMatrixErrorDTO(MatrixErrorCode.M_UNKNOWN_TOKEN, 'Unrecognised access token.');
        }

        const deviceId: string = JwtService.decodePayloadSubject(accessToken);
        LOG.debug(`whoAmI: deviceId = `, deviceId);
        if ( !this._jwtEngine.verify(accessToken) ) {
            LOG.warn(`whoAmI: Token verification failed: `, deviceId, accessToken);
            throw createMatrixErrorDTO(MatrixErrorCode.M_UNKNOWN_TOKEN,'Unrecognised access token.') ;
        }

        const device : DeviceRepositoryItem | undefined = await this._deviceService.getDeviceById(deviceId);
        LOG.debug(`whoAmI: device = `, device);
        if (!device) {
            LOG.warn(`whoAmI: Device not found: `, deviceId, accessToken);
            throw createMatrixErrorDTO(MatrixErrorCode.M_UNKNOWN_TOKEN,'Unrecognised access token.');
        }

        const userId = device?.userId;
        LOG.debug(`whoAmI: userId = `, userId);
        if (!userId) {
            LOG.warn(`whoAmI: User ID invalid: `, userId, deviceId, accessToken);
            throw createMatrixErrorDTO(MatrixErrorCode.M_UNKNOWN_TOKEN,'Unrecognised access token.');
        }

        return {
            deviceId,
            device,
            userId
        };

    }

    /**
     * @throws MatrixErrorDTO
     */
    public async whoAmI (accessToken: string) : Promise<MatrixWhoAmIResponseDTO> {

        const {userId, deviceId, device} = await this._whoAmI(accessToken);

        const user : UserRepositoryItem | undefined = await this._userService.findById(userId);
        LOG.debug(`whoAmI: user = `, user);
        if (!user) {
            LOG.warn(`whoAmI: User not found: `, user, userId, deviceId, accessToken);
            throw createMatrixErrorDTO(MatrixErrorCode.M_UNKNOWN_TOKEN,'Unrecognised access token.');
        }
        const username = user?.username;
        LOG.debug(`whoAmI: username = `, username);
        const deviceIdentifier = device?.deviceId ?? device?.id;
        return createMatrixWhoAmIResponseDTO(
            MatrixUtils.getUserId(username, this._hostname),
            deviceIdentifier ? deviceIdentifier : undefined,
            false
        );
    }

    public async createRoom (
        accessToken: string,
        body: MatrixCreateRoomDTO
    ) : Promise<MatrixCreateRoomResponseDTO> {

        const {userId, deviceId, device} = await this._whoAmI(accessToken);

        const roomVersion = parseMatrixRoomVersion(body?.room_version) ?? this._defaultRoomVersion;
        const visibility : MatrixVisibility = body?.visibility ?? MatrixVisibility.PRIVATE;
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

        const matrixRoomId : MatrixRoomId = MatrixUtils.getRoomId(roomId, this._hostname);
        LOG.debug(`createRoom: matrixRoomId: `, matrixRoomId);

        return createMatrixCreateRoomResponseDTO(
            matrixRoomId,
            undefined
        );

    }

}
