// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { isMatrixGuestAccess, MatrixGuestAccess } from "./MatrixGuestAccess";
import { ReadonlyJsonObject } from "../../../../core/Json";
import { isRegularObject } from "../../../../core/types/RegularObject";
import { hasNoOtherKeysInDevelopment } from "../../../../core/types/OtherKeys";

export interface RoomGuestAccessContentDTO extends ReadonlyJsonObject {
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
        && hasNoOtherKeysInDevelopment(value, [
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
