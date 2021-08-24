// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import MatrixSyncResponseEventDTO, { isMatrixSyncResponseEventDTO } from "./MatrixSyncResponseEventDTO";
import { hasNoOtherKeys, isArrayOf, isRegularObject } from "../../../../../ts/modules/lodash";

export interface MatrixSyncResponseToDeviceDTO {

    readonly events : MatrixSyncResponseEventDTO[];

}

export function isMatrixSyncResponseToDeviceDTO (value: any): value is MatrixSyncResponseToDeviceDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
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

export default MatrixSyncResponseToDeviceDTO;
