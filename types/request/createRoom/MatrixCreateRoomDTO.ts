// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeys,
    isArrayOf,
    isBooleanOrUndefined,
    isRegularObject,
    isString,
    isStringOrUndefined,
    isUndefined
} from "../../../../ts/modules/lodash";
import MatrixVisibility, { isMatrixVisibility } from "./types/MatrixVisibility";
import { isMatrixInvite3PidDTO } from "./types/MatrixInvite3PidDTO";
import MatrixRoomCreateEventDTO, { isPartialMatrixCreationContentDTO } from "../../event/roomCreate/MatrixRoomCreateEventDTO";
import MatrixStateEvent, { isMatrixStateEvent } from "../../core/MatrixStateEvent";
import MatrixCreateRoomPreset, { isMatrixCreateRoomPreset } from "./types/MatrixCreateRoomPreset";
import MatrixRoomPowerLevelsEventDTO, { isMatrixPowerLevelEventContentDTO } from "./types/MatrixRoomPowerLevelsEventDTO";
import MatrixInvite3PidDTO from "./types/MatrixInvite3PidDTO";

export interface MatrixCreateRoomDTO {

    readonly visibility                   ?: MatrixVisibility;
    readonly room_alias_name              ?: string;
    readonly name                         ?: string;
    readonly topic                        ?: string;
    readonly invite                       ?: string[];
    readonly invite_3pid                  ?: MatrixInvite3PidDTO[];
    readonly room_version                 ?: string;
    readonly creation_content             ?: Partial<MatrixRoomCreateEventDTO>;
    readonly initial_state                ?: MatrixStateEvent[];
    readonly preset                       ?: MatrixCreateRoomPreset;
    readonly is_direct                    ?: boolean;
    readonly power_level_content_override ?: MatrixRoomPowerLevelsEventDTO;

}

export function isMatrixCreateRoomDTO (value: any): value is MatrixCreateRoomDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'visibility',
            'room_alias_name',
            'name',
            'topic',
            'invite',
            'invite_3pid',
            'room_version',
            'creation_content',
            'initial_state',
            'preset',
            'is_direct',
            'power_level_content_override'
        ])
        && (isUndefined(value?.visibility) || isMatrixVisibility(value?.visibility))
        && isStringOrUndefined(value?.room_alias_name)
        && isStringOrUndefined(value?.name)
        && isStringOrUndefined(value?.topic)
        && (isUndefined(value?.invite) || isArrayOf<string>(value?.invite, isString))
        && (isUndefined(value?.invite_3pid) || isArrayOf<MatrixInvite3PidDTO>(value?.invite_3pid, isMatrixInvite3PidDTO))
        && isStringOrUndefined(value?.room_version)
        && (isUndefined(value?.creation_content) || isPartialMatrixCreationContentDTO(value?.creation_content))
        && (isUndefined(value?.initial_state) || isArrayOf<MatrixStateEvent>(value?.initial_state, isMatrixStateEvent))
        && (isUndefined(value?.preset) || isMatrixCreateRoomPreset(value?.preset))
        && isBooleanOrUndefined(value?.is_direct)
        && (isUndefined(value?.power_level_content_override) || isMatrixPowerLevelEventContentDTO(value?.power_level_content_override))
    );
}

export function stringifyMatrixCreateRoomDTO (value: MatrixCreateRoomDTO): string {
    return `MatrixCreateRoomDTO(${value})`;
}

export function parseMatrixCreateRoomDTO (value: any): MatrixCreateRoomDTO | undefined {
    if ( isMatrixCreateRoomDTO(value) ) return value;
    return undefined;
}

export default MatrixCreateRoomDTO;
