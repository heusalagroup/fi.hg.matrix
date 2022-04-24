// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { hasNoOtherKeysInDevelopment, isRegularObject, isString } from "../../../../core/modules/lodash";

export interface GetRoomStateByTypeResponseDTO {
    readonly name : string;
}

export function createGetRoomStateByTypeResponseDTO (
    name : string
): GetRoomStateByTypeResponseDTO {
    return {
        name
    };
}

export function isGetRoomStateByTypeResponseDTO (value: any): value is GetRoomStateByTypeResponseDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'name'
        ])
        && isString(value?.name)
    );
}

export function stringifyGetRoomStateByTypeResponseDTO (value: GetRoomStateByTypeResponseDTO): string {
    return `GetRoomStateByTypeResponseDTO(${value})`;
}

export function parseGetRoomStateByTypeResponseDTO (value: any): GetRoomStateByTypeResponseDTO | undefined {
    if ( isGetRoomStateByTypeResponseDTO(value) ) return value;
    return undefined;
}
