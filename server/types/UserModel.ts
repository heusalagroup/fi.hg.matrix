import { isString, isArrayOrUndefined } from "../../../core/modules/lodash";
import { MatrixUserId } from "../../types/core/MatrixUserId";
import { DeviceModel } from "./DeviceModel";

// userModel is different like matrixReposityservice
export interface UserModel {
    //readonly userId : MatrixUserId;
    readonly password: string;
    readonly username: string; // readonly username: MatrixUserId;
    readonly displayname: string;
    readonly homeserver: string;
    readonly devices?: DeviceModel[];
}

export function isUserModel(value: any) {
    return (
        !!value
        && isString(value?.username)
        && isString(value?.password)
        && isString(value?.displayname)
        && isString(value?.homeserver)
        && isString(value?.username)
        && isArrayOrUndefined(value?.devices)
    );
}

