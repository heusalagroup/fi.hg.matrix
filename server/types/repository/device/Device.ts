// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { hasNoOtherKeys, isRegularObject, isString } from "../../../../../core/modules/lodash";

export interface Device {
    readonly id : string;
}

export function createDevice (
    id: string
): Device {
    return {
        id
    };
}

export function isDevice (value: any): value is Device {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'id'
        ])
        && isString(value?.id)
    );
}

export function stringifyDevice (value: Device): string {
    return `Device(${value})`;
}

export function parseDevice (value: any): Device | undefined {
    if ( isDevice(value) ) return value;
    return undefined;
}
