// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { hasNoOtherKeysInDevelopment, isBooleanOrUndefined, isNumberOrUndefined, isRegularObject, isString, isStringOrUndefined, isUndefined } from "../../../../core/modules/lodash";
import { isReadonlyJsonObject, ReadonlyJsonObject } from "../../../../core/Json";

export interface SetRoomStateByTypeRequestDTO {
    readonly avatar_url  ?: string;
    readonly displayname ?: string;
    readonly membership  ?: string;
    readonly version     ?: number;
    readonly data        ?: ReadonlyJsonObject;
    readonly deleted     ?: boolean;
}

export function createSetRoomStateByTypeRequestDTO (
    avatar_url  ?: string,
    displayname ?: string,
    membership  ?: string,
    version ?: number,
    data ?: ReadonlyJsonObject,
    deleted ?: boolean
): SetRoomStateByTypeRequestDTO {
    return {
        avatar_url,
        displayname,
        membership,
        version,
        data,
        deleted
    };
}

export function isSetRoomStateByTypeRequestDTO (value: any): value is SetRoomStateByTypeRequestDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'avatar_url',
            'displayname',
            'membership',
            'version',
            'data',
            'deleted'
        ])
        && isStringOrUndefined(value?.avatar_url)
        && isStringOrUndefined(value?.displayname)
        && isStringOrUndefined(value?.membership)
        && isNumberOrUndefined(value?.version)
        && (isUndefined(value?.data) || isReadonlyJsonObject(value?.data))
        && isBooleanOrUndefined(value?.deleted)
    );
}

export function stringifySetRoomStateByTypeRequestDTO (value: SetRoomStateByTypeRequestDTO): string {
    return `SetRoomStateByTypeRequestDTO(${value})`;
}

export function parseSetRoomStateByTypeRequestDTO (value: any): SetRoomStateByTypeRequestDTO | undefined {
    if ( isSetRoomStateByTypeRequestDTO(value) ) return value;
    return undefined;
}
