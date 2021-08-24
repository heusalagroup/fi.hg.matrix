// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import MatrixUserId, { isMatrixUserId } from "../../../core/MatrixUserId";
import { hasNoOtherKeys, isArrayOf, isRegularObject } from "../../../../../ts/modules/lodash";

export interface MatrixSyncResponseDeviceListsDTO {
    readonly changed : MatrixUserId[];
    readonly left    : MatrixUserId[];
}

export function isMatrixSyncResponseDeviceListsDTO (value: any): value is MatrixSyncResponseDeviceListsDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'changed',
            'left'
        ])
        && isArrayOf<MatrixUserId>(value?.changed, isMatrixUserId)
        && isArrayOf<MatrixUserId>(value?.left, isMatrixUserId)
    );
}

export function stringifyMatrixSyncResponseDeviceListsDTO (value: MatrixSyncResponseDeviceListsDTO): string {
    return `MatrixSyncResponseDeviceListsDTO(${value})`;
}

export function parseMatrixSyncResponseDeviceListsDTO (value: any): MatrixSyncResponseDeviceListsDTO | undefined {
    if ( isMatrixSyncResponseDeviceListsDTO(value) ) return value;
    return undefined;
}

export default MatrixSyncResponseDeviceListsDTO;
