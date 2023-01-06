// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { isString } from "../../../../../core/types/String";
import { isRegularObject } from "../../../../../core/types/RegularObject";
import { hasNoOtherKeysInDevelopment } from "../../../../../core/types/OtherKeys";

export interface MatrixPreviousRoomDTO {
    readonly room_id  : string;
    readonly event_id : string;
}

export function isMatrixPreviousRoomDTO (value: any): value is MatrixPreviousRoomDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, ['room_id', 'event_id'])
        && isString(value?.room_id)
        && isString(value?.event_id)
    );
}

export function stringifyMatrixPreviousRoomDTO (value: MatrixPreviousRoomDTO): string {
    return `MatrixPreviousRoomDTO(${value})`;
}

export function parseMatrixPreviousRoomDTO (value: any): MatrixPreviousRoomDTO | undefined {
    if ( isMatrixPreviousRoomDTO(value) ) return value;
    return undefined;
}


