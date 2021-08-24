// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { hasNoOtherKeys, isArrayOf, isRegularObject } from "../../../../../ts/modules/lodash";
import MatrixSyncResponseEventDTO, { isMatrixSyncResponseEventDTO } from "./MatrixSyncResponseEventDTO";

export interface MatrixSyncResponseEphemeralDTO {
    readonly events : MatrixSyncResponseEventDTO[];
}

export function isMatrixSyncResponseEphemeralDTO (value: any): value is MatrixSyncResponseEphemeralDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
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

export default MatrixSyncResponseEphemeralDTO;
