// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { hasNoOtherKeysInDevelopment, isRegularObject, isStringOrUndefined } from "../../../../core/modules/lodash";
import { isRoomJoinRulesStateContentDTO, RoomJoinRulesStateContentDTO } from "./RoomJoinRulesStateContentDTO";
import { MatrixStateEventOf } from "../../core/MatrixStateEventOf";
import { MatrixType } from "../../core/MatrixType";

/**
 * @see https://github.com/heusalagroup/hghs/issues/20
 */
export interface RoomJoinRulesStateEventDTO extends MatrixStateEventOf<RoomJoinRulesStateContentDTO> {
    readonly type      : MatrixType.M_ROOM_JOIN_RULES;
    readonly state_key : string;
    readonly content   : RoomJoinRulesStateContentDTO;
}

export function createRoomJoinRulesStateEventDTO (
    content : RoomJoinRulesStateContentDTO
): RoomJoinRulesStateEventDTO {
    return {
        type: MatrixType.M_ROOM_JOIN_RULES,
        state_key: '',
        content
    };
}

export function isRoomJoinRulesStateEventDTO (value: any): value is RoomJoinRulesStateEventDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'type',
            'state_key',
            'content'
        ])
        && value?.type === MatrixType.M_ROOM_HISTORY_VISIBILITY
        && isStringOrUndefined(value?.state_key)
        && isRoomJoinRulesStateContentDTO(value?.content)
    );
}

export function stringifyRoomJoinRulesStateEventDTO (value: RoomJoinRulesStateEventDTO): string {
    return `RoomJoinRulesStateEventDTO(${value})`;
}

export function parseRoomJoinRulesStateEventDTO (value: any): RoomJoinRulesStateEventDTO | undefined {
    if ( isRoomJoinRulesStateEventDTO(value) ) return value;
    return undefined;
}
