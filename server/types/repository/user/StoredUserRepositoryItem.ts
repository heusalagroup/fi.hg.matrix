// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { hasNoOtherKeys, isRegularObject, isString, isStringOrUndefined } from "../../../../../core/modules/lodash";
import { StoredRepositoryItem } from "../../../../../core/simpleRepository/types/StoredRepositoryItem";

export interface StoredUserRepositoryItem extends StoredRepositoryItem {

    /**
     * Unique ID in the database
     */
    readonly id : string;

    /**
     * Unique username
     */
    readonly username : string;

    /**
     * Email address
     */
    readonly email ?: string;

    /** Current item data as JSON string
     */
    readonly target : string;

}

export function createStoredUserRepositoryItem (
    id: string,
    target: string,
    username: string,
    email ?: string | undefined
): StoredUserRepositoryItem {
    return {
        id,
        username,
        email,
        target
    };
}

export function isStoredUserRepositoryItem (value: any): value is StoredUserRepositoryItem {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'id',
            'username',
            'email',
            'target'
        ])
        && isString(value?.id)
        && isString(value?.username)
        && isStringOrUndefined(value?.email)
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
