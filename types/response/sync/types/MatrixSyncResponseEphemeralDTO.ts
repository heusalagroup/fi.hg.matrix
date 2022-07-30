// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    concat,
    hasNoOtherKeysInDevelopment,
    isArrayOf,
    isRegularObject
} from "../../../../../core/modules/lodash";
import { MatrixSyncResponseEventDTO,  isMatrixSyncResponseEventDTO } from "./MatrixSyncResponseEventDTO";

export interface MatrixSyncResponseEphemeralDTO {
    readonly events : readonly sMatrixSyncResponseEventDTO[];
}

export function getEventsFromMatrixSyncResponseEphemeralDTO (
    value: MatrixSyncResponseEphemeralDTO
) : readonly MatrixSyncResponseEventDTO[] {
    return concat([], value?.events ?? []);
}

export function isMatrixSyncResponseEphemeralDTO (value: any): value is MatrixSyncResponseEphemeralDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'events'
        ])
        && isArrayOf(value?.events, isMatrixSyncResponseEventDTO)
    );
}

export function stringifyMatrixSyncResponseEphemeralDTO (value: MatrixSyncResponseEphemeralDTO): string {
    return `MatrixSyncResponseEphemeralDTO(${value})`;
}

export function parseMatrixSyncResponseEphemeralDTO (value: any): MatrixSyncResponseEphemeralDTO | undefined {
    if ( isMatrixSyncResponseEphemeralDTO(value) ) return value;
    return undefined;
}


