// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeysInDevelopment,
    isRegularObject,
    isString,
    isStringArray
} from "../../../../core/modules/lodash";

export interface GetDirectoryRoomAliasResponseDTO {
    readonly room_id : string;
    readonly servers : readonly string[];
}

export function createGetDirectoryRoomAliasResponseDTO (
    room_id : string,
    servers : readonly string[]
) : GetDirectoryRoomAliasResponseDTO {
    return {
        room_id,
        servers
    };
}

export function isGetDirectoryRoomAliasResponseDTO (value: any): value is GetDirectoryRoomAliasResponseDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'room_id',
            'servers'
        ])
        && isString(value?.room_id)
        && isStringArray(value?.servers)
    );
}

export function stringifyGetDirectoryRoomAliasResponseDTO (value: GetDirectoryRoomAliasResponseDTO): string {
    return `GetDirectoryRoomAliasResponseDTO(${value})`;
}

export function parseGetDirectoryRoomAliasResponseDTO (value: any): GetDirectoryRoomAliasResponseDTO | undefined {
    if ( isGetDirectoryRoomAliasResponseDTO(value) ) return value;
    return undefined;
}


