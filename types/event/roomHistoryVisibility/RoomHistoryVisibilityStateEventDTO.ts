// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { isRoomHistoryVisibilityStateContentDTO, RoomHistoryVisibilityStateContentDTO } from "./RoomHistoryVisibilityStateContentDTO";
import { MatrixStateEventOf } from "../../core/MatrixStateEventOf";
import { MatrixType } from "../../core/MatrixType";
import { isStringOrUndefined } from "../../../../core/types/String";
import { isRegularObject } from "../../../../core/types/RegularObject";
import { hasNoOtherKeysInDevelopment } from "../../../../core/types/OtherKeys";

export interface RoomHistoryVisibilityStateEventDTO extends MatrixStateEventOf<RoomHistoryVisibilityStateContentDTO> {
    readonly type      : MatrixType.M_ROOM_HISTORY_VISIBILITY;
    readonly state_key : string;
    readonly content   : RoomHistoryVisibilityStateContentDTO;
}

export function createRoomHistoryVisibilityStateEventDTO (
    content : RoomHistoryVisibilityStateContentDTO
): RoomHistoryVisibilityStateEventDTO {
    return {
        type: MatrixType.M_ROOM_HISTORY_VISIBILITY,
        state_key: '',
        content
    };
}

export function isRoomHistoryVisibilityStateEventDTO (value: any): value is RoomHistoryVisibilityStateEventDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'type',
            'state_key',
            'content'
        ])
        && value?.type === MatrixType.M_ROOM_HISTORY_VISIBILITY
        && isStringOrUndefined(value?.state_key)
        && isRoomHistoryVisibilityStateContentDTO(value?.content)
    );
}

export function stringifyRoomHistoryVisibilityStateEventDTO (value: RoomHistoryVisibilityStateEventDTO): string {
    return `RoomHistoryVisibilityStateEventDTO(${value})`;
}

export function parseRoomHistoryVisibilityStateEventDTO (value: any): RoomHistoryVisibilityStateEventDTO | undefined {
    if ( isRoomHistoryVisibilityStateEventDTO(value) ) return value;
    return undefined;
}
