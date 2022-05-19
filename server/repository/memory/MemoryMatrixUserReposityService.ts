// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
import {
    concat,
    map,
    find,
    uniq
} from "../../../../core/modules/lodash";

import { randomBytes } from "crypto";

import { UserReposityEntry } from "./UserReposityEntryDTO";
import { UserModel } from "../../types/UserModel";
import { DeviceModel } from "../../types/DeviceModel";
import { MatrixUserRepositoryService } from "../../types/MatrixUserReposityService";

export interface UserMemoryItem {
    readonly id: string;
    readonly username: string;
    readonly displayname: string;
    readonly password: string;
    readonly homeserver: string;
    readonly devices?: DeviceModel[]; //all devices

}


export class MemoryMatrixUserRepositoryService {
    //export class MemoryMatrixUserRepositoryService implements MatrixUserRepositoryService {
    //private readonly _repository: MemoryMatrixUserRepositoryService;

    //public readonly items : MatrixUserRepositoryService[] = [];
    public constructor() {


    }

    public static readonly items: UserMemoryItem[] = [];

    public static async getAll(): Promise<UserReposityEntry[]> {
        console.log("KAIKKI : ", JSON.stringify(this.items));
        return map(this.items, item => ({
            id: item.id,
            username: item.username,
            displayname: item.displayname,
            password: item.password,
            homeserver: item.homeserver,
            devices: item.devices
        }));
    }

    public static async findByUsername(
        username: string,
        devices: DeviceModel[] = []
    ): Promise<UserReposityEntry | undefined> {

        const item = find(this.items, form => form.username === username);

        console.log("FIND : ", JSON.stringify(item));

        if (item === undefined) return undefined;

        return {
            id: item.id,
            username: item.username,
            displayname: item.displayname,
            password: item.password,
            homeserver: item.homeserver,
            devices: uniq(concat([], item.devices ? devices : [], item.devices))
        };

    }

    public static async createNewDevice(
        user: UserModel,
        newDevice: DeviceModel
    ): Promise<UserReposityEntry | undefined> {
        let loginUser = await this.findByUsername(user.username);
        let koko = loginUser.devices.push(newDevice);


        console.log("koko ", koko, JSON.stringify(loginUser.devices))

        return {
            id: loginUser.id,
            username: loginUser.username,
            displayname: loginUser.displayname,
            password: loginUser.password,
            homeserver: loginUser.homeserver,
            devices: loginUser.devices
        };
    }

    public static async createItem(
        //data: T,
        data: UserModel,
        devices: DeviceModel[] = []
        //) : Promise<UserReposityEntry<T>> {
    ): Promise<UserReposityEntry> {

        console.log("CREATEITEM");

        const id = MemoryMatrixUserRepositoryService._createId();

        //const existingItem = find(this._items, item => item.id === id);
        const existingItem = find(this.items, item => item.id === id);

        if (existingItem) throw new Error(`ID "${id}" was not unique`);

        // const item : UserMemoryItem<T> = {
        const item: UserMemoryItem = {
            id: MemoryMatrixUserRepositoryService._createId(),
            username: data.username,
            displayname: data.displayname,
            password: data.password,
            homeserver: data.homeserver,
            devices: uniq(concat([], data.devices ? devices : [], data.devices))
        };

        this.items.push(item);

        console.log("USER added: ", JSON.stringify(this.items));

        return {
            id: item.id,
            username: item.username,
            displayname: item.displayname,
            password: item.password,
            homeserver: item.homeserver,
            devices: item.devices ? item.devices.map(item => ({ id: item.id })) : undefined
            //devices: item.devices 
        };

    }

    private static _createId(): string {
        return randomBytes(20).toString('hex');
    }



}

export function isMemoryMatrixServerRepositoryService(value: any): value is MemoryMatrixUserRepositoryService {
    return value instanceof MemoryMatrixUserRepositoryService;
}
