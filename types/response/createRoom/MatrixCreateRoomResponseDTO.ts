// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { hasNoOtherKeys, isRegularObject, isUndefined } from "../../../../core/modules/lodash";
import { MatrixRoomId,  isMatrixRoomId } from "../../core/MatrixRoomId";
import { MatrixRoomAlias,  isMatrixRoomAlias } from "../../core/MatrixRoomAlias";

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
        && hasNoOtherKeys(value, [
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


