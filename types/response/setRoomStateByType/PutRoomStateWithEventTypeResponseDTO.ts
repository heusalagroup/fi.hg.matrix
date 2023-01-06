// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { isString } from "../../../../core/types/String";
import { isRegularObject } from "../../../../core/types/RegularObject";
import { hasNoOtherKeysInDevelopment } from "../../../../core/types/OtherKeys";

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


