// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { MatrixSyncResponseEventDTO,  isMatrixSyncResponseEventDTO } from "./MatrixSyncResponseEventDTO";
import { MatrixSyncResponseRoomEventDTO,  isMatrixSyncResponseRoomEventDTO } from "./MatrixSyncResponseRoomEventDTO";
import { MatrixSyncResponseStateEventDTO,  isMatrixSyncResponseStateEventDTO } from "./MatrixSyncResponseStateEventDTO";
import { MatrixSyncResponseStrippedStateDTO,  isMatrixSyncResponseStrippedStateDTO } from "./MatrixSyncResponseStrippedStateDTO";

export type MatrixSyncResponseAnyEventDTO = (
    MatrixSyncResponseEventDTO
    | MatrixSyncResponseRoomEventDTO
    | MatrixSyncResponseStateEventDTO
    | MatrixSyncResponseStrippedStateDTO
);

export function isMatrixSyncResponseAnyEventDTO (value: any): value is MatrixSyncResponseAnyEventDTO {
    return (
        isMatrixSyncResponseEventDTO(value)
        || isMatrixSyncResponseRoomEventDTO(value)
        || isMatrixSyncResponseStateEventDTO(value)
        || isMatrixSyncResponseStrippedStateDTO(value)
    );
}

export function stringifyMatrixSyncResponseAnyEventDTO (value: MatrixSyncResponseAnyEventDTO): string {
    return `MatrixSyncResponseAnyEventDTO(${value})`;
}

export function parseMatrixSyncResponseAnyEventDTO (value: any): MatrixSyncResponseAnyEventDTO | undefined {
    if ( isMatrixSyncResponseAnyEventDTO(value) ) return value;
    return undefined;
}


