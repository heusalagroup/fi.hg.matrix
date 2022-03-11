// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeys,
    isRegularObject,
    isString,
    isStringOrUndefined
} from "../../../core/modules/lodash";
import { JsonObject } from "../../../core/Json";

export interface MatrixStateEvent {
    readonly type       : string;
    readonly state_key ?: string;
    readonly content    : JsonObject;
}

export function isMatrixStateEvent (value: any): value is MatrixStateEvent {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'type',
            'state_key',
            'content'
        ])
        && isString(value?.type)
        && isStringOrUndefined(value?.state_key)
        && isString(value?.content)
    );
}

export function stringifyMatrixStateEvent (value: MatrixStateEvent): string {
    return `MatrixStateEvent(${value})`;
}

export function parseMatrixStateEvent (value: any): MatrixStateEvent | undefined {
    if ( isMatrixStateEvent(value) ) return value;
    return undefined;
}


