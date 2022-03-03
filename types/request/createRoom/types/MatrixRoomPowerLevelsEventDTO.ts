// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeys,
    isIntegerOrUndefined,
    isRegularObject, isUndefined
} from "../../../../../core/modules/lodash";
import MatrixEventPowerLevelsDTO, { isMatrixEventPowerLevelsDTO } from "./MatrixEventPowerLevelsDTO";
import MatrixUserPowerLevelsDTO, { isMatrixUserPowerLevelsDTO } from "./MatrixUserPowerLevelsDTO";
import MatrixNotificationPowerLevelsDTO, { isMatrixNotificationPowerLevelsDTO } from "./MatrixNotificationPowerLevelsDTO";

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
        && hasNoOtherKeys(value, [
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
        && isMatrixEventPowerLevelsDTO(value?.events)
        && isIntegerOrUndefined(value?.events_default)
        && isIntegerOrUndefined(value?.invite)
        && isIntegerOrUndefined(value?.kick)
        && isIntegerOrUndefined(value?.redact)
        && isIntegerOrUndefined(value?.state_default)
        && ( isUndefined(value?.users) || isMatrixUserPowerLevelsDTO(value?.users) )
        && isIntegerOrUndefined(value?.users_default)
        && ( isUndefined(value?.users) || isMatrixNotificationPowerLevelsDTO(value?.notifications) )
    );
}

export function stringifyMatrixPowerLevelEventContentDTO (value: MatrixRoomPowerLevelsEventDTO): string {
    return `MatrixPowerLevelEventContentDTO(${value})`;
}

export function parseMatrixPowerLevelEventContentDTO (value: any): MatrixRoomPowerLevelsEventDTO | undefined {
    if ( isMatrixPowerLevelEventContentDTO(value) ) return value;
    return undefined;
}

export default MatrixRoomPowerLevelsEventDTO;
