// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    concat,
    find,
    hasNoOtherKeys,
    isArrayOf,
    isRegularObject
} from "../../../../../core/modules/lodash";

import { MatrixSyncResponseStateEventDTO, 
    explainMatrixSyncResponseStateEventDTO,
    isMatrixSyncResponseStateEventDTO
} from "./MatrixSyncResponseStateEventDTO";

export interface MatrixSyncResponseStateDTO {
    readonly events : MatrixSyncResponseStateEventDTO[];
}

export function getEventsFromMatrixSyncResponseStateDTO (
    value: MatrixSyncResponseStateDTO
) : readonly MatrixSyncResponseStateEventDTO[] {
    return concat([], value?.events ?? []);
}

export function isMatrixSyncResponseStateDTO (value: any): value is MatrixSyncResponseStateDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'events'
        ])
        && isArrayOf<MatrixSyncResponseStateEventDTO>(value?.events, isMatrixSyncResponseStateEventDTO)
    );
}

export function assertMatrixSyncResponseStateDTO (value: any): void {

    if(!( isRegularObject(value) )) {
        throw new TypeError(`value was not object`);
    }

    if(!( hasNoOtherKeys(value, [
            'events'
        ]))) {
        throw new TypeError(`value had extra keys`);
    }

    if(!( isArrayOf<MatrixSyncResponseStateEventDTO>(value?.events, isMatrixSyncResponseStateEventDTO) )) {
        const item = find(value?.events, item => !isMatrixSyncResponseStateEventDTO(item));
        throw new TypeError(`Not array of MatrixSyncResponseStateEventDTO: ${explainMatrixSyncResponseStateEventDTO(item)}`);
    }

}

export function explainMatrixSyncResponseStateDTO (value : any) : string {
    try {
        assertMatrixSyncResponseStateDTO(value);
        return 'No errors detected';
    } catch (err : any) {
        return err?.message;
    }
}

export function stringifyMatrixSyncResponseStateDTO (value: MatrixSyncResponseStateDTO): string {
    return `MatrixSyncResponseStateDTO(${value})`;
}

export function parseMatrixSyncResponseStateDTO (value: any): MatrixSyncResponseStateDTO | undefined {
    if ( isMatrixSyncResponseStateDTO(value) ) return value;
    return undefined;
}


