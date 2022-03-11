// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeys,
    isNumberOrUndefined,
    isRegularObject
} from "../../../../../core/modules/lodash";

export interface MatrixNotificationPowerLevelsDTO {
    readonly room: number;
}

export function isMatrixNotificationPowerLevelsDTO (value: any): value is MatrixNotificationPowerLevelsDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'room'
        ])
        && isNumberOrUndefined(value?.room)
    );
}

export function stringifyMatrixNotificationPowerLevelsDTO (value: MatrixNotificationPowerLevelsDTO): string {
    return `MatrixNotificationPowerLevelsDTO(${value})`;
}

export function parseMatrixNotificationPowerLevelsDTO (value: any): MatrixNotificationPowerLevelsDTO | undefined {
    if ( isMatrixNotificationPowerLevelsDTO(value) ) return value;
    return undefined;
}


