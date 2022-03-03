// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { hasNoOtherKeys, isRegularObject, isString } from "../../../../../core/modules/lodash";

export interface MatrixHomeServerDTO {
    readonly base_url: string;
}

export function isMatrixHomeServerDTO (value: any): value is MatrixHomeServerDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, ['base_url'])
        && isString(value?.base_url)
    );
}

export function stringifyMatrixHomeServerDTO (value: MatrixHomeServerDTO): string {
    if ( !isMatrixHomeServerDTO(value) ) throw new TypeError(`Not MatrixHomeServerDTO: ${value}`);
    return `MatrixHomeServerDTO(${value})`;
}

export function parseMatrixHomeServerDTO (value: any): MatrixHomeServerDTO | undefined {
    if ( isMatrixHomeServerDTO(value) ) return value;
    return undefined;
}


export default MatrixHomeServerDTO;
