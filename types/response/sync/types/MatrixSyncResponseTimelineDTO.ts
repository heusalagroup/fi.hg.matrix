// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import MatrixSyncResponseRoomEventDTO, { isMatrixSyncResponseRoomEventDTO } from "./MatrixSyncResponseRoomEventDTO";
import {
    hasNoOtherKeys,
    isArrayOf,
    isBoolean,
    isRegularObject,
    isString
} from "../../../../../ts/modules/lodash";

export interface MatrixSyncResponseTimelineDTO {
    readonly events     : MatrixSyncResponseRoomEventDTO[];
    readonly limited    : boolean;
    readonly prev_batch : string;
}

export function isMatrixSyncResponseTimelineDTO (value: any): value is MatrixSyncResponseTimelineDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'events',
            'limited',
            'prev_batch'
        ])
        && isArrayOf(value?.events, isMatrixSyncResponseRoomEventDTO)
        && isBoolean(value?.limited)
        && isString(value?.prev_batch)
    );
}

export function stringifyMatrixSyncResponseTimelineDTO (value: MatrixSyncResponseTimelineDTO): string {
    return `MatrixSyncResponseTimelineDTO(${value})`;
}

export function parseMatrixSyncResponseTimelineDTO (value: any): MatrixSyncResponseTimelineDTO | undefined {
    if ( isMatrixSyncResponseTimelineDTO(value) ) return value;
    return undefined;
}

export default MatrixSyncResponseTimelineDTO;
