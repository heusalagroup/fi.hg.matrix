// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { hasNoOtherKeys, isRegularObject, isString } from "../../../../../core/modules/lodash";

export interface Event {
    readonly id : string;
}

export function createEvent (
    id: string
): Event {
    return {
        id
    };
}

export function isEvent (value: any): value is Event {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'id'
        ])
        && isString(value?.id)
    );
}

export function stringifyEvent (value: Event): string {
    return `Event(${value})`;
}

export function parseEvent (value: any): Event | undefined {
    if ( isEvent(value) ) return value;
    return undefined;
}
