// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeysInDevelopment,
    isRegularObject,
    isStringOrUndefined,
    TestCallbackNonStandardOf
} from "../../../core/modules/lodash";
import { isMatrixType, MatrixType } from "./MatrixType";
import { ReadonlyJsonObject } from "../../../core/Json";

export interface MatrixStateEventOf<T extends ReadonlyJsonObject> {
    readonly type       : MatrixType | string;
    readonly state_key ?: string;
    readonly content    : T;
}

export function isMatrixStateEventOf<T extends ReadonlyJsonObject> (
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

