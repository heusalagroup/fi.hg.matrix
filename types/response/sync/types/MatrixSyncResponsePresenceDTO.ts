// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { hasNoOtherKeys, isArrayOf, isRegularObject } from "../../../../../ts/modules/lodash";
import MatrixSyncResponseEventDTO, { isMatrixSyncResponseEventDTO } from "./MatrixSyncResponseEventDTO";

export interface MatrixSyncResponsePresenceDTO {
    readonly events: MatrixSyncResponseEventDTO[];
}

export function isMatrixSyncResponsePresenceDTO (value: any): value is MatrixSyncResponsePresenceDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'events'
        ])
        && isArrayOf<MatrixSyncResponseEventDTO>(value?.events, isMatrixSyncResponseEventDTO)
    );
}

export function stringifyMatrixSyncResponsePresenceDTO (value: MatrixSyncResponsePresenceDTO): string {
    return `MatrixSyncResponsePresenceDTO(${value})`;
}

export function parseMatrixSyncResponsePresenceDTO (value: any): MatrixSyncResponsePresenceDTO | undefined {
    if ( isMatrixSyncResponsePresenceDTO(value) ) return value;
    return undefined;
}

export default MatrixSyncResponsePresenceDTO;
