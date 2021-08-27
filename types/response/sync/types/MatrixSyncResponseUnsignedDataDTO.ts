// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeys,
    isInteger,
    isRegularObject,
    isStringOrUndefined,
    isUndefined, keys
} from "../../../../../ts/modules/lodash";
import MatrixSyncResponseEventDTO, { isMatrixSyncResponseEventDTO } from "./MatrixSyncResponseEventDTO";
import { isJsonObjectOrUndefined, JsonObject } from "../../../../../ts/Json";
import MatrixUserId, { isMatrixUserId } from "../../../core/MatrixUserId";

/**
 *
 * Note! The property "redacted_because" is defined as a string in room specs, but object in
 * ClientServer-API.
 *
 * @see https://matrix.org/docs/spec/client_server/latest#get-matrix-client-r0-sync
 * @see https://spec.matrix.org/unstable/rooms/v1/
 * @see https://spec.matrix.org/unstable/rooms/v3/
 * @see https://spec.matrix.org/unstable/rooms/v4/
 */
export interface MatrixSyncResponseUnsignedDataDTO {

    readonly age               : number;
    readonly prev_content     ?: JsonObject;
    readonly prev_sender      ?: MatrixUserId;
    readonly redacted_because ?: MatrixSyncResponseEventDTO;
    readonly replaces_state   ?: string;
    readonly transaction_id   ?: string;

}

export function isMatrixSyncResponseUnsignedDataDTO (value: any): value is MatrixSyncResponseUnsignedDataDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'age',
            'prev_content',
            'prev_sender',
            'redacted_because',
            'replaces_state',
            'transaction_id'
        ])
        && isInteger(value?.age)
        && isJsonObjectOrUndefined(value?.prev_content)
        && ( isUndefined(value?.prev_sender) || isMatrixUserId(value?.prev_sender) )
        && ( isUndefined(value?.redacted_because) || isMatrixSyncResponseEventDTO(value?.redacted_because) )
        && isStringOrUndefined(value?.replaces_state)
        && isStringOrUndefined(value?.transaction_id)
    );
}

export function assertMatrixSyncResponseUnsignedDataDTO (value: any) : void {

    if(!( isRegularObject(value) )) {
        throw new TypeError(`Value was not regular object`);
    }

    if(!( hasNoOtherKeys(value, [
        'age',
        'prev_content',
        'prev_sender',
        'redacted_because',
        'replaces_state',
        'transaction_id'
    ]) )) {
        throw new TypeError(`Value had extra properties: All keys: ${keys(value)}`);
    }

    if(!( isInteger(value?.age) )) {
        throw new TypeError(`Property "age" was not valid: ${value?.age}`);
    }

    if(!( isJsonObjectOrUndefined(value?.prev_content) )) {
        throw new TypeError(`Property "prev_content" was not valid: ${value?.prev_content}`);
    }

    if(!( isUndefined(value?.prev_sender) || isMatrixUserId(value?.prev_sender) )) {
        throw new TypeError(`Property "prev_sender" was not valid: ${value?.prev_sender}`);
    }

    if(!( ( isUndefined(value?.redacted_because) || isMatrixSyncResponseEventDTO(value?.redacted_because) ) )) {
        throw new TypeError(`Property "redacted_because" was not valid: ${value?.redacted_because}`);
    }

    if(!( isStringOrUndefined(value?.replaces_state) )) {
        throw new TypeError(`Property "replaces_state" was not valid: ${value?.replaces_state}`);
    }

    if(!( isStringOrUndefined(value?.transaction_id) )) {
        throw new TypeError(`Property "transaction_id" was not valid: ${value?.transaction_id}`);
    }

}

export function explainMatrixSyncResponseUnsignedDataDTO (value: any) : string {
    try {
        assertMatrixSyncResponseUnsignedDataDTO(value);
        return 'No errors detected';
    } catch (err) {
        return err.message;
    }
}

export function stringifyMatrixSyncResponseUnsignedDataDTO (value: MatrixSyncResponseUnsignedDataDTO): string {
    return `MatrixSyncResponseUnsignedData(${value})`;
}

export function parseMatrixSyncResponseUnsignedDataDTO (value: any): MatrixSyncResponseUnsignedDataDTO | undefined {
    if ( isMatrixSyncResponseUnsignedDataDTO(value) ) return value;
    return undefined;
}

export default MatrixSyncResponseUnsignedDataDTO;
