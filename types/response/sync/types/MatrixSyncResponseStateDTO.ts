// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    concat,
    hasNoOtherKeys,
    isArrayOf,
    isRegularObject
} from "../../../../../ts/modules/lodash";
import MatrixSyncResponseStateEventDTO, { isMatrixSyncResponseStateEventDTO } from "./MatrixSyncResponseStateEventDTO";
import { assertMatrixSyncResponseRoomsDTO } from "./MatrixSyncResponseRoomsDTO";

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
        throw new TypeError(`Not array of MatrixSyncResponseStateEventDTO: ${value?.events}`);
    }

}

export function explainMatrixSyncResponseStateDTO (value : any) : string {
    try {
        assertMatrixSyncResponseStateDTO(value);
        return 'No errors detected';
    } catch (err) {
        return err.message;
    }
}

export function stringifyMatrixSyncResponseStateDTO (value: MatrixSyncResponseStateDTO): string {
    return `MatrixSyncResponseStateDTO(${value})`;
}

export function parseMatrixSyncResponseStateDTO (value: any): MatrixSyncResponseStateDTO | undefined {
    if ( isMatrixSyncResponseStateDTO(value) ) return value;
    return undefined;
}

export default MatrixSyncResponseStateDTO;
