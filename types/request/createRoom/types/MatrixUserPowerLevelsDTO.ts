// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { MatrixUserId,  isMatrixUserId } from "../../../core/MatrixUserId";
import { isUndefined } from "../../../../../core/types/undefined";
import { explainNot, explainOk, explainOr } from "../../../../../core/types/explain";
import { isInteger } from "../../../../../core/types/Number";
import { isRegularObjectOf } from "../../../../../core/types/RegularObject";

export type MatrixUserPowerLevelsDTO = {
    [K in MatrixUserId]: number
}

export function isMatrixUserPowerLevelsDTO (value: any): value is MatrixUserPowerLevelsDTO {
    return isRegularObjectOf<MatrixUserId, number>(value, isMatrixUserId, isInteger);
}

export function explainMatrixUserPowerLevelsDTO (value: any): string {
    return isMatrixUserPowerLevelsDTO(value) ? explainOk() : explainNot("MatrixUserPowerLevelsDTO");
}

export function isMatrixUserPowerLevelsDTOOrUndefined (value: any): value is MatrixUserPowerLevelsDTO | undefined {
    return isUndefined(value) || isMatrixUserPowerLevelsDTO(value);
}

export function explainMatrixUserPowerLevelsDTOOrUndefined (value: any): string {
    return isMatrixUserPowerLevelsDTOOrUndefined(value) ? explainOk() : explainNot(explainOr(["MatrixUserPowerLevelsDTO", "undefined"]));
}

export function stringifyMatrixUserPowerLevelsDTO (value: MatrixUserPowerLevelsDTO): string {
    return `MatrixUserPowerLevelsDTO(${value})`;
}

export function parseMatrixUserPowerLevelsDTO (value: any): MatrixUserPowerLevelsDTO | undefined {
    if ( isMatrixUserPowerLevelsDTO(value) ) return value;
    return undefined;
}


