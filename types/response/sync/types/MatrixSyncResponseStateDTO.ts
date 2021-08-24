// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { hasNoOtherKeys, isRegularObject } from "../../../../../ts/modules/lodash";
import MatrixSyncResponseStateEventDTO, { isMatrixSyncResponseStateEventDTO } from "./MatrixSyncResponseStateEventDTO";

export interface MatrixSyncResponseStateDTO {
    readonly events : MatrixSyncResponseStateEventDTO[];
}

export function getEventsFromMatrixSyncResponseStateDTO (
    value: MatrixSyncResponseStateDTO
) : MatrixSyncResponseStateEventDTO[] {
    return value?.events ?? [];
}

export function isMatrixSyncResponseStateDTO (value: any): value is MatrixSyncResponseStateDTO {
    return (
        // FIXME: TODO
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'events'
        ])
        && isMatrixSyncResponseStateEventDTO(value?.events)
    );
}

export function stringifyMatrixSyncResponseStateDTO (value: MatrixSyncResponseStateDTO): string {
    return `MatrixSyncResponseStateDTO(${value})`;
}

export function parseMatrixSyncResponseStateDTO (value: any): MatrixSyncResponseStateDTO | undefined {
    if ( isMatrixSyncResponseStateDTO(value) ) return value;
    return undefined;
}

export default MatrixSyncResponseStateDTO;
