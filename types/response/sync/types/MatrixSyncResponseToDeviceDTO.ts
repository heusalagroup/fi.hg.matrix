// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { MatrixSyncResponseEventDTO,  isMatrixSyncResponseEventDTO } from "./MatrixSyncResponseEventDTO";
import { isRegularObject } from "../../../../../core/types/RegularObject";
import { hasNoOtherKeysInDevelopment } from "../../../../../core/types/OtherKeys";
import { isArrayOf } from "../../../../../core/types/Array";

export interface MatrixSyncResponseToDeviceDTO {
    readonly events : readonly MatrixSyncResponseEventDTO[];
}

export function getEventsFromMatrixSyncResponseToDeviceDTO (
    value: MatrixSyncResponseToDeviceDTO
) : readonly MatrixSyncResponseEventDTO[] {
    return value?.events ?? [];
}

export function isMatrixSyncResponseToDeviceDTO (value: any): value is MatrixSyncResponseToDeviceDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'events'
        ])
        && isArrayOf<MatrixSyncResponseEventDTO>(value?.events, isMatrixSyncResponseEventDTO)
    );
}

export function stringifyMatrixSyncResponseToDeviceDTO (value: MatrixSyncResponseToDeviceDTO): string {
    return `MatrixSyncResponseToDeviceDTO(${value})`;
}

export function parseMatrixSyncResponseToDeviceDTO (value: any): MatrixSyncResponseToDeviceDTO | undefined {
    if ( isMatrixSyncResponseToDeviceDTO(value) ) return value;
    return undefined;
}


