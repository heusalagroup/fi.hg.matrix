// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { concat } from "../../../../../core/functions/concat";
import { MatrixSyncResponseEventDTO,  isMatrixSyncResponseEventDTO } from "./MatrixSyncResponseEventDTO";
import { isRegularObject } from "../../../../../core/types/RegularObject";
import { hasNoOtherKeysInDevelopment } from "../../../../../core/types/OtherKeys";
import { isArrayOfOrUndefined } from "../../../../../core/types/Array";

export interface MatrixSyncResponseAccountDataDTO {
    readonly events ?: readonly MatrixSyncResponseEventDTO[];
}

export function getEventsFromMatrixSyncResponseAccountDataDTO (
    value: MatrixSyncResponseAccountDataDTO
) : readonly MatrixSyncResponseEventDTO[] {
    return concat([], value?.events ?? []);
}

export function isMatrixSyncResponseAccountDataDTO (value: any): value is MatrixSyncResponseAccountDataDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'events'
        ])
        && isArrayOfOrUndefined<MatrixSyncResponseEventDTO>(value?.events, isMatrixSyncResponseEventDTO)
    );
}

export function stringifyMatrixSyncResponseAccountDataDTO (value: MatrixSyncResponseAccountDataDTO): string {
    return `MatrixSyncResponseAccountDataDTO(${value})`;
}

export function parseMatrixSyncResponseAccountDataDTO (value: any): MatrixSyncResponseAccountDataDTO | undefined {
    if ( isMatrixSyncResponseAccountDataDTO(value) ) return value;
    return undefined;
}


