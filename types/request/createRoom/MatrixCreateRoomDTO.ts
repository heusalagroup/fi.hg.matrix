// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeysInDevelopment,
    isArrayOf,
    isBooleanOrUndefined,
    isRegularObject,
    isStringOrUndefined,
    isUndefined
} from "../../../../core/modules/lodash";
import { MatrixVisibility,  isMatrixVisibility } from "./types/MatrixVisibility";
import { isMatrixInvite3PidDTO } from "./types/MatrixInvite3PidDTO";
import { MatrixRoomCreateEventDTO,  isPartialMatrixCreationContentDTO } from "../../event/roomCreate/MatrixRoomCreateEventDTO";
import { MatrixStateEvent,  isMatrixStateEvent } from "../../core/MatrixStateEvent";
import { MatrixCreateRoomPreset,  isMatrixCreateRoomPreset } from "./types/MatrixCreateRoomPreset";
import { MatrixRoomPowerLevelsEventDTO,  isMatrixPowerLevelEventContentDTO } from "./types/MatrixRoomPowerLevelsEventDTO";
import { MatrixInvite3PidDTO } from "./types/MatrixInvite3PidDTO";
import { MatrixUserId,  isMatrixUserId } from "../../core/MatrixUserId";
import { MatrixRoomVersion } from "../../MatrixRoomVersion";

export interface MatrixCreateRoomDTO {

    readonly visibility                   ?: MatrixVisibility;
    readonly room_alias_name              ?: string;

    /**
     * User friendly room name. This must be unique.
     */
    readonly name                         ?: string;

    readonly topic                        ?: string;
    readonly invite                       ?: readonly MatrixUserId[];
    readonly invite_3pid                  ?: readonly MatrixInvite3PidDTO[];
    readonly room_version                 ?: MatrixRoomVersion;
    readonly creation_content             ?: Partial<MatrixRoomCreateEventDTO>;
    readonly initial_state                ?: readonly MatrixStateEvent[];
    readonly preset                       ?: MatrixCreateRoomPreset;
    readonly is_direct                    ?: boolean;
    readonly power_level_content_override ?: MatrixRoomPowerLevelsEventDTO;

}

export function isMatrixCreateRoomDTO (value: any): value is MatrixCreateRoomDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
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
        && (isUndefined(value?.invite) || isArrayOf<MatrixUserId>(value?.invite, isMatrixUserId))
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


