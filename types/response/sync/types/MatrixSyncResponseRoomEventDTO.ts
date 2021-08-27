// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { isJsonObject, JsonObject } from "../../../../../ts/Json";
import MatrixSyncResponseUnsignedDataDTO, {
    explainMatrixSyncResponseUnsignedDataDTO,
    isMatrixSyncResponseUnsignedDataDTO
} from "./MatrixSyncResponseUnsignedDataDTO";
import {
    hasNoOtherKeys,
    isInteger,
    isRegularObject,
    isString, isStringOrUndefined, isUndefined, keys
} from "../../../../../ts/modules/lodash";
import MatrixUserId, { isMatrixUserId } from "../../../core/MatrixUserId";

export interface MatrixSyncResponseRoomEventDTO {
    readonly content           : JsonObject;
    readonly type              : string;
    readonly event_id          : string;
    readonly sender            : MatrixUserId;
    readonly origin_server_ts  : number;
    readonly unsigned         ?: MatrixSyncResponseUnsignedDataDTO;
    readonly state_key        ?: string;
}

export function isMatrixSyncResponseRoomEventDTO (value: any): value is MatrixSyncResponseRoomEventDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'content',
            'type',
            'event_id',
            'sender',
            'origin_server_ts',
            'unsigned',
            'state_key'
        ])
        && isJsonObject(value?.content)
        && isString(value?.type)
        && isString(value?.event_id)
        && isMatrixUserId(value?.sender)
        && isInteger(value?.origin_server_ts)
        && (isUndefined(value?.unsigned) || isMatrixSyncResponseUnsignedDataDTO(value?.unsigned))
        && isStringOrUndefined(value?.state_key)
    );
}

export function assertMatrixSyncResponseRoomEventDTO (value: any): void {

    if (!( isRegularObject(value) )) {
        throw new TypeError(`value was not regular object`);
    }

    if (!( hasNoOtherKeys(value, [
        'content',
        'type',
        'event_id',
        'sender',
        'origin_server_ts',
        'unsigned',
        'state_key'
    ]))) {
        throw new TypeError(`Had extra properties: All keys: ${keys(value)}`);
    }

    if (!( isJsonObject(value?.content) )) {
        throw new TypeError(`Property "content" was not correct: ${value?.content}`);
    }

    if (!( isString(value?.type))) {
        throw new TypeError(`Property "type" was not correct: ${value?.type}`);
    }

    if (!( isString(value?.event_id))) {
        throw new TypeError(`Property "event_id" was not correct: ${value?.event_id}`);
    }

    if (!( isMatrixUserId(value?.sender))) {
        throw new TypeError(`Property "sender" was not correct: ${value?.sender}`);
    }

    if (!( isInteger(value?.origin_server_ts))) {
        throw new TypeError(`Property "origin_server_ts" was not correct: ${value?.origin_server_ts}`);
    }

    if (!( (isUndefined(value?.unsigned) || isMatrixSyncResponseUnsignedDataDTO(value?.unsigned)))) {
        throw new TypeError(`Property "unsigned" was not correct: ${explainMatrixSyncResponseUnsignedDataDTO(value?.unsigned)}`);
    }

    if (!( isStringOrUndefined(value?.state_key) )) {
        throw new TypeError(`Property "state_key" was not correct: ${value?.state_key}`);
    }

}

export function explainMatrixSyncResponseRoomEventDTO (value : any) : string {
    try {
        assertMatrixSyncResponseRoomEventDTO(value);
        return 'No errors detected';
    } catch (err) {
        return err.message;
    }
}

export function stringifyMatrixSyncResponseRoomEventDTO (value: MatrixSyncResponseRoomEventDTO): string {
    return `MatrixSyncResponseRoomEventDTO(${value})`;
}

export function parseMatrixSyncResponseRoomEventDTO (value: any): MatrixSyncResponseRoomEventDTO | undefined {
    if ( isMatrixSyncResponseRoomEventDTO(value) ) return value;
    return undefined;
}

export default MatrixSyncResponseRoomEventDTO;
