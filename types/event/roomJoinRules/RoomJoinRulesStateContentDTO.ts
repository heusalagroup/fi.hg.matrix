// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { isMatrixJoinRule, MatrixJoinRule } from "./MatrixJoinRule";
import { isRoomJoinRulesAllowConditionDTO, RoomJoinRulesAllowConditionDTO } from "./RoomJoinRulesAllowConditionDTO";
import { hasNoOtherKeysInDevelopment, isArrayOf, isRegularObject } from "../../../../core/modules/lodash";

export interface RoomJoinRulesStateContentDTO {
    readonly allow     : readonly RoomJoinRulesAllowConditionDTO[];
    readonly join_rule : MatrixJoinRule;
}

export function createRoomJoinRulesStateContentDTO (
    join_rule : MatrixJoinRule,
    allow     : readonly RoomJoinRulesAllowConditionDTO[]
): RoomJoinRulesStateContentDTO {
    return {
        join_rule,
        allow
    };
}

export function isRoomJoinRulesStateContentDTO (value: any): value is RoomJoinRulesStateContentDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'allow',
            'join_rule'
        ])
        && isArrayOf<RoomJoinRulesAllowConditionDTO>(value?.allow, isRoomJoinRulesAllowConditionDTO)
        && isMatrixJoinRule(value?.join_rule)
    );
}

export function stringifyRoomJoinRulesStateContentDTO (value: RoomJoinRulesStateContentDTO): string {
    return `RoomJoinRulesStateContentDTO(${value})`;
}

export function parseRoomJoinRulesStateContentDTO (value: any): RoomJoinRulesStateContentDTO | undefined {
    if ( isRoomJoinRulesStateContentDTO(value) ) return value;
    return undefined;
}
