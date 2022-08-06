// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    explain, explainNoOtherKeys, explainNot, explainNumberOrUndefined, explainOk, explainOr, explainProperty, explainRegularObject,
    hasNoOtherKeysInDevelopment,
    isNumberOrUndefined,
    isRegularObject, isUndefined
} from "../../../../../core/modules/lodash";
import { isMatrixEventPowerLevelsDTO, MatrixEventPowerLevelsDTO } from "./MatrixEventPowerLevelsDTO";
import { isMatrixUserPowerLevelsDTOOrUndefined } from "./MatrixUserPowerLevelsDTO";

export interface MatrixNotificationPowerLevelsDTO {
    readonly room: number;
}

export function isMatrixNotificationPowerLevelsDTO (value: any): value is MatrixNotificationPowerLevelsDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'room'
        ])
        && isNumberOrUndefined(value?.room)
    );
}

export function explainMatrixNotificationPowerLevelsDTO (value: any): string {
    return explain(
        [
            explainRegularObject(value),
            explainNoOtherKeys(value, [
                'room'
            ]),
            explainProperty("room", explainNumberOrUndefined(value?.room))
        ]
    );
}

export function isMatrixNotificationPowerLevelsDTOOrUndefined (value: any): value is MatrixNotificationPowerLevelsDTO | undefined {
    return isUndefined(value) || isMatrixNotificationPowerLevelsDTO(value);
}

export function explainMatrixNotificationPowerLevelsDTOOrUndefined (value: any): string {
    return isMatrixNotificationPowerLevelsDTOOrUndefined(value) ? explainOk() : explainNot(explainOr(["MatrixNotificationPowerLevelsDTO", "undefined"]));
}

export function stringifyMatrixNotificationPowerLevelsDTO (value: MatrixNotificationPowerLevelsDTO): string {
    return `MatrixNotificationPowerLevelsDTO(${value})`;
}

export function parseMatrixNotificationPowerLevelsDTO (value: any): MatrixNotificationPowerLevelsDTO | undefined {
    if ( isMatrixNotificationPowerLevelsDTO(value) ) return value;
    return undefined;
}


