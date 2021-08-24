// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import MatrixStateEvent, { isMatrixStateEvent } from "../../../core/MatrixStateEvent";
import { hasNoOtherKeys, isRegularObject } from "../../../../../ts/modules/lodash";

export interface MatrixSyncResponseStateDTO {
    readonly events : MatrixStateEvent[];
}

export function isMatrixSyncResponseStateDTO (value: any): value is MatrixSyncResponseStateDTO {
    return (
        // FIXME: TODO
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'events'
        ])
        && isMatrixStateEvent(value?.events)
    );
}

export function stringifyMatrixSyncResponseStateDTO (value: MatrixSyncResponseStateDTO): string {
    return `MatrixSyncResponseStateDTO(${value})`;
}

export function parseMatrixSyncResponseStateDTO (value: any): MatrixSyncResponseStateDTO | undefined {
    if ( isMatrixSyncResponseStateDTO(value) ) return value;
    return undefined;
}

export default MatrixSyncResponseStateDTO;
