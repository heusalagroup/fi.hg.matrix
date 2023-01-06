// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { MatrixVisibility, isMatrixVisibilityOrUndefined, explainMatrixVisibilityOrUndefined } from "./types/MatrixVisibility";
import { explainMatrixInvite3PidDTO, isMatrixInvite3PidDTO } from "./types/MatrixInvite3PidDTO";
import { MatrixRoomCreateEventDTO, isPartialMatrixCreationContentDTOOrUndefined, explainPartialMatrixCreationContentDTOOrUndefined } from "../../event/roomCreate/MatrixRoomCreateEventDTO";
import { MatrixStateEvent, isMatrixStateEvent, explainMatrixStateEvent } from "../../core/MatrixStateEvent";
import { MatrixCreateRoomPreset, isMatrixCreateRoomPresetOrUndefined, explainMatrixCreateRoomPresetOrUndefined } from "./types/MatrixCreateRoomPreset";
import { MatrixRoomPowerLevelsEventDTO, isMatrixPowerLevelEventContentDTOOrUndefined, explainMatrixPowerLevelEventContentDTOOrUndefined } from "./types/MatrixRoomPowerLevelsEventDTO";
import { MatrixInvite3PidDTO } from "./types/MatrixInvite3PidDTO";
import { MatrixUserId, isMatrixUserId, explainMatrixUserId } from "../../core/MatrixUserId";
import { explainMatrixRoomVersionOrUndefined, isMatrixRoomVersionOrUndefined, MatrixRoomVersion } from "../../MatrixRoomVersion";
import { explain, explainProperty } from "../../../../core/types/explain";
import { explainBooleanOrUndefined, isBooleanOrUndefined } from "../../../../core/types/Boolean";
import { explainStringOrUndefined, isStringOrUndefined } from "../../../../core/types/String";
import { explainRegularObject, isRegularObject } from "../../../../core/types/RegularObject";
import { explainNoOtherKeys, hasNoOtherKeysInDevelopment } from "../../../../core/types/OtherKeys";
import { explainReadonlyArrayOfOrUndefined, isReadonlyArrayOfOrUndefined } from "../../../../core/types/Array";

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
        && isMatrixVisibilityOrUndefined(value?.visibility)
        && isStringOrUndefined(value?.room_alias_name)
        && isStringOrUndefined(value?.name)
        && isStringOrUndefined(value?.topic)
        && isReadonlyArrayOfOrUndefined<MatrixUserId>(value?.invite, isMatrixUserId)
        && isReadonlyArrayOfOrUndefined<MatrixInvite3PidDTO>(value?.invite_3pid, isMatrixInvite3PidDTO)
        && isMatrixRoomVersionOrUndefined(value?.room_version)
        && isPartialMatrixCreationContentDTOOrUndefined(value?.creation_content)
        && isReadonlyArrayOfOrUndefined<MatrixStateEvent>(value?.initial_state, isMatrixStateEvent)
        && isMatrixCreateRoomPresetOrUndefined(value?.preset)
        && isBooleanOrUndefined(value?.is_direct)
        && isMatrixPowerLevelEventContentDTOOrUndefined(value?.power_level_content_override)
    );
}

export function explainMatrixCreateRoomDTO (value: any): string {
    return explain([
        explainRegularObject(value),
        explainNoOtherKeys(value, [
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
        ]),
        explainProperty('visibility', explainMatrixVisibilityOrUndefined(value?.visibility)),
        explainProperty('room_alias_name', explainStringOrUndefined(value?.room_alias_name)),
        explainProperty('name', explainStringOrUndefined(value?.name)),
        explainProperty('topic', explainStringOrUndefined(value?.topic)),
        explainProperty('invite', explainReadonlyArrayOfOrUndefined<MatrixUserId>("MatrixUserId", explainMatrixUserId, value?.invite, isMatrixUserId)),
        explainProperty('invite_3pid', explainReadonlyArrayOfOrUndefined<MatrixInvite3PidDTO>("MatrixInvite3PidDTO", explainMatrixInvite3PidDTO, value?.invite_3pid, isMatrixInvite3PidDTO)),
        explainProperty('room_version', explainMatrixRoomVersionOrUndefined(value?.room_version)),
        explainProperty('creation_content', explainPartialMatrixCreationContentDTOOrUndefined(value?.creation_content)),
        explainProperty('initial_state', explainReadonlyArrayOfOrUndefined<MatrixStateEvent>("MatrixStateEvent", explainMatrixStateEvent, value?.initial_state, isMatrixStateEvent)),
        explainProperty('preset', explainMatrixCreateRoomPresetOrUndefined(value?.preset)),
        explainProperty('explain_direct', explainBooleanOrUndefined(value?.explain_direct)),
        explainProperty('power_level_content_override', explainMatrixPowerLevelEventContentDTOOrUndefined(value?.power_level_content_override))
    ]);
}

export function stringifyMatrixCreateRoomDTO (value: MatrixCreateRoomDTO): string {
    return `MatrixCreateRoomDTO(${value})`;
}

export function parseMatrixCreateRoomDTO (value: any): MatrixCreateRoomDTO | undefined {
    if ( isMatrixCreateRoomDTO(value) ) return value;
    return undefined;
}


