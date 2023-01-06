// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    explainJsonObject,
    isReadonlyJsonObject,
    ReadonlyJsonObject
} from "../../../core/Json";
import { MatrixStateEventOf } from "./MatrixStateEventOf";
import { MatrixType } from "./MatrixType";
import { explain, explainProperty } from "../../../core/types/explain";
import { explainString, explainStringOrUndefined, isString, isStringOrUndefined } from "../../../core/types/String";
import { explainRegularObject, isRegularObject } from "../../../core/types/RegularObject";
import { explainNoOtherKeys, hasNoOtherKeysInDevelopment } from "../../../core/types/OtherKeys";

export type MatrixStateEvent = MatrixStateEventOf<ReadonlyJsonObject>;

export function createMatrixStateEvent (
    type      : MatrixType | string,
    state_key : string,
    content   : ReadonlyJsonObject
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
        && isReadonlyJsonObject(value?.content)
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


