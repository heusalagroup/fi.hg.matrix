// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { hasNoOtherKeys, isRegularObject } from "../../../../core/modules/lodash";
import { isMatrixGuestAccess, MatrixGuestAccess } from "./MatrixGuestAccess";

export interface RoomGuestAccessContentDTO {
    readonly guest_access : MatrixGuestAccess;
}

export function createRoomGuestAccessContentDTO (
    guest_access: MatrixGuestAccess
): RoomGuestAccessContentDTO {
    return {
        guest_access
    };
}

export function isRoomGuestAccessContentDTO (value: any): value is RoomGuestAccessContentDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'guest_access'
        ])
        && isMatrixGuestAccess(value?.guest_access)
    );
}

export function stringifyRoomGuestAccessContentDTO (value: RoomGuestAccessContentDTO): string {
    return `RoomGuestAccessContentDTO(${value})`;
}

export function parseRoomGuestAccessContentDTO (value: any): RoomGuestAccessContentDTO | undefined {
    if ( isRoomGuestAccessContentDTO(value) ) return value;
    return undefined;
}
