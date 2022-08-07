// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { hasNoOtherKeys, isRegularObject, isString } from "../../../../../core/modules/lodash";
import { StoredRepositoryItem } from "../../../../../core/simpleRepository/types/StoredRepositoryItem";

export interface StoredEventRepositoryItem extends StoredRepositoryItem {

    /**
     * Unique ID
     */
    readonly id : string;

    /** Current item data as JSON string
     */
    readonly target : string;

    readonly senderId : string;
    readonly roomId ?: string;

}

export function createStoredEventRepositoryItem (
    id: string,
    target: string,
    senderId: string,
    roomId ?: string
): StoredEventRepositoryItem {
    return {
        id,
        target,
        senderId,
        roomId
    };
}

export function isStoredEventRepositoryItem (value: any): value is StoredEventRepositoryItem {
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

export function stringifyStoredEventRepositoryItem (value: StoredEventRepositoryItem): string {
    return `StoredEventRepositoryItem(${value})`;
}

export function parseStoredEventRepositoryItem (value: any): StoredEventRepositoryItem | undefined {
    if ( isStoredEventRepositoryItem(value) ) return value;
    return undefined;
}
