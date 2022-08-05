// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { MatrixSyncResponseStrippedStateDTO,
    explainMatrixSyncResponseStrippedStateDTO,
    isMatrixSyncResponseStrippedStateDTO
} from "./MatrixSyncResponseStrippedStateDTO";
import {
    find,
    hasNoOtherKeysInDevelopment,
    isArrayOf,
    isRegularObject,
    keys
} from "../../../../../core/modules/lodash";

export interface MatrixSyncResponseInviteStateDTO {
    readonly events: readonly MatrixSyncResponseStrippedStateDTO[];
}

export function getEventsFromMatrixSyncResponseInviteStateDTO (
    value: MatrixSyncResponseInviteStateDTO
) : readonly MatrixSyncResponseStrippedStateDTO[] {
    return value?.events ?? [];
}

export function isMatrixSyncResponseInviteStateDTO (value: any): value is MatrixSyncResponseInviteStateDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'events'
        ])
        && isArrayOf(value?.events, isMatrixSyncResponseStrippedStateDTO)
    );
}

export function assertMatrixSyncResponseInviteStateDTO (value: any): void {
    if(!( isRegularObject(value) )) {
        throw new TypeError(`value invalid: ${value}`);
    }
    if(!( hasNoOtherKeysInDevelopment(value, [
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


