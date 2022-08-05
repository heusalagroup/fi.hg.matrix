// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    concat,
    find,
    hasNoOtherKeysInDevelopment,
    isArrayOf,
    isRegularObject
} from "../../../../../core/modules/lodash";

import { MatrixSyncResponseStateEventDTO,
    explainMatrixSyncResponseStateEventDTO,
    isMatrixSyncResponseStateEventDTO
} from "./MatrixSyncResponseStateEventDTO";
import { LogService } from "../../../../../core/LogService";

const LOG = LogService.createLogger('MatrixSyncResponseStateDTO');

export interface MatrixSyncResponseStateDTO {
    readonly events : readonly MatrixSyncResponseStateEventDTO[];
}

export function getEventsFromMatrixSyncResponseStateDTO (
    value: MatrixSyncResponseStateDTO
) : readonly MatrixSyncResponseStateEventDTO[] {
    return concat([], value?.events ?? []);
}

export function isMatrixSyncResponseStateDTO (value: any): value is MatrixSyncResponseStateDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'events'
        ])
        && isArrayOf<MatrixSyncResponseStateEventDTO>(value?.events, isMatrixSyncResponseStateEventDTO)
    );
}

export function assertMatrixSyncResponseStateDTO (value: any): void {

    if(!( isRegularObject(value) )) {
        throw new TypeError(`value was not object`);
    }

    if(!( hasNoOtherKeysInDevelopment(value, [
            'events'
        ]))) {
        throw new TypeError(`value had extra keys`);
    }

    if(!( isArrayOf<MatrixSyncResponseStateEventDTO>(value?.events, isMatrixSyncResponseStateEventDTO) )) {
        if (!value?.events) {
            LOG.debug(`Not a MatrixSyncResponseStateDTO: ${JSON.stringify(value, null, 2)}`);
            throw new TypeError(`Property "events": Not array of MatrixSyncResponseStateEventDTO: Not an array: ${value?.events}`);
        }
        const item = find(value?.events, item => !isMatrixSyncResponseStateEventDTO(item));
        throw new TypeError(`Property "events": Not array of MatrixSyncResponseStateEventDTO: ${explainMatrixSyncResponseStateEventDTO(item)}`);
    }

}

export function explainMatrixSyncResponseStateDTO (value : any) : string {
    try {
        assertMatrixSyncResponseStateDTO(value);
        return 'No errors detected';
    } catch (err : any) {
        return err?.message;
    }
}

export function stringifyMatrixSyncResponseStateDTO (value: MatrixSyncResponseStateDTO): string {
    return `MatrixSyncResponseStateDTO(${value})`;
}

export function parseMatrixSyncResponseStateDTO (value: any): MatrixSyncResponseStateDTO | undefined {
    if ( isMatrixSyncResponseStateDTO(value) ) return value;
    return undefined;
}


