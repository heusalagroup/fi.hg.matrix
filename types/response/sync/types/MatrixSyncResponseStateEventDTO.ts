// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import MatrixSyncResponseUnsignedDataDTO, { isMatrixSyncResponseUnsignedDataDTO } from "./MatrixSyncResponseUnsignedDataDTO";
import { isJsonObject, JsonObject } from "../../../../../ts/Json";
import {
    hasNoOtherKeys,
    isInteger,
    isRegularObject,
    isString,
    isUndefined
} from "../../../../../ts/modules/lodash";

export interface MatrixSyncResponseStateEventDTO {
    readonly content           : JsonObject;
    readonly type              : string;
    readonly event_id          : string;
    readonly sender            : string;
    readonly origin_server_ts  : number;
    readonly unsigned         ?: MatrixSyncResponseUnsignedDataDTO;
    readonly prev_content     ?: JsonObject;
    readonly state_key         : string;
}

export function isMatrixSyncResponseStateEventDTO (value: any): value is MatrixSyncResponseStateEventDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'content',
            'type',
            'event_id',
            'sender',
            'origin_server_ts',
            'unsigned',
            'prev_content',
            'state_key'
        ])
        && isJsonObject(value?.content)
        && isString(value?.type)
        && isString(value?.event_id)
        && isString(value?.sender)
        && isInteger(value?.origin_server_ts)
        && (isUndefined(value?.unsigned) || isMatrixSyncResponseUnsignedDataDTO(value?.unsigned))
        && (isUndefined(value?.unsigned) || isJsonObject(value?.prev_content))
        && isString(value?.state_key)
    );
}

export function stringifyMatrixSyncResponseStateEventDTO (value: MatrixSyncResponseStateEventDTO): string {
    return `MatrixSyncResponseStateEventDTO(${value})`;
}

export function parseMatrixSyncResponseStateEventDTO (value: any): MatrixSyncResponseStateEventDTO | undefined {
    if ( isMatrixSyncResponseStateEventDTO(value) ) return value;
    return undefined;
}

export default MatrixSyncResponseStateEventDTO;
