// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import MatrixSyncResponseRoomSummaryDTO, { isMatrixSyncResponseRoomSummaryDTO } from "./MatrixSyncResponseRoomSummaryDTO";
import MatrixSyncResponseStateDTO, { isMatrixSyncResponseStateDTO } from "./MatrixSyncResponseStateDTO";
import MatrixSyncResponseTimelineDTO, { isMatrixSyncResponseTimelineDTO } from "./MatrixSyncResponseTimelineDTO";
import MatrixSyncResponseEphemeralDTO, { isMatrixSyncResponseEphemeralDTO } from "./MatrixSyncResponseEphemeralDTO";
import MatrixSyncResponseAccountDataDTO, { isMatrixSyncResponseAccountDataDTO } from "./MatrixSyncResponseAccountDataDTO";
import MatrixSyncResponseUnreadNotificationCountsDTO
    , { isMatrixSyncResponseUnreadNotificationCountsDTO } from "./MatrixSyncResponseUnreadNotificationCountsDTO";
import { hasNoOtherKeys, isRegularObject, isUndefined } from "../../../../../ts/modules/lodash";

export interface MatrixSyncResponseJoinedRoomDTO {
    readonly summary              ?: MatrixSyncResponseRoomSummaryDTO;
    readonly state                ?: MatrixSyncResponseStateDTO;
    readonly timeline             ?: MatrixSyncResponseTimelineDTO;
    readonly ephemeral            ?: MatrixSyncResponseEphemeralDTO;
    readonly account_data         ?: MatrixSyncResponseAccountDataDTO;
    readonly unread_notifications ?: MatrixSyncResponseUnreadNotificationCountsDTO;
}

export function isMatrixSyncResponseJoinedRoomDTO (value: any): value is MatrixSyncResponseJoinedRoomDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'summary',
            'state',
            'timeline',
            'ephemeral',
            'account_data',
            'unread_notifications'
        ])
        && (isUndefined(value?.summary) || isMatrixSyncResponseRoomSummaryDTO(value?.summary))
        && (isUndefined(value?.state) || isMatrixSyncResponseStateDTO(value?.state))
        && (isUndefined(value?.timeline) || isMatrixSyncResponseTimelineDTO(value?.timeline))
        && (isUndefined(value?.ephemeral) || isMatrixSyncResponseEphemeralDTO(value?.ephemeral))
        && (isUndefined(value?.account_data) || isMatrixSyncResponseAccountDataDTO(value?.account_data))
        && (isUndefined(value?.unread_notifications) || isMatrixSyncResponseUnreadNotificationCountsDTO(value?.unread_notifications))
    );
}

export function stringifyMatrixSyncResponseJoinedRoomDTO (value: MatrixSyncResponseJoinedRoomDTO): string {
    return `MatrixSyncResponseJoinedRoomDTO(${value})`;
}

export function parseMatrixSyncResponseJoinedRoomDTO (value: any): MatrixSyncResponseJoinedRoomDTO | undefined {
    if ( isMatrixSyncResponseJoinedRoomDTO(value) ) return value;
    return undefined;
}

export default MatrixSyncResponseJoinedRoomDTO;
