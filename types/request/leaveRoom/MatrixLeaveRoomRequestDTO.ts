// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import {
    hasNoOtherKeysInDevelopment,
    isRegularObject,
    isStringOrUndefined
} from "../../../../core/modules/lodash";

export interface MatrixLeaveRoomRequestDTO {
    readonly reason ?: string;
}

export function createMatrixLeaveRoomRequestDTO (
    reason : string | undefined
): MatrixLeaveRoomRequestDTO {
    return {
        reason
    };
}

export function isMatrixLeaveRoomRequestDTO (value: any): value is MatrixLeaveRoomRequestDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'reason'
        ])
        && isStringOrUndefined(value?.reason)
    );
}

export function stringifyMatrixLeaveRoomRequestDTO (value: MatrixLeaveRoomRequestDTO): string {
    return `MatrixLeaveRoomRequestDTO(${value})`;
}

export function parseMatrixLeaveRoomRequestDTO (value: any): MatrixLeaveRoomRequestDTO | undefined {
    if ( isMatrixLeaveRoomRequestDTO(value) ) return value;
    return undefined;
}
