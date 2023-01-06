// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { MatrixStateEventOf } from "../../core/MatrixStateEventOf";
import { isRoomMemberContentDTO, RoomMemberContentDTO } from "./RoomMemberContentDTO";
import { MatrixType } from "../../core/MatrixType";
import { isString } from "../../../../core/types/String";
import { isRegularObject } from "../../../../core/types/RegularObject";
import { hasNoOtherKeys } from "../../../../core/types/OtherKeys";

export interface RoomMemberStateEventDTO extends MatrixStateEventOf<RoomMemberContentDTO> {
    readonly type      : MatrixType.M_ROOM_MEMBER;
    readonly state_key : string;
    readonly content   : RoomMemberContentDTO;
}

export function createRoomMemberStateEventDTO (
    state_key: string,
    content: RoomMemberContentDTO
): RoomMemberStateEventDTO {
    return {
        type: MatrixType.M_ROOM_MEMBER,
        state_key,
        content
    };
}

export function isRoomMemberStateEventDTO (value: any): value is RoomMemberStateEventDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'type',
            'state_key',
            'content'
        ])
        && value?.type === MatrixType.M_ROOM_MEMBER
        && isString(value?.state_key)
        && isRoomMemberContentDTO(value?.content)
    );
}

export function stringifyRoomMemberStateEventDTO (value: RoomMemberStateEventDTO): string {
    return `RoomMemberStateEventDTO(${value})`;
}

export function parseRoomMemberStateEventDTO (value: any): RoomMemberStateEventDTO | undefined {
    if ( isRoomMemberStateEventDTO(value) ) return value;
    return undefined;
}
