// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { DeviceRepositoryService } from "./types/repository/device/DeviceRepositoryService";
import { RoomRepositoryService } from "./types/repository/room/RoomRepositoryService";
import { UserRepositoryService } from "./types/repository/user/UserRepositoryService";
import { EventRepositoryService } from "./types/repository/event/EventRepositoryService";
import { UserRepositoryItem } from "./types/repository/user/UserRepositoryItem";

export class MatrixServerService {

    private readonly _hostname      : string;
    private readonly _deviceService : DeviceRepositoryService;
    private readonly _userService   : UserRepositoryService;
    private readonly _roomService   : RoomRepositoryService;
    private readonly _eventService  : EventRepositoryService;

    /**
     *
     * @param hostname
     * @param deviceService
     * @param userService
     * @param roomService
     * @param eventService
     */
    public constructor (
        hostname: string,
        deviceService: DeviceRepositoryService,
        userService: UserRepositoryService,
        roomService: RoomRepositoryService,
        eventService: EventRepositoryService
    ) {
        this._hostname = hostname;
        this._deviceService = deviceService;
        this._userService = userService;
        this._roomService = roomService;
        this._eventService = eventService;
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
     * @see https://github.com/heusalagroup/hghs/issues/28
     */
    public async loginWithPassword (
        deviceId: string,
        username: string,
        password: string
    ) : Promise<string | undefined> {
        const item : UserRepositoryItem | undefined = await this._userService.findByUsername(username);
        if (!item) return undefined;
        if (password !== item.target.password) {
            return undefined;
        }

    }

}
