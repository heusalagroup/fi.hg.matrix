// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { isRoomMembershipType, RoomMembershipType } from "./RoomMembershipType";
import { hasNoOtherKeysInDevelopment, isRegularObject } from "../../../../core/modules/lodash";
import { isMatrixRoomId, MatrixRoomId } from "../../core/MatrixRoomId";
import { ReadonlyJsonObject } from "../../../../core/Json";

export interface RoomJoinRulesAllowConditionDTO extends ReadonlyJsonObject {
    readonly type    : RoomMembershipType;
    readonly room_id : MatrixRoomId;
}

export function createRoomJoinRulesAllowConditionDTO (
    type    : RoomMembershipType,
    room_id : MatrixRoomId
): RoomJoinRulesAllowConditionDTO {
    return {
        type,
        room_id
    };
}

export function isRoomJoinRulesAllowConditionDTO (value: any): value is RoomJoinRulesAllowConditionDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'type',
            'room_id'
        ])
        && isRoomMembershipType(value?.type)
        && isMatrixRoomId(value?.room_id)
    );
}

export function stringifyRoomJoinRulesAllowConditionDTO (value: RoomJoinRulesAllowConditionDTO): string {
    return `RoomJoinRulesAllowConditionDTO(${value})`;
}

export function parseRoomJoinRulesAllowConditionDTO (value: any): RoomJoinRulesAllowConditionDTO | undefined {
    if ( isRoomJoinRulesAllowConditionDTO(value) ) return value;
    return undefined;
}
