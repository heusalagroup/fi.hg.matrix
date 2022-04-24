// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { hasNoOtherKeysInDevelopment, isRegularObject } from "../../../../core/modules/lodash";
import { MatrixRoomId,  isMatrixRoomId } from "../../core/MatrixRoomId";

export interface MatrixJoinRoomResponseDTO {
    readonly room_id: MatrixRoomId;
}

export function createMatrixJoinRoomResponseDTO (
    room_id: MatrixRoomId
) : MatrixJoinRoomResponseDTO {
    return {
        room_id
    };
}

export function isMatrixJoinRoomResponseDTO (value: any): value is MatrixJoinRoomResponseDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'room_id'
        ])
        && isMatrixRoomId(value?.room_id)
    );
}

export function stringifyMatrixJoinRoomResponseDTO (value: MatrixJoinRoomResponseDTO): string {
    return `MatrixJoinRoomResponseDTO(${value})`;
}

export function parseMatrixJoinRoomResponseDTO (value: any): MatrixJoinRoomResponseDTO | undefined {
    if ( isMatrixJoinRoomResponseDTO(value) ) return value;
    return undefined;
}


