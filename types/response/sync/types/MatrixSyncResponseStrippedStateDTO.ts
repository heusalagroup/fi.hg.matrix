// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeysInDevelopment,
    isNumberOrUndefined,
    isRegularObject,
    isString,
    isStringOrUndefined,
    isUndefined,
    keys
} from "../../../../../core/modules/lodash";
import { MatrixSyncResponseUnsignedDataDTO,  isMatrixSyncResponseUnsignedDataDTO } from "./MatrixSyncResponseUnsignedDataDTO";
import { isJsonObject, JsonObject } from "../../../../../core/Json";

export interface MatrixSyncResponseStrippedStateDTO {
    readonly content           : JsonObject;
    readonly state_key         : string;
    readonly type              : string;
    readonly sender            : string;
    readonly origin_server_ts ?: number;
    readonly unsigned         ?: MatrixSyncResponseUnsignedDataDTO;
    readonly event_id         ?: string;
}

export function isMatrixSyncResponseStrippedStateDTO (value: any): value is MatrixSyncResponseStrippedStateDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'content',
            'state_key',
            'type',
            'sender',
            'origin_server_ts',
            'unsigned',
            'event_id'
        ])
        && isJsonObject(value?.content)
        && isString(value?.state_key)
        && isString(value?.type)
        && isString(value?.sender)
        && isNumberOrUndefined(value?.origin_server_ts)
        && ( isUndefined(value?.unsigned) || isMatrixSyncResponseUnsignedDataDTO(value?.unsigned) )
        && isStringOrUndefined(value?.event_id)
    );
}

export function assertMatrixSyncResponseStrippedStateDTO (value: any): void {
    if(!( isRegularObject(value) )) {
        throw new TypeError(`invalid: ${value}`);
    }
    if(!( hasNoOtherKeysInDevelopment(value, [
            'content',
            'state_key',
            'type',
            'sender',
            'origin_server_ts',
            'unsigned',
            'event_id'
        ]) )) {
        throw new TypeError(`one key is extra: ${keys(value)}`);
    }
    if(!( isJsonObject(value?.content) )) {
        throw new TypeError(`Property "content" invalid: ${value?.content}`);
    }
    if(!( isString(value?.state_key) )) {
        throw new TypeError(`Property "state_key" invalid: ${value?.state_key}`);
    }
    if(!( isString(value?.type) )) {
        throw new TypeError(`Property "type" invalid: ${value?.type}`);
    }
    if(!( isString(value?.sender) )) {
        throw new TypeError(`Property "sender" invalid: ${value?.sender}`);
    }
    if(!( isNumberOrUndefined(value?.origin_server_ts) )) {
        throw new TypeError(`Property "origin_server_ts" invalid: ${value?.origin_server_ts}`);
    }
    if(!( ( isUndefined(value?.unsigned) || isMatrixSyncResponseUnsignedDataDTO(value?.unsigned) ) )) {
        throw new TypeError(`Property "unsigned" invalid: ${value?.unsigned}`);
    }
    if(!( isStringOrUndefined(value?.event_id) )) {
        throw new TypeError(`Property "event_id" invalid: ${value?.event_id}`);
    }

}

export function explainMatrixSyncResponseStrippedStateDTO (value : any) : string {
    try {
        assertMatrixSyncResponseStrippedStateDTO(value);
        return 'No errors detected';
    } catch (err : any) {
        return err?.message;
    }
}

export function stringifyMatrixSyncResponseStrippedStateDTO (value: MatrixSyncResponseStrippedStateDTO): string {
    return `MatrixSyncResponseStrippedStateDTO(${value})`;
}

export function parseMatrixSyncResponseStrippedStateDTO (value: any): MatrixSyncResponseStrippedStateDTO | undefined {
    if ( isMatrixSyncResponseStrippedStateDTO(value) ) return value;
    return undefined;
}


