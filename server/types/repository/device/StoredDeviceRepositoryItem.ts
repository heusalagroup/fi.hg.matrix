// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { SimpleStoredRepositoryItem } from "../../../../../core/simpleRepository/types/SimpleStoredRepositoryItem";
import { isString } from "../../../../../core/types/String";
import { isRegularObject } from "../../../../../core/types/RegularObject";
import { hasNoOtherKeys } from "../../../../../core/types/OtherKeys";

export interface StoredDeviceRepositoryItem extends SimpleStoredRepositoryItem {

    /**
     * Unique internal ID
     */
    readonly id : string;

    /**
     * The user who this device belongs to
     */
    readonly userId : string;

    /**
     * Unique device ID which may be provided by the client
     */
    readonly deviceId : string;

    /** Current item data as JSON string
     */
    readonly target : string;

}

export function createStoredDeviceRepositoryItem (
    id: string,
    userId: string,
    deviceId: string,
    target: string
): StoredDeviceRepositoryItem {
    return {
        id,
        userId,
        deviceId,
        target
    };
}

export function isStoredDeviceRepositoryItem (value: any): value is StoredDeviceRepositoryItem {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'id',
            'userId',
            'deviceId',
            'target'
        ])
        && isString(value?.id)
        && isString(value?.userId)
        && isString(value?.deviceId)
        && isString(value?.target)
    );
}

export function stringifyStoredDeviceRepositoryItem (value: StoredDeviceRepositoryItem): string {
    return `StoredDeviceRepositoryItem(${value})`;
}

export function parseStoredDeviceRepositoryItem (value: any): StoredDeviceRepositoryItem | undefined {
    if ( isStoredDeviceRepositoryItem(value) ) return value;
    return undefined;
}
