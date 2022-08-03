// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { hasNoOtherKeys, isRegularObject, isString } from "../../../../../core/modules/lodash";
import { StoredRepositoryItem } from "../../../../../core/simpleRepository/types/StoredRepositoryItem";

export interface StoredUserRepositoryItem extends StoredRepositoryItem {

    /**
     * Unique ID
     */
    readonly id : string;

    /** Current item data as JSON string
     */
    readonly target : string;

}

export function createStoredUserRepositoryItem (
    id: string,
    target: string
): StoredUserRepositoryItem {
    return {
        id,
        target
    };
}

export function isStoredUserRepositoryItem (value: any): value is StoredUserRepositoryItem {
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

export function stringifyStoredUserRepositoryItem (value: StoredUserRepositoryItem): string {
    return `StoredUserRepositoryItem(${value})`;
}

export function parseStoredUserRepositoryItem (value: any): StoredUserRepositoryItem | undefined {
    if ( isStoredUserRepositoryItem(value) ) return value;
    return undefined;
}
