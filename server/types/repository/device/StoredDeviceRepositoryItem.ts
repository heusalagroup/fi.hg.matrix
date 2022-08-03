// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { hasNoOtherKeys, isRegularObject, isString } from "../../../../../core/modules/lodash";
import { StoredRepositoryItem } from "../../../../../core/simpleRepository/types/StoredRepositoryItem";

export interface StoredDeviceRepositoryItem extends StoredRepositoryItem {

    /**
     * Unique ID
     */
    readonly id : string;

    /** Current item data as JSON string
     */
    readonly target : string;

}

export function createStoredDeviceRepositoryItem (
    id: string,
    target: string
): StoredDeviceRepositoryItem {
    return {
        id,
        target
    };
}

export function isStoredDeviceRepositoryItem (value: any): value is StoredDeviceRepositoryItem {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'id',
            'target'
        ])
        && isString(value?.id)
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
