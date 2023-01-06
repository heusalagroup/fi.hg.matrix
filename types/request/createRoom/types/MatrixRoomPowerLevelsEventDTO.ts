// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { MatrixEventPowerLevelsDTO, isMatrixEventPowerLevelsDTOOrUndefined, explainMatrixEventPowerLevelsDTOOrUndefined } from "./MatrixEventPowerLevelsDTO";
import { MatrixUserPowerLevelsDTO, isMatrixUserPowerLevelsDTOOrUndefined, explainMatrixUserPowerLevelsDTOOrUndefined } from "./MatrixUserPowerLevelsDTO";
import { MatrixNotificationPowerLevelsDTO, isMatrixNotificationPowerLevelsDTOOrUndefined, explainMatrixNotificationPowerLevelsDTOOrUndefined } from "./MatrixNotificationPowerLevelsDTO";
import { isUndefined } from "../../../../../core/types/undefined";
import { explain, explainNot, explainOk, explainOr, explainProperty } from "../../../../../core/types/explain";
import { explainIntegerOrUndefined, isIntegerOrUndefined } from "../../../../../core/types/Number";
import { explainRegularObject, isRegularObject } from "../../../../../core/types/RegularObject";
import { explainNoOtherKeys, hasNoOtherKeysInDevelopment } from "../../../../../core/types/OtherKeys";

export interface MatrixRoomPowerLevelsEventDTO {
    readonly ban            ?: number;
    readonly events         ?: MatrixEventPowerLevelsDTO;
    readonly events_default ?: number;
    readonly invite         ?: number;
    readonly kick           ?: number;
    readonly redact         ?: number;
    readonly state_default  ?: number;
    readonly users          ?: MatrixUserPowerLevelsDTO;
    readonly users_default  ?: number;
    readonly notifications  ?: MatrixNotificationPowerLevelsDTO;
}

export function isMatrixPowerLevelEventContentDTO (value: any): value is MatrixRoomPowerLevelsEventDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'ban',
            'events',
            'events_default',
            'invite',
            'kick',
            'redact',
            'state_default',
            'users',
            'users_default',
            'notifications'
        ])
        && isIntegerOrUndefined(value?.ban)
        && isMatrixEventPowerLevelsDTOOrUndefined(value?.events)
        && isIntegerOrUndefined(value?.events_default)
        && isIntegerOrUndefined(value?.invite)
        && isIntegerOrUndefined(value?.kick)
        && isIntegerOrUndefined(value?.redact)
        && isIntegerOrUndefined(value?.state_default)
        && isMatrixUserPowerLevelsDTOOrUndefined(value?.users)
        && isIntegerOrUndefined(value?.users_default)
        && isMatrixNotificationPowerLevelsDTOOrUndefined(value?.notifications)
    );
}

export function explainMatrixPowerLevelEventContentDTO (value : any) : string {
    return explain(
        [
            explainRegularObject(value),
            explainNoOtherKeys(value, [
                'ban',
                'events',
                'events_default',
                'invite',
                'kick',
                'redact',
                'state_default',
                'users',
                'users_default',
                'notifications'
            ]),
            explainProperty("ban", explainIntegerOrUndefined(value?.ban)),
            explainProperty("events", explainMatrixEventPowerLevelsDTOOrUndefined(value?.events)),
            explainProperty("events_default", explainIntegerOrUndefined(value?.events_default)),
            explainProperty("invite", explainIntegerOrUndefined(value?.invite)),
            explainProperty("kick", explainIntegerOrUndefined(value?.kick)),
            explainProperty("redact", explainIntegerOrUndefined(value?.redact)),
            explainProperty("state_default", explainIntegerOrUndefined(value?.state_default)),
            explainProperty("users", explainMatrixUserPowerLevelsDTOOrUndefined(value?.users)),
            explainProperty("users_default", explainIntegerOrUndefined(value?.users_default)),
            explainProperty("notifications", explainMatrixNotificationPowerLevelsDTOOrUndefined(value?.notifications))
        ]
    );
}

export function isMatrixPowerLevelEventContentDTOOrUndefined (value: any): value is MatrixRoomPowerLevelsEventDTO | undefined {
    return isUndefined(value) || isMatrixPowerLevelEventContentDTO(value);
}

export function explainMatrixPowerLevelEventContentDTOOrUndefined (value: any): string {
    return isMatrixPowerLevelEventContentDTOOrUndefined(value) ? explainOk() : explainNot(explainOr(["MatrixPowerLevelEventContentDTO", "undefined"]));
}

export function stringifyMatrixPowerLevelEventContentDTO (value: MatrixRoomPowerLevelsEventDTO): string {
    return `MatrixPowerLevelEventContentDTO(${value})`;
}

export function parseMatrixPowerLevelEventContentDTO (value: any): MatrixRoomPowerLevelsEventDTO | undefined {
    if ( isMatrixPowerLevelEventContentDTO(value) ) return value;
    return undefined;
}


