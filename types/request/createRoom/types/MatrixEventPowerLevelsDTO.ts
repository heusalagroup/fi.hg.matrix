// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    isInteger,
    isRegularObjectOf,
    isString
} from "../../../../../core/modules/lodash";
import MatrixEventType from "../../../event/MatrixEventType";
import MatrixType from "../../../core/MatrixType";

export type MatrixEventPowerLevelsDTO = {
    [K in MatrixEventType | MatrixType | string ]: number;
}

export function isMatrixEventPowerLevelsDTO (value: any): value is MatrixEventPowerLevelsDTO {
    return (
        isRegularObjectOf<MatrixEventType, number>(value, isString, isInteger)
    );
}

export function stringifyMatrixEventPowerLevelsDTO (value: MatrixEventPowerLevelsDTO): string {
    return `MatrixEventPowerLevelsDTO(${value})`;
}

export function parseMatrixEventPowerLevelsDTO (value: any): MatrixEventPowerLevelsDTO | undefined {
    if ( isMatrixEventPowerLevelsDTO(value) ) return value;
    return undefined;
}

export default MatrixEventPowerLevelsDTO;
