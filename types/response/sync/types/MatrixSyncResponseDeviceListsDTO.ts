// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { MatrixUserId,  isMatrixUserId } from "../../../core/MatrixUserId";
import {
    hasNoOtherKeys,
    isArrayOf,
    isRegularObject, isUndefined,
    keys
} from "../../../../../core/modules/lodash";

export interface MatrixSyncResponseDeviceListsDTO {
    readonly changed : MatrixUserId[];
    readonly left    : MatrixUserId[] | undefined;
}

export function isMatrixSyncResponseDeviceListsDTO (value: any): value is MatrixSyncResponseDeviceListsDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'changed',
            'left'
        ])
        && isArrayOf<MatrixUserId>(value?.changed, isMatrixUserId)
        && ( isUndefined(value?.left) || isArrayOf<MatrixUserId>(value?.left, isMatrixUserId) )
    );
}

export function assertMatrixSyncResponseDeviceListsDTO (value: any) : void {

    if (! isRegularObject(value) ) {
        throw new TypeError(`Value not regular object: ${value}`);
    }

    if (! hasNoOtherKeys(value, [
        'changed',
        'left'
    ])) {
        throw new TypeError(`Value properties not right: ${keys(value)}`);
    }

    if (! isArrayOf<MatrixUserId>(value?.changed, isMatrixUserId)) {
        throw new TypeError(`Property "changed" not valid: ${value?.changed}`);
    }

    if (! (isUndefined(value?.left) || isArrayOf<MatrixUserId>(value?.left, isMatrixUserId))) {
        throw new TypeError(`Property "left" not valid: ${value?.left}`);
    }

}

export function explainMatrixSyncResponseDeviceListsDTO (value : any) : string {
    try {
        assertMatrixSyncResponseDeviceListsDTO(value);
        return 'No errors detected';
    } catch (err: any) {
        return err?.message;
    }
}

export function stringifyMatrixSyncResponseDeviceListsDTO (value: MatrixSyncResponseDeviceListsDTO): string {
    return `MatrixSyncResponseDeviceListsDTO(${value})`;
}

export function parseMatrixSyncResponseDeviceListsDTO (value: any): MatrixSyncResponseDeviceListsDTO | undefined {
    if ( isMatrixSyncResponseDeviceListsDTO(value) ) return value;
    return undefined;
}


