// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { hasNoOtherKeys, isRegularObject, isString } from "../../../../../core/modules/lodash";
import { StoredRepositoryItem } from "../../../../../core/simpleRepository/types/StoredRepositoryItem";

export interface StoredRoomRepositoryItem extends StoredRepositoryItem {

    /**
     * Unique ID
     */
    readonly id : string;

    /** Current item data as JSON string
     */
    readonly target : string;

}

export function createStoredRoomRepositoryItem (
    id: string,
    target: string
): StoredRoomRepositoryItem {
    return {
        id,
        target
    };
}

export function isStoredRoomRepositoryItem (value: any): value is StoredRoomRepositoryItem {
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

export function stringifyStoredRoomRepositoryItem (value: StoredRoomRepositoryItem): string {
    return `StoredRoomRepositoryItem(${value})`;
}

export function parseStoredRoomRepositoryItem (value: any): StoredRoomRepositoryItem | undefined {
    if ( isStoredRoomRepositoryItem(value) ) return value;
    return undefined;
}
