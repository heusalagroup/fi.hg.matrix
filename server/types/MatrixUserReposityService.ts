import { DeviceModel } from "./DeviceModel";

// different than userModel > id
export interface MatrixUserRepositoryService {
    readonly id: string;
    readonly username: string;
    readonly displayname: string;
    readonly password: string;
    readonly homeserver: string;
    readonly devices?: DeviceModel[]; //all devices
}