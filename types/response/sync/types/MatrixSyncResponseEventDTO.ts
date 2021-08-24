// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { isJsonObject, JsonObject } from "../../../../../ts/Json";
import { hasNoOtherKeys, isRegularObject, isString } from "../../../../../ts/modules/lodash";

export interface MatrixSyncResponseEventDTO {
    readonly content : JsonObject;
    readonly type    : string;
    readonly sender  : string;
}

export function isMatrixSyncResponseEventDTO (value: any): value is MatrixSyncResponseEventDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'content',
            'type'
        ])
        && isJsonObject(value?.content)
        && isString(value?.type)
        && isString(value?.sender)
    );
}

export function stringifyMatrixSyncResponseEventDTO (value: MatrixSyncResponseEventDTO): string {
    return `MatrixSyncResponseEventDTO(${value})`;
}

export function parseMatrixSyncResponseEventDTO (value: any): MatrixSyncResponseEventDTO | undefined {
    if ( isMatrixSyncResponseEventDTO(value) ) return value;
    return undefined;
}

export default MatrixSyncResponseEventDTO;
