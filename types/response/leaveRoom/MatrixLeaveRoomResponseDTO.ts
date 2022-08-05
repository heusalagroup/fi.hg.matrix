// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { hasNoOtherKeysInDevelopment, isRegularObject } from "../../../../core/modules/lodash";

export interface MatrixLeaveRoomResponseDTO {
}

export function createMatrixLeaveRoomResponseDTO (): MatrixLeaveRoomResponseDTO {
    return {};
}

export function isMatrixLeaveRoomResponseDTO (value: any): value is MatrixLeaveRoomResponseDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [])
    );
}

export function stringifyMatrixLeaveRoomResponseDTO (value: MatrixLeaveRoomResponseDTO): string {
    return `MatrixLeaveRoomResponseDTO(${value})`;
}

export function parseMatrixLeaveRoomResponseDTO (value: any): MatrixLeaveRoomResponseDTO | undefined {
    if ( isMatrixLeaveRoomResponseDTO(value) ) return value;
    return undefined;
}
