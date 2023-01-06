// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import {
    isRoomGuestAccessContentDTO,
    RoomGuestAccessContentDTO
} from "./RoomGuestAccessContentDTO";
import { MatrixStateEventOf } from "../../core/MatrixStateEventOf";
import { MatrixType } from "../../core/MatrixType";
import { isString } from "../../../../core/types/String";
import { isRegularObject } from "../../../../core/types/RegularObject";
import { hasNoOtherKeysInDevelopment } from "../../../../core/types/OtherKeys";

export interface RoomGuestAccessStateEventDTO extends MatrixStateEventOf<RoomGuestAccessContentDTO> {
    readonly type      : MatrixType.M_ROOM_GUEST_ACCESS;
    readonly state_key : "";
    readonly content   : RoomGuestAccessContentDTO;
}

export function createRoomGuestAccessStateEventDTO (
    content: RoomGuestAccessContentDTO
): RoomGuestAccessStateEventDTO {
    return {
        type: MatrixType.M_ROOM_GUEST_ACCESS,
        state_key: '',
        content
    };
}

export function isRoomGuestAccessStateEventDTO (value: any): value is RoomGuestAccessStateEventDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'type',
            'state_key',
            'content'
        ])
        && value?.type === MatrixType.M_ROOM_GUEST_ACCESS
        && isString(value?.state_key)
        && isRoomGuestAccessContentDTO(value?.content)
    );
}

export function stringifyRoomGuestAccessStateEventDTO (value: RoomGuestAccessStateEventDTO): string {
    return `RoomGuestAccessStateEventDTO(${value})`;
}

export function parseRoomGuestAccessStateEventDTO (value: any): RoomGuestAccessStateEventDTO | undefined {
    if ( isRoomGuestAccessStateEventDTO(value) ) return value;
    return undefined;
}
