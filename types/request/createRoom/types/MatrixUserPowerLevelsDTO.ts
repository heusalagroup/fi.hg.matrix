// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { isInteger, isRegularObjectOf } from "../../../../../core/modules/lodash";
import MatrixUserId, { isMatrixUserId } from "../../../core/MatrixUserId";

export type MatrixUserPowerLevelsDTO = {
    [K in MatrixUserId]: number
}

export function isMatrixUserPowerLevelsDTO (value: any): value is MatrixUserPowerLevelsDTO {
    return (
        isRegularObjectOf<MatrixUserId, number>(value, isMatrixUserId, isInteger)
    );
}

export function stringifyMatrixUserPowerLevelsDTO (value: MatrixUserPowerLevelsDTO): string {
    return `MatrixUserPowerLevelsDTO(${value})`;
}

export function parseMatrixUserPowerLevelsDTO (value: any): MatrixUserPowerLevelsDTO | undefined {
    if ( isMatrixUserPowerLevelsDTO(value) ) return value;
    return undefined;
}

export default MatrixUserPowerLevelsDTO;
