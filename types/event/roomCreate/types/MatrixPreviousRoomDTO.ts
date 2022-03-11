// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { hasNoOtherKeys, isRegularObject, isString } from "../../../../../core/modules/lodash";

export interface MatrixPreviousRoomDTO {
    readonly room_id  : string;
    readonly event_id : string;
}

export function isMatrixPreviousRoomDTO (value: any): value is MatrixPreviousRoomDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, ['room_id', 'event_id'])
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


