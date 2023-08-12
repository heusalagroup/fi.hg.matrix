// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { MatrixSyncResponseEventDTO,  isMatrixSyncResponseEventDTO } from "./MatrixSyncResponseEventDTO";
import { isRegularObject } from "../../../../../core/types/RegularObject";
import { hasNoOtherKeysInDevelopment } from "../../../../../core/types/OtherKeys";
import { isArrayOfOrUndefined } from "../../../../../core/types/Array";

export interface MatrixSyncResponsePresenceDTO {
    readonly events ?: readonly MatrixSyncResponseEventDTO[];
}

export function getEventsFromMatrixSyncResponsePresenceDTO (
    value: MatrixSyncResponsePresenceDTO
) : readonly MatrixSyncResponseEventDTO[] {
    return value?.events ?? [];
}

export function isMatrixSyncResponsePresenceDTO (value: any): value is MatrixSyncResponsePresenceDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'events'
        ])
        && isArrayOfOrUndefined<MatrixSyncResponseEventDTO>(value?.events, isMatrixSyncResponseEventDTO)
    );
}

export function stringifyMatrixSyncResponsePresenceDTO (value: MatrixSyncResponsePresenceDTO): string {
    return `MatrixSyncResponsePresenceDTO(${value})`;
}

export function parseMatrixSyncResponsePresenceDTO (value: any): MatrixSyncResponsePresenceDTO | undefined {
    if ( isMatrixSyncResponsePresenceDTO(value) ) return value;
    return undefined;
}


