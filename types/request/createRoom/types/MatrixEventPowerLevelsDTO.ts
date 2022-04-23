// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    isInteger,
    isRegularObjectOf
} from "../../../../../core/modules/lodash";
import { isMatrixType, MatrixType } from "../../../core/MatrixType";

export type MatrixEventPowerLevelsDTO = {
    [K in MatrixType | string ]: number;
}

export function isMatrixEventPowerLevelsDTO (value: any): value is MatrixEventPowerLevelsDTO {
    return (
        isRegularObjectOf<MatrixType, number>(value, isMatrixType, isInteger)
    );
}

export function stringifyMatrixEventPowerLevelsDTO (value: MatrixEventPowerLevelsDTO): string {
    return `MatrixEventPowerLevelsDTO(${value})`;
}

export function parseMatrixEventPowerLevelsDTO (value: any): MatrixEventPowerLevelsDTO | undefined {
    if ( isMatrixEventPowerLevelsDTO(value) ) return value;
    return undefined;
}


