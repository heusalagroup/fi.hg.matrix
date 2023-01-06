// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { MatrixRoomId,  isMatrixRoomId } from "../../core/MatrixRoomId";
import { MatrixRoomAlias,  isMatrixRoomAlias } from "../../core/MatrixRoomAlias";
import { isUndefined } from "../../../../core/types/undefined";
import { isRegularObject } from "../../../../core/types/RegularObject";
import { hasNoOtherKeysInDevelopment } from "../../../../core/types/OtherKeys";

export interface MatrixCreateRoomResponseDTO {
    readonly room_id     : MatrixRoomId;
    readonly room_alias ?: MatrixRoomAlias;
}

export function createMatrixCreateRoomResponseDTO (
    room_id     : MatrixRoomId,
    room_alias ?: MatrixRoomAlias
) {
    return {
        room_id,
        room_alias
    };
}

export function isMatrixCreateRoomResponseDTO (value: any): value is MatrixCreateRoomResponseDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'room_id',
            'room_alias'
        ])
        && isMatrixRoomId(value?.room_id)
        && (isUndefined(value?.room_alias) || isMatrixRoomAlias(value?.room_alias))
    );
}

export function stringifyMatrixCreateRoomResponseDTO (value: MatrixCreateRoomResponseDTO): string {
    return `MatrixCreateRoomResponseDTO(${value})`;
}

export function parseMatrixCreateRoomResponseDTO (value: any): MatrixCreateRoomResponseDTO | undefined {
    if ( isMatrixCreateRoomResponseDTO(value) ) return value;
    return undefined;
}


