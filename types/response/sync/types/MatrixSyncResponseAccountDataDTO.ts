// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    concat,
    hasNoOtherKeys,
    isArrayOf,
    isRegularObject
} from "../../../../../core/modules/lodash";
import MatrixSyncResponseEventDTO, { isMatrixSyncResponseEventDTO } from "./MatrixSyncResponseEventDTO";

export interface MatrixSyncResponseAccountDataDTO {
    readonly events: MatrixSyncResponseEventDTO[];
}

export function getEventsFromMatrixSyncResponseAccountDataDTO (
    value: MatrixSyncResponseAccountDataDTO
) : readonly MatrixSyncResponseEventDTO[] {
    return concat([], value?.events ?? []);
}

export function isMatrixSyncResponseAccountDataDTO (value: any): value is MatrixSyncResponseAccountDataDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'events'
        ])
        && isArrayOf<MatrixSyncResponseEventDTO>(value?.events, isMatrixSyncResponseEventDTO)
    );
}

export function stringifyMatrixSyncResponseAccountDataDTO (value: MatrixSyncResponseAccountDataDTO): string {
    return `MatrixSyncResponseAccountDataDTO(${value})`;
}

export function parseMatrixSyncResponseAccountDataDTO (value: any): MatrixSyncResponseAccountDataDTO | undefined {
    if ( isMatrixSyncResponseAccountDataDTO(value) ) return value;
    return undefined;
}

export default MatrixSyncResponseAccountDataDTO;
