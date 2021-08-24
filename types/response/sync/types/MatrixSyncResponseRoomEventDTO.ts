// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { isJsonObject, JsonObject } from "../../../../../ts/Json";
import MatrixSyncResponseUnsignedDataDTO, { isMatrixSyncResponseUnsignedDataDTO } from "./MatrixSyncResponseUnsignedDataDTO";
import {
    hasNoOtherKeys,
    isInteger,
    isRegularObject,
    isString, isUndefined
} from "../../../../../ts/modules/lodash";

export interface MatrixSyncResponseRoomEventDTO {
    readonly content           : JsonObject;
    readonly type              : string;
    readonly event_id          : string;
    readonly sender            : string;
    readonly origin_server_ts  : number;
    readonly unsigned         ?: MatrixSyncResponseUnsignedDataDTO;
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
            'unsigned'
        ])
        && isJsonObject(value?.content)
        && isString(value?.type)
        && isString(value?.event_id)
        && isString(value?.sender)
        && isInteger(value?.origin_server_ts)
        && (isUndefined(value?.unsigned) || isMatrixSyncResponseUnsignedDataDTO(value?.unsigned))
    );
}

export function stringifyMatrixSyncResponseRoomEventDTO (value: MatrixSyncResponseRoomEventDTO): string {
    return `MatrixSyncResponseRoomEventDTO(${value})`;
}

export function parseMatrixSyncResponseRoomEventDTO (value: any): MatrixSyncResponseRoomEventDTO | undefined {
    if ( isMatrixSyncResponseRoomEventDTO(value) ) return value;
    return undefined;
}

export default MatrixSyncResponseRoomEventDTO;
