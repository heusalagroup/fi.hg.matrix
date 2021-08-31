// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import MatrixErrorCode, { isMatrixErrorCode } from "./types/MatrixErrorCode";
import {
    hasNoOtherKeys,
    isRegularObject,
    isString
} from "../../../../ts/modules/lodash";

export interface MatrixErrorDTO {
    readonly errcode : MatrixErrorCode;
    readonly error   : string;
}

export function isMatrixErrorDTO (value: any): value is MatrixErrorDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'errcode',
            'error'
        ])
        && isMatrixErrorCode(value?.errcode)
        && isString(value?.error)
    );
}

export function stringifyMatrixErrorDTO (value: MatrixErrorDTO): string {
    return `MatrixErrorDTO(${value})`;
}

export function parseMatrixErrorDTO (value: any): MatrixErrorDTO | undefined {
    if ( isMatrixErrorDTO(value) ) return value;
    return undefined;
}

export default MatrixErrorDTO;
