// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { MatrixSyncResponseRoomEventDTO,
    explainMatrixSyncResponseRoomEventDTO,
    isMatrixSyncResponseRoomEventDTO
} from "./MatrixSyncResponseRoomEventDTO";
import {
    concat,
    find,
    hasNoOtherKeysInDevelopment,
    isArrayOf,
    isBoolean,
    isRegularObject,
    isString,
    keys
} from "../../../../../core/modules/lodash";

export interface MatrixSyncResponseTimelineDTO {
    readonly events     : readonly MatrixSyncResponseRoomEventDTO[];
    readonly limited    : boolean;
    readonly prev_batch : string;
}

export function getEventsFromMatrixSyncResponseTimelineDTO (
    value: MatrixSyncResponseTimelineDTO
) : readonly MatrixSyncResponseRoomEventDTO[] {
    return concat([], value?.events ?? []);
}

export function isMatrixSyncResponseTimelineDTO (value: any): value is MatrixSyncResponseTimelineDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'events',
            'limited',
            'prev_batch'
        ])
        && isArrayOf(value?.events, isMatrixSyncResponseRoomEventDTO)
        && isBoolean(value?.limited)
        && isString(value?.prev_batch)
    );
}

export function assertMatrixSyncResponseTimelineDTO (value: any): void {

    if(!( isRegularObject(value) )) {
        throw new TypeError(`value not object: ${value}`);
    }

    if(!( hasNoOtherKeysInDevelopment(value, [
        'events',
        'limited',
        'prev_batch'
    ]))) {
        throw new TypeError(`Extra properties in value: all keys: ${keys(value)}`);
    }

    if(!( isArrayOf(value?.events, isMatrixSyncResponseRoomEventDTO))) {
        const event = find(value?.events, item => !isMatrixSyncResponseRoomEventDTO(item));
        throw new TypeError(`Property "events" item was not correct: ${explainMatrixSyncResponseRoomEventDTO(event)}`);
    }

    if(!( isBoolean(value?.limited))) {
        throw new TypeError(`Property "limited" was not boolean: ${value?.limited}`);
    }

    if(!( isString(value?.prev_batch))) {
        throw new TypeError(`Property "prev_batch" was not string: ${value?.prev_batch}`);
    }

}

export function explainMatrixSyncResponseTimelineDTO (value : any) : string {
    try {
        assertMatrixSyncResponseTimelineDTO(value);
        return 'No errors detected';
    } catch (err : any) {
        return err?.message;
    }
}

export function stringifyMatrixSyncResponseTimelineDTO (value: MatrixSyncResponseTimelineDTO): string {
    return `MatrixSyncResponseTimelineDTO(${value})`;
}

export function parseMatrixSyncResponseTimelineDTO (value: any): MatrixSyncResponseTimelineDTO | undefined {
    if ( isMatrixSyncResponseTimelineDTO(value) ) return value;
    return undefined;
}


