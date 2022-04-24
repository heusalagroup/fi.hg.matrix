// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeys,
    isRegularObject,
    isStringOrUndefined,
    TestCallbackNonStandardOf
} from "../../../core/modules/lodash";
import { isMatrixType, MatrixType } from "./MatrixType";

export interface MatrixStateEventOf<T> {
    readonly type       : MatrixType;
    readonly state_key ?: string;
    readonly content    : T;
}

export function isMatrixStateEventOf<T> (
    value     : any,
    isContent : TestCallbackNonStandardOf<T>
): value is MatrixStateEventOf<T> {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'type',
            'state_key',
            'content'
        ])
        && isMatrixType(value?.type)
        && isStringOrUndefined(value?.state_key)
        && isContent(value?.content)
    );
}

