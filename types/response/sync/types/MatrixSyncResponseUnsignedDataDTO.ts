// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeys,
    isInteger,
    isRegularObject,
    isString,
    isUndefined
} from "../../../../../ts/modules/lodash";
import MatrixSyncResponseEventDTO, { isMatrixSyncResponseEventDTO } from "./MatrixSyncResponseEventDTO";

export interface MatrixSyncResponseUnsignedDataDTO {
    readonly age               : number;
    readonly redacted_because ?: MatrixSyncResponseEventDTO;
    readonly transaction_id    : string;
}

export function isMatrixSyncResponseUnsignedDataDTO (value: any): value is MatrixSyncResponseUnsignedDataDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'age',
            'redacted_because',
            'transaction_id'
        ])
        && isInteger(value?.age)
        && ( isUndefined(value?.redacted_because) || isMatrixSyncResponseEventDTO(value?.redacted_because) )
        && isString(value?.transaction_id)
    );
}

export function stringifyMatrixSyncResponseUnsignedDataDTO (value: MatrixSyncResponseUnsignedDataDTO): string {
    return `MatrixSyncResponseUnsignedData(${value})`;
}

export function parseMatrixSyncResponseUnsignedDataDTO (value: any): MatrixSyncResponseUnsignedDataDTO | undefined {
    if ( isMatrixSyncResponseUnsignedDataDTO(value) ) return value;
    return undefined;
}

export default MatrixSyncResponseUnsignedDataDTO;
