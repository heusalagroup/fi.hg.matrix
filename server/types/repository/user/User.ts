// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { hasNoOtherKeys, isRegularObject, isString } from "../../../../../core/modules/lodash";

export interface User {
    readonly id : string;
}

export function createUser (
    id: string
): User {
    return {
        id
    };
}

export function isUser (value: any): value is User {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'id'
        ])
        && isString(value?.id)
    );
}

export function stringifyUser (value: User): string {
    return `User(${value})`;
}

export function parseUser (value: any): User | undefined {
    if ( isUser(value) ) return value;
    return undefined;
}
