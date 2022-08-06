// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    explain,
    explainNoOtherKeys,
    explainProperty,
    explainRegularObject,
    explainString,
    explainStringOrUndefined,
    hasNoOtherKeysInDevelopment,
    isRegularObject,
    isString,
    isStringOrUndefined
} from "../../../core/modules/lodash";
import { explainJsonObject, isJsonObject, JsonObject } from "../../../core/Json";
import { MatrixStateEventOf } from "./MatrixStateEventOf";
import { MatrixType } from "./MatrixType";

export interface MatrixStateEvent extends MatrixStateEventOf<JsonObject> {
    readonly type       : MatrixType | string;
    readonly state_key ?: string;
    readonly content    : JsonObject;
}

export function createMatrixStateEvent (
    type      : MatrixType | string,
    state_key : string,
    content   : JsonObject
) : MatrixStateEvent {
    return {
        type,
        state_key,
        content
    };
}

export function isMatrixStateEvent (value: any): value is MatrixStateEvent {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'type',
            'state_key',
            'content'
        ])
        && isString(value?.type)
        && isStringOrUndefined(value?.state_key)
        && isJsonObject(value?.content)
    );
}

export function explainMatrixStateEvent (value : any) : string {
    return explain(
        [
            explainRegularObject(value),
            explainNoOtherKeys(value, [
                'type',
                'state_key',
                'content'
            ]),
            explainProperty("type", explainString(value?.type)),
            explainProperty("state_key", explainStringOrUndefined(value?.state_key)),
            explainProperty("content", explainJsonObject(value?.content))
        ]
    )
}

export function stringifyMatrixStateEvent (value: MatrixStateEvent): string {
    return `MatrixStateEvent(${value})`;
}

export function parseMatrixStateEvent (value: any): MatrixStateEvent | undefined {
    if ( isMatrixStateEvent(value) ) return value;
    return undefined;
}


