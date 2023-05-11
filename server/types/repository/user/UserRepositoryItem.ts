// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { toLower } from "../../../../../core/functions/toLower";
import { SimpleRepositoryItem } from "../../../../../core/simpleRepository/types/SimpleRepositoryItem";
import { User, isUser, createUser } from "./User";
import { parseJson } from "../../../../../core/Json";
import { createStoredUserRepositoryItem, StoredUserRepositoryItem } from "./StoredUserRepositoryItem";
import { isString, isStringOrUndefined } from "../../../../../core/types/String";
import { isRegularObject } from "../../../../../core/types/RegularObject";
import { hasNoOtherKeys } from "../../../../../core/types/OtherKeys";

export interface UserRepositoryItem extends SimpleRepositoryItem<User> {

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
    unparsedTarget: any
) : UserRepositoryItem | undefined {
    const target = parseJson(unparsedTarget);
    if ( !isUser(target) ) return undefined;
    const email = target?.email;
    return createUserRepositoryItem(
        id,
        createUser(
            id,
            target.username,
            target.password,
            email
        ),
        toLower(target?.username),
        email ? toLower(email) : undefined
    );
}

export function toStoredUserRepositoryItem (
    item: UserRepositoryItem
) : StoredUserRepositoryItem {
    const email = item?.target?.email;
    return createStoredUserRepositoryItem(
        item.id,
        JSON.stringify(item.target),
        toLower(item?.target?.username),
        email ? toLower(email) : undefined
    );
}
