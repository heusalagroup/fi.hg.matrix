// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    isInteger,
    isRegularObjectOf,
    isString
} from "../../../../../core/modules/lodash";

export interface MatrixSyncResponseDeviceOneTimeKeysCountDTO {
    readonly [key : string] : number;
}

export function isMatrixSyncResponseDeviceOneTimeKeysCountDTO (value: any): value is MatrixSyncResponseDeviceOneTimeKeysCountDTO {
    return (
        isRegularObjectOf<string, number>(value, isString, isInteger)
    );
}

export function stringifyMatrixSyncResponseDeviceOneTimeKeysCountDTO (value: MatrixSyncResponseDeviceOneTimeKeysCountDTO): string {
    return `MatrixSyncResponseDeviceOneTimeKeysCountDTO(${value})`;
}

export function parseMatrixSyncResponseDeviceOneTimeKeysCountDTO (value: any): MatrixSyncResponseDeviceOneTimeKeysCountDTO | undefined {
    if ( isMatrixSyncResponseDeviceOneTimeKeysCountDTO(value) ) return value;
    return undefined;
}

export default MatrixSyncResponseDeviceOneTimeKeysCountDTO;
