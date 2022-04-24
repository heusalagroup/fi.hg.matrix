// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { MatrixSyncResponseUnsignedDataDTO,
    isMatrixSyncResponseUnsignedDataDTO
} from "./MatrixSyncResponseUnsignedDataDTO";

import {
    isJsonObject,
    JsonObject
} from "../../../../../core/Json";

import {
    hasNoOtherKeysInDevelopment,
    isInteger,
    isRegularObject,
    isString,
    isUndefined,
    keys
} from "../../../../../core/modules/lodash";

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
        && hasNoOtherKeysInDevelopment(value, [
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
        && (isUndefined(value?.prev_content) || isJsonObject(value?.prev_content))
        && isString(value?.state_key)
    );
}

export function assertMatrixSyncResponseStateEventDTO (value: any) : void {

    if(!( isRegularObject(value) )) {
        throw new TypeError(`value was not regular object`);
    }

    if(!( hasNoOtherKeysInDevelopment(value, [
        'content',
        'type',
        'event_id',
        'sender',
        'origin_server_ts',
        'unsigned',
        'prev_content',
        'state_key'
    ]) )) {
        throw new TypeError(`value had extra keys: all keys: ${keys(value)}`);
    }

    if(!( isJsonObject(value?.content) )) {
        throw new TypeError(`Property "content" not JsonObject: ${value?.content}`);
    }

    if(!( isString(value?.type) )) {
        throw new TypeError(`Property "type" not valid: ${value?.type}`);
    }

    if(!( isString(value?.event_id) )) {
        throw new TypeError(`Property "event_id" not valid: ${value?.event_id}`);
    }

    if(!( isString(value?.sender) )) {
        throw new TypeError(`Property "sender" not valid: ${value?.sender}`);
    }

    if(!( isInteger(value?.origin_server_ts) )) {
        throw new TypeError(`Property "origin_server_ts" not valid: ${value?.origin_server_ts}`);
    }

    if(!( (isUndefined(value?.unsigned) || isMatrixSyncResponseUnsignedDataDTO(value?.unsigned)) )) {
        throw new TypeError(`Property "unsigned" not valid: ${value?.unsigned}`);
    }

    if(!( (isUndefined(value?.prev_content) || isJsonObject(value?.prev_content)) )) {
        throw new TypeError(`Property "prev_content" not valid: ${value?.prev_content}`);
    }

    if(!( isString(value?.state_key) )) {
        throw new TypeError(`Property "state_key" not valid: ${value?.state_key}`);
    }

}

export function explainMatrixSyncResponseStateEventDTO (value: any) : string {
    try {
        assertMatrixSyncResponseStateEventDTO(value);
        return 'No errors detected';
    } catch (err: any) {
        return err?.message;
    }
}

export function stringifyMatrixSyncResponseStateEventDTO (value: MatrixSyncResponseStateEventDTO): string {
    return `MatrixSyncResponseStateEventDTO(${value})`;
}

export function parseMatrixSyncResponseStateEventDTO (value: any): MatrixSyncResponseStateEventDTO | undefined {
    if ( isMatrixSyncResponseStateEventDTO(value) ) return value;
    return undefined;
}


