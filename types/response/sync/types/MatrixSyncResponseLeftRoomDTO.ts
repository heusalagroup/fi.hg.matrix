// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { MatrixSyncResponseStateDTO,
    getEventsFromMatrixSyncResponseStateDTO,
    isMatrixSyncResponseStateDTO
} from "./MatrixSyncResponseStateDTO";
import { MatrixSyncResponseTimelineDTO,
    getEventsFromMatrixSyncResponseTimelineDTO,
    isMatrixSyncResponseTimelineDTO
} from "./MatrixSyncResponseTimelineDTO";
import { MatrixSyncResponseAccountDataDTO,
    getEventsFromMatrixSyncResponseAccountDataDTO,
    isMatrixSyncResponseAccountDataDTO
} from "./MatrixSyncResponseAccountDataDTO";
import { concat, hasNoOtherKeysInDevelopment, isRegularObject } from "../../../../../core/modules/lodash";
import { MatrixSyncResponseEventDTO } from "./MatrixSyncResponseEventDTO";
import { MatrixSyncResponseRoomEventDTO } from "./MatrixSyncResponseRoomEventDTO";
import { MatrixSyncResponseStateEventDTO } from "./MatrixSyncResponseStateEventDTO";

export interface MatrixSyncResponseLeftRoomDTO {
    readonly state        : MatrixSyncResponseStateDTO;
    readonly timeline     : MatrixSyncResponseTimelineDTO;
    readonly account_data : MatrixSyncResponseAccountDataDTO;
}

export function getEventsFromMatrixSyncResponseLeftRoomDTO (
    value: MatrixSyncResponseLeftRoomDTO
) : readonly (MatrixSyncResponseStateEventDTO|MatrixSyncResponseRoomEventDTO|MatrixSyncResponseEventDTO)[] {
    return concat(
        [] as (MatrixSyncResponseStateEventDTO|MatrixSyncResponseRoomEventDTO|MatrixSyncResponseEventDTO)[],
        getEventsFromMatrixSyncResponseStateDTO(value?.state),
        getEventsFromMatrixSyncResponseTimelineDTO(value?.timeline),
        getEventsFromMatrixSyncResponseAccountDataDTO(value?.account_data)
    );
}

export function isMatrixSyncResponseLeftRoomDTO (value: any): value is MatrixSyncResponseLeftRoomDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
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


