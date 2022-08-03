// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { hasNoOtherKeys, isRegularObject, isString } from "../../../../../core/modules/lodash";

export interface Room {
    readonly id : string;
}

export function createRoom (
    id: string
): Room {
    return {
        id
    };
}

export function isRoom (value: any): value is Room {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'id'
        ])
        && isString(value?.id)
    );
}

export function stringifyRoom (value: Room): string {
    return `Room(${value})`;
}

export function parseRoom (value: any): Room | undefined {
    if ( isRoom(value) ) return value;
    return undefined;
}
