// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { DeviceRepositoryService } from "./types/repository/device/DeviceRepositoryService";
import { RoomRepositoryService } from "./types/repository/room/RoomRepositoryService";
import { UserRepositoryService } from "./types/repository/user/UserRepositoryService";
import { EventRepositoryService } from "./types/repository/event/EventRepositoryService";
import { UserRepositoryItem } from "./types/repository/user/UserRepositoryItem";
import { JwtEngine } from "../../backend/JwtEngine";
import { createDeviceRepositoryItem } from "./types/repository/device/DeviceRepositoryItem";
import { createDevice } from "./types/repository/device/Device";
import { JwtUtils } from "../../backend/JwtUtils";

/**
 * Default expiration time in minutes
 */
const DEFAULT_ACCESS_TOKEN_EXPIRATION_TIME = 300;

export class MatrixServerService {

    private readonly _hostname      : string;
    private readonly _deviceService : DeviceRepositoryService;
    private readonly _userService   : UserRepositoryService;
    private readonly _roomService   : RoomRepositoryService;
    private readonly _eventService  : EventRepositoryService;
    private readonly _jwtEngine     : JwtEngine;
    private readonly _accessTokenExpirationTime : number;

    /**
     *
     * @param hostname
     * @param deviceService
     * @param userService
     * @param roomService
     * @param eventService
     * @param jwtEngine
     * @param accessTokenExpirationTime Expiration time in minutes for access tokens
     */
    public constructor (
        hostname: string,
        deviceService: DeviceRepositoryService,
        userService: UserRepositoryService,
        roomService: RoomRepositoryService,
        eventService: EventRepositoryService,
        jwtEngine: JwtEngine,
        accessTokenExpirationTime : number = DEFAULT_ACCESS_TOKEN_EXPIRATION_TIME
    ) {
        this._hostname = hostname;
        this._deviceService = deviceService;
        this._userService = userService;
        this._roomService = roomService;
        this._eventService = eventService;
        this._jwtEngine = jwtEngine;
        this._accessTokenExpirationTime = accessTokenExpirationTime;
    }

    public getHostName () : string {
        return this._hostname;
    }

    /**
     * Called once after every member has been initialized
     */
    public async initialize () : Promise<void> {

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

        const user : UserRepositoryItem | undefined = await this._userService.findByUsername(username);
        if ( !user || !password || password !== user?.target?.password) {
            return undefined;
        }

        let foundDevice = undefined;
        if ( deviceId ) {
            foundDevice = await this._deviceService.getDeviceByDeviceId(deviceId);
            if ( !foundDevice ) {
                foundDevice = await this._deviceService.getDeviceById(deviceId);
            }
            if ( foundDevice ) {
                if ( foundDevice.userId !== user.id ) {
                    return undefined;
                }
            }
        }

        if (!foundDevice) {
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

        if (!foundDevice.id) {
            throw new TypeError('MatrixServerService: Could not create or find device ID');
        }

        return this._jwtEngine.sign(
            JwtUtils.createSubPayloadExpiringInMinutes(foundDevice.id, this._accessTokenExpirationTime)
        );

    }

}
