// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { isString, isStringOrUndefined } from "../../../../../core/types/String";
import { isRegularObject } from "../../../../../core/types/RegularObject";
import { hasNoOtherKeysInDevelopment } from "../../../../../core/types/OtherKeys";

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


