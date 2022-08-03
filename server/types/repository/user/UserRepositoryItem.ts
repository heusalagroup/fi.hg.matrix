// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { hasNoOtherKeys, isRegularObject, isString } from "../../../../../core/modules/lodash";
import { RepositoryItem } from "../../../../../core/simpleRepository/types/RepositoryItem";
import { User, isUser } from "./User";
import { parseJson } from "../../../../../core/Json";
import { createStoredUserRepositoryItem, StoredUserRepositoryItem } from "./StoredUserRepositoryItem";

export interface UserRepositoryItem extends RepositoryItem<User> {
    readonly id: string;
    readonly target: User;
}

export function createUserRepositoryItem (
    id: string,
    target: User
): UserRepositoryItem {
    return {
        id,
        target
    };
}

export function isUserRepositoryItem (value: any): value is UserRepositoryItem {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'id',
            'target'
        ])
        && isString(value?.id)
        && isUser(value?.target)
    );
}

export function stringifyUserRepositoryItem (value: UserRepositoryItem): string {
    return `HgHsUserRepositoryItem(${value})`;
}

export function parseUserRepositoryItem (id: string, unparsedData: any) : UserRepositoryItem | undefined {
    const data = parseJson(unparsedData);
    if ( !isUser(data) ) return undefined;
    return createUserRepositoryItem(
        id,
        data
    );
}

export function toStoredUserRepositoryItem (
    item: UserRepositoryItem
) : StoredUserRepositoryItem | undefined {
    return createStoredUserRepositoryItem(
        item.id,
        JSON.stringify(item.target)
    );
}
