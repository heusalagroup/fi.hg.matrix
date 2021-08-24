// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import MatrixSyncResponseStateDTO, { isMatrixSyncResponseStateDTO } from "./MatrixSyncResponseStateDTO";
import MatrixSyncResponseTimelineDTO, { isMatrixSyncResponseTimelineDTO } from "./MatrixSyncResponseTimelineDTO";
import MatrixSyncResponseAccountDataDTO, { isMatrixSyncResponseAccountDataDTO } from "./MatrixSyncResponseAccountDataDTO";
import { hasNoOtherKeys, isRegularObject } from "../../../../../ts/modules/lodash";

export interface MatrixSyncResponseLeftRoomDTO {
    readonly state        : MatrixSyncResponseStateDTO;
    readonly timeline     : MatrixSyncResponseTimelineDTO;
    readonly account_data : MatrixSyncResponseAccountDataDTO;
}

export function isMatrixSyncResponseLeftRoomDTO (value: any): value is MatrixSyncResponseLeftRoomDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'state',
            'timeline',
            'account_data'
        ])
        && isMatrixSyncResponseStateDTO(value?.state)
        && isMatrixSyncResponseTimelineDTO(value?.timeline)
        && isMatrixSyncResponseAccountDataDTO(value?.account_data)
    );
}

export function stringifyMatrixSyncResponseLeftRoomDTO (value: MatrixSyncResponseLeftRoomDTO): string {
    return `MatrixSyncResponseLeftRoomDTO(${value})`;
}

export function parseMatrixSyncResponseLeftRoomDTO (value: any): MatrixSyncResponseLeftRoomDTO | undefined {
    if ( isMatrixSyncResponseLeftRoomDTO(value) ) return value;
    return undefined;
}

export default MatrixSyncResponseLeftRoomDTO;
