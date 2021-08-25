// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { hasNoOtherKeys, isRegularObject } from "../../../../../ts/modules/lodash";
import MatrixRoomId, { isMatrixRoomId } from "../../../core/MatrixRoomId";

export interface MatrixJoinRoomResponseDTO {
    readonly room_id: MatrixRoomId;
}

export function isMatrixJoinRoomResponseDTO (value: any): value is MatrixJoinRoomResponseDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
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

export default MatrixJoinRoomResponseDTO;
