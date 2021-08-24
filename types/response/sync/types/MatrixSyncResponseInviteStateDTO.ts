// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import MatrixSyncResponseStrippedStateDTO, { isMatrixSyncResponseStrippedStateDTO } from "./MatrixSyncResponseStrippedStateDTO";
import { hasNoOtherKeys, isArrayOf, isRegularObject } from "../../../../../ts/modules/lodash";

export interface MatrixSyncResponseInviteStateDTO {
    readonly events: MatrixSyncResponseStrippedStateDTO[];
}

export function isMatrixSyncResponseInviteStateDTO (value: any): value is MatrixSyncResponseInviteStateDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'events'
        ])
        && isArrayOf(value?.events, isMatrixSyncResponseStrippedStateDTO)
    );
}

export function stringifyMatrixSyncResponseInviteStateDTO (value: MatrixSyncResponseInviteStateDTO): string {
    return `MatrixSyncResponseInviteStateDTO(${value})`;
}

export function parseMatrixSyncResponseInviteStateDTO (value: any): MatrixSyncResponseInviteStateDTO | undefined {
    if ( isMatrixSyncResponseInviteStateDTO(value) ) return value;
    return undefined;
}

export default MatrixSyncResponseInviteStateDTO;
