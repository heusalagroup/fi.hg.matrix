// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { hasNoOtherKeys, isRegularObject, isString, isStringOrUndefined } from "../../../../../core/modules/lodash";

export interface Device {

    /**
     * The internal database ID, which cannot be changed.
     */
    readonly id : string;

    /**
     * The user ID who this device belongs to
     */
    readonly userId : string;

    /**
     * The ID which may be provided by the client
     */
    readonly deviceId ?: string;

}

export function createDevice (
    id: string,
    userId: string,
    deviceId ?: string | undefined
): Device {
    return {
        id,
        userId,
        deviceId
    };
}

export function isDevice (value: any): value is Device {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'id',
            'userId',
            'deviceId'
        ])
        && isString(value?.id)
        && isString(value?.userId)
        && isStringOrUndefined(value?.deviceId)
    );
}

export function stringifyDevice (value: Device): string {
    return `Device(${value})`;
}

export function parseDevice (value: any): Device | undefined {
    if ( isDevice(value) ) return value;
    return undefined;
}
