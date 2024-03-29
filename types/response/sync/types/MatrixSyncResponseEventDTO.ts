// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { isJsonObject, JsonObject } from "../../../../../core/Json";
import { MatrixType,  isMatrixType } from "../../../core/MatrixType";
import { MatrixUserId,  isMatrixUserId } from "../../../core/MatrixUserId";
import { isUndefined } from "../../../../../core/types/undefined";
import { isRegularObject } from "../../../../../core/types/RegularObject";
import { hasNoOtherKeysInDevelopment } from "../../../../../core/types/OtherKeys";

export interface MatrixSyncResponseEventDTO {
    readonly content  : JsonObject;
    readonly type     : MatrixType;
    readonly sender  ?: MatrixUserId;
}

export function isMatrixSyncResponseEventDTO (value: any): value is MatrixSyncResponseEventDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'content',
            'type',
            'sender'
        ])
        && isJsonObject(value?.content)
        && isMatrixType(value?.type)
        && (isUndefined(value?.sender) || isMatrixUserId(value?.sender))
    );
}

export function stringifyMatrixSyncResponseEventDTO (value: MatrixSyncResponseEventDTO): string {
    return `MatrixSyncResponseEventDTO(${value})`;
}

export function parseMatrixSyncResponseEventDTO (value: any): MatrixSyncResponseEventDTO | undefined {
    if ( isMatrixSyncResponseEventDTO(value) ) return value;
    return undefined;
}


