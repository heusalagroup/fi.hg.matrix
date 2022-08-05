// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeysInDevelopment,
    isRegularObject,
    isStringOrUndefined,
    TestCallbackNonStandardOf
} from "../../../core/modules/lodash";
import { isMatrixType, MatrixType } from "./MatrixType";

export interface MatrixStateEventOf<T> {
    readonly type       : MatrixType | string;
    readonly state_key ?: string;
    readonly content    : T;
}

export function isMatrixStateEventOf<T> (
    value     : any,
    isContent : TestCallbackNonStandardOf<T>
): value is MatrixStateEventOf<T> {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'type',
            'state_key',
            'content'
        ])
        && isMatrixType(value?.type)
        && isStringOrUndefined(value?.state_key)
        && isContent(value?.content)
    );
}

