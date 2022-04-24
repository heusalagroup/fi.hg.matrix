// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeysInDevelopment,
    isRegularObject,
    isString
} from "../../../../core/modules/lodash";

export interface PutRoomStateWithEventTypeResponseDTO {
    readonly event_id: string;
}

export function createPutRoomStateWithEventTypeResponseDTO (
    event_id: string
) : PutRoomStateWithEventTypeResponseDTO {
    return {
        event_id
    };
}

export function isPutRoomStateWithEventTypeResponseDTO (value: any): value is PutRoomStateWithEventTypeResponseDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'event_id'
        ])
        && isString(value?.event_id)
    );
}

export function stringifyPutRoomStateWithEventTypeResponseDTO (value: PutRoomStateWithEventTypeResponseDTO): string {
    return `PutRoomStateWithEventTypeDTO(${value})`;
}

export function parsePutRoomStateWithEventTypeResponseDTO (value: any): PutRoomStateWithEventTypeResponseDTO | undefined {
    if ( isPutRoomStateWithEventTypeResponseDTO(value) ) return value;
    return undefined;
}


