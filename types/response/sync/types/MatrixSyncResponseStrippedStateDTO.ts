// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    isMatrixEventContentDTO,
    MatrixEventContentDTO
} from "../../../core/MatrixEventContentDTO";
import { hasNoOtherKeys, isRegularObject, isString } from "../../../../../ts/modules/lodash";

export interface MatrixSyncResponseStrippedStateDTO {
    readonly content   : MatrixEventContentDTO;
    readonly state_key : string;
    readonly type      : string;
    readonly sender    : string;
}

export function isMatrixSyncResponseStrippedStateDTO (value: any): value is MatrixSyncResponseStrippedStateDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'content',
            'state_key',
            'type',
            'sender'
        ])
        && isMatrixEventContentDTO(value?.content)
        && isString(value?.state_key)
        && isString(value?.type)
        && isString(value?.sender)
    );
}

export function stringifyMatrixSyncResponseStrippedStateDTO (value: MatrixSyncResponseStrippedStateDTO): string {
    return `MatrixSyncResponseStrippedStateDTO(${value})`;
}

export function parseMatrixSyncResponseStrippedStateDTO (value: any): MatrixSyncResponseStrippedStateDTO | undefined {
    if ( isMatrixSyncResponseStrippedStateDTO(value) ) return value;
    return undefined;
}

export default MatrixSyncResponseStrippedStateDTO;
