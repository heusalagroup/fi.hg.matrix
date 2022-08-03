// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { hasNoOtherKeys, isRegularObject, isString, isStringOrUndefined, toLower } from "../../../../../core/modules/lodash";
import { RepositoryItem } from "../../../../../core/simpleRepository/types/RepositoryItem";
import { User, isUser } from "./User";
import { parseJson } from "../../../../../core/Json";
import { createStoredUserRepositoryItem, StoredUserRepositoryItem } from "./StoredUserRepositoryItem";

export interface UserRepositoryItem extends RepositoryItem<User> {

    readonly id: string;

    /**
     * Unique username
     */
    readonly username : string;

    /**
     * Email address
     */
    readonly email ?: string;

    readonly target: User;

}

export function createUserRepositoryItem (
    id: string,
    target: User,
    username: string,
    email ?: string | undefined
): UserRepositoryItem {
    return {
        id,
        target,
        username,
        email
    };
}

export function isUserRepositoryItem (value: any): value is UserRepositoryItem {
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
        && isUser(value?.target)
    );
}

export function stringifyUserRepositoryItem (value: UserRepositoryItem): string {
    return `HgHsUserRepositoryItem(${value})`;
}

export function parseUserRepositoryItem (
    id: string,
    unparsedData: any
) : UserRepositoryItem | undefined {
    const data = parseJson(unparsedData);
    if ( !isUser(data) ) return undefined;
    return createUserRepositoryItem(
        id,
        data,
        toLower(data?.username),
        toLower(data?.email)
    );
}

export function toStoredUserRepositoryItem (
    item: UserRepositoryItem
) : StoredUserRepositoryItem | undefined {
    const email = item?.target?.email;
    return createStoredUserRepositoryItem(
        item.id,
        JSON.stringify(item.target),
        toLower(item?.target?.username),
        email ? toLower(email) : undefined
    );
}
