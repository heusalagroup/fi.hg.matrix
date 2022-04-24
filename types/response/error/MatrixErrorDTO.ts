// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { MatrixErrorCode,  isMatrixErrorCode } from "./types/MatrixErrorCode";
import {
    hasNoOtherKeysInDevelopment,
    isNumberOrUndefined,
    isRegularObject,
    isString
} from "../../../../core/modules/lodash";

export interface MatrixErrorDTO {
    readonly errcode         : MatrixErrorCode;
    readonly error           : string;
    readonly retry_after_ms ?: number;
}

export function isMatrixErrorDTO (value: any): value is MatrixErrorDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'errcode',
            'error',
            'retry_after_ms'
        ])
        && isMatrixErrorCode(value?.errcode)
        && isString(value?.error)
        && isNumberOrUndefined(value?.retry_after_ms)
    );
}

export function stringifyMatrixErrorDTO (value: MatrixErrorDTO): string {
    return `MatrixErrorDTO(${value})`;
}

export function parseMatrixErrorDTO (value: any): MatrixErrorDTO | undefined {
    if ( isMatrixErrorDTO(value) ) return value;
    return undefined;
}


