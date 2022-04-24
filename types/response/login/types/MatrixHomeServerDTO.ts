// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { hasNoOtherKeysInDevelopment, isRegularObject, isString } from "../../../../../core/modules/lodash";

export interface MatrixHomeServerDTO {
    readonly base_url: string;
}

export function createMatrixHomeServerDTO (
    base_url: string
) : MatrixHomeServerDTO {
    return {
        base_url
    };
}

export function isMatrixHomeServerDTO (value: any): value is MatrixHomeServerDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, ['base_url'])
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



