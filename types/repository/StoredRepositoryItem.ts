// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { isRegularObject, isString } from "../../../core/modules/lodash";

export interface StoredRepositoryItem {

    /**
     * Unique ID
     */
    readonly id : string;

    /** Current item data as JSON string
     */
    readonly target : string;

}

export function isStoredRepositoryItem (value: any): value is StoredRepositoryItem {
    return (
        isRegularObject(value)
        && isString(value?.id)
        && isString(value?.target)
    );
}

export function stringifyStoredRepositoryItem (value: StoredRepositoryItem): string {
    return `StoredRepositoryItem(${value})`;
}

export function parseStoredRepositoryItem (value: any): StoredRepositoryItem | undefined {
    if ( isStoredRepositoryItem(value) ) return value;
    return undefined;
}
