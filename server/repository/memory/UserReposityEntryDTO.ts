/**
 * All users types
 * return true if array of users
 */

import { isUserModel, UserModel } from "../../types/UserModel";
import { isDeviceModel, DeviceModel } from "../../types/DeviceModel";
import {
    hasNoOtherKeys,
    isArrayOrUndefinedOf,
    isRegularObject,
    isString,
    isBooleanOrUndefined
} from '../../../../core/modules/lodash';

//export interface UserReposityEntry<T> {
export interface UserReposityEntry {
    readonly id: string;
    readonly username: string;
    readonly password: string;
    readonly homeserver: string;
    readonly displayname: string;
    readonly devices?: DeviceModel[];
}

export function isUserReposityEntry<T>(
    value: any
    //): value is UserReposityEntry<T>{
): value is UserReposityEntry {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'id',
            'username',
            'password',
            'homeserver',
            'displayname',
            'devices'
        ]

        )
        && isString(value?.id)
        && isString(value?.username)
        && isString(value?.displayname)
        && isString(value?.password)
        && isString(value?.homeserver)
        && isArrayOrUndefinedOf<string>(value?.devices, isDeviceModel)
    );

}