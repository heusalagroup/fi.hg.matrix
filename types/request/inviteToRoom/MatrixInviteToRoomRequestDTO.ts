// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { isMatrixUserId, MatrixUserId } from "../../core/MatrixUserId";
import { isStringOrUndefined } from "../../../../core/types/String";
import { isRegularObject } from "../../../../core/types/RegularObject";
import { hasNoOtherKeysInDevelopment } from "../../../../core/types/OtherKeys";

export interface MatrixInviteToRoomRequestDTO {
    readonly user_id  : MatrixUserId;
    readonly reason  ?: string;
}

export function createMatrixInviteToRoomRequestDTO (
    user_id : MatrixUserId,
    reason  : string | undefined
): MatrixInviteToRoomRequestDTO {
    return {
        reason,
        user_id
    };
}

export function isMatrixInviteToRoomRequestDTO (value: any): value is MatrixInviteToRoomRequestDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'reason',
            'user_id'
        ])
        && isMatrixUserId(value?.user_id)
        && isStringOrUndefined(value?.reason)
    );
}

export function stringifyMatrixInviteToRoomRequestDTO (value: MatrixInviteToRoomRequestDTO): string {
    return `MatrixInviteToRoomRequestDTO(${value})`;
}

export function parseMatrixInviteToRoomRequestDTO (value: any): MatrixInviteToRoomRequestDTO | undefined {
    if ( isMatrixInviteToRoomRequestDTO(value) ) return value;
    return undefined;
}
