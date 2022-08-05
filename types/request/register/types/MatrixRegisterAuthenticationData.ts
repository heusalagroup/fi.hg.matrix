// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeysInDevelopment,
    isRegularObject,
    isString,
    isStringOrUndefined
} from "../../../../../core/modules/lodash";

export interface MatrixRegisterAuthenticationData {
    readonly type     : string;
    readonly session ?: string;
}

export function isMatrixRegisterAuthenticationData (value: any): value is MatrixRegisterAuthenticationData {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'type',
            'session'
        ])
        && isString(value?.type)
        && isStringOrUndefined(value?.session)
    );
}

export function stringifyMatrixRegisterAuthenticationData (value: MatrixRegisterAuthenticationData): string {
    return `MatrixRegisterAuthenticationData(${value})`;
}

export function parseMatrixRegisterAuthenticationData (value: any): MatrixRegisterAuthenticationData | undefined {
    if ( isMatrixRegisterAuthenticationData(value) ) return value;
    return undefined;
}


