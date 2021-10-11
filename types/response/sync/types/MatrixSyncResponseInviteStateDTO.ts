// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import MatrixSyncResponseStrippedStateDTO, {
    explainMatrixSyncResponseStrippedStateDTO,
    isMatrixSyncResponseStrippedStateDTO
} from "./MatrixSyncResponseStrippedStateDTO";
import {
    find,
    hasNoOtherKeys,
    isArrayOf,
    isRegularObject,
    keys
} from "../../../../../ts/modules/lodash";

export interface MatrixSyncResponseInviteStateDTO {
    readonly events: MatrixSyncResponseStrippedStateDTO[];
}

export function getEventsFromMatrixSyncResponseInviteStateDTO (
    value: MatrixSyncResponseInviteStateDTO
) : MatrixSyncResponseStrippedStateDTO[] {
    return value?.events ?? [];
}

export function isMatrixSyncResponseInviteStateDTO (value: any): value is MatrixSyncResponseInviteStateDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'events'
        ])
        && isArrayOf(value?.events, isMatrixSyncResponseStrippedStateDTO)
    );
}

export function assertMatrixSyncResponseInviteStateDTO (value: any): void {
    if(!( isRegularObject(value) )) {
        throw new TypeError(`value invalid: ${value}`);
    }
    if(!( hasNoOtherKeys(value, [
            'events'
        ]) )) {
        throw new TypeError(`value has extra keys: all keys: ${keys(value)}`);
    }
    if(!( isArrayOf(value?.events, isMatrixSyncResponseStrippedStateDTO) )) {
        const item = find(value?.events, event => !isMatrixSyncResponseStrippedStateDTO(event));
        throw new TypeError(`Property "events" had invalid item: ${explainMatrixSyncResponseStrippedStateDTO(item)}`);
    }
}

export function explainMatrixSyncResponseInviteStateDTO (value : any) : string {
    try {
        assertMatrixSyncResponseInviteStateDTO(value);
        return 'No errors detected';
    } catch (err : any) {
        return err?.message;
    }
}

export function stringifyMatrixSyncResponseInviteStateDTO (value: MatrixSyncResponseInviteStateDTO): string {
    return `MatrixSyncResponseInviteStateDTO(${value})`;
}

export function parseMatrixSyncResponseInviteStateDTO (value: any): MatrixSyncResponseInviteStateDTO | undefined {
    if ( isMatrixSyncResponseInviteStateDTO(value) ) return value;
    return undefined;
}

export default MatrixSyncResponseInviteStateDTO;
