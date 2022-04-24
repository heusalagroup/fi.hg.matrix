// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { hasNoOtherKeysInDevelopment, isRegularObject, isString } from "../../../../core/modules/lodash";

export interface SetRoomStateByTypeRequestDTO {
    readonly avatar_url  : string;
    readonly displayname : string;
    readonly membership  : string;
}

export function createSetRoomStateByTypeRequestDTO (
    avatar_url,
    displayname,
    membership
): SetRoomStateByTypeRequestDTO {
    return {
        avatar_url,
        displayname,
        membership
    };
}

export function isSetRoomStateByTypeRequestDTO (value: any): value is SetRoomStateByTypeRequestDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'avatar_url',
            'displayname',
            'membership'
        ])
        && isString(value?.avatar_url)
        && isString(value?.displayname)
        && isString(value?.membership)
    );
}

export function stringifySetRoomStateByTypeRequestDTO (value: SetRoomStateByTypeRequestDTO): string {
    return `SetRoomStateByTypeRequestDTO(${value})`;
}

export function parseSetRoomStateByTypeRequestDTO (value: any): SetRoomStateByTypeRequestDTO | undefined {
    if ( isSetRoomStateByTypeRequestDTO(value) ) return value;
    return undefined;
}
