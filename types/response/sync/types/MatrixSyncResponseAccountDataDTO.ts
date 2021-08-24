// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { hasNoOtherKeys, isArrayOf, isRegularObject } from "../../../../../ts/modules/lodash";
import MatrixSyncResponseEventDTO, { isMatrixSyncResponseEventDTO } from "./MatrixSyncResponseEventDTO";

export interface MatrixSyncResponseAccountDataDTO {
    readonly events: MatrixSyncResponseEventDTO[];
}

export function getEventsFromMatrixSyncResponseAccountDataDTO (
    value: MatrixSyncResponseAccountDataDTO
) : MatrixSyncResponseEventDTO[] {
    return value?.events ?? [];
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
