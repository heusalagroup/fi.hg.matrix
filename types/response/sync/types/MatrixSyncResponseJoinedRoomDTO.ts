// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    MatrixSyncResponseRoomSummaryDTO,
    isMatrixSyncResponseRoomSummaryDTO
} from "./MatrixSyncResponseRoomSummaryDTO";
import {
    MatrixSyncResponseStateDTO,
    explainMatrixSyncResponseStateDTO,
    getEventsFromMatrixSyncResponseStateDTO,
    isMatrixSyncResponseStateDTO
} from "./MatrixSyncResponseStateDTO";
import {
    MatrixSyncResponseTimelineDTO,
    explainMatrixSyncResponseTimelineDTO,
    getEventsFromMatrixSyncResponseTimelineDTO,
    isMatrixSyncResponseTimelineDTO
} from "./MatrixSyncResponseTimelineDTO";
import {
    MatrixSyncResponseEphemeralDTO,
    getEventsFromMatrixSyncResponseEphemeralDTO,
    isMatrixSyncResponseEphemeralDTO
} from "./MatrixSyncResponseEphemeralDTO";
import {
    MatrixSyncResponseAccountDataDTO,
    getEventsFromMatrixSyncResponseAccountDataDTO,
    isMatrixSyncResponseAccountDataDTO
} from "./MatrixSyncResponseAccountDataDTO";
import {
    MatrixSyncResponseUnreadNotificationCountsDTO,
    isMatrixSyncResponseUnreadNotificationCountsDTO
} from "./MatrixSyncResponseUnreadNotificationCountsDTO";
import {
    concat,
    hasNoOtherKeysInDevelopment,
    isNumberOrUndefined,
    isRegularObject,
    isUndefined
} from "../../../../../core/modules/lodash";
import { MatrixSyncResponseEventDTO } from "./MatrixSyncResponseEventDTO";
import { MatrixSyncResponseRoomEventDTO } from "./MatrixSyncResponseRoomEventDTO";

export interface MatrixSyncResponseJoinedRoomDTO {
    readonly summary?: MatrixSyncResponseRoomSummaryDTO;
    readonly state?: MatrixSyncResponseStateDTO;
    readonly timeline?: MatrixSyncResponseTimelineDTO;
    readonly ephemeral?: MatrixSyncResponseEphemeralDTO;
    readonly account_data?: MatrixSyncResponseAccountDataDTO;
    readonly unread_notifications?: MatrixSyncResponseUnreadNotificationCountsDTO;
    readonly "org.matrix.msc2654.unread_count"?: number;
}

export function getEventsFromMatrixSyncResponseJoinedRoomDTO (
    value: MatrixSyncResponseJoinedRoomDTO
): readonly (MatrixSyncResponseRoomEventDTO | MatrixSyncResponseEventDTO)[] {

    return concat(
        [] as readonly (MatrixSyncResponseRoomEventDTO | MatrixSyncResponseEventDTO)[],
        value?.state ? getEventsFromMatrixSyncResponseStateDTO(value?.state) : [],
        value?.timeline ? getEventsFromMatrixSyncResponseTimelineDTO(value?.timeline) : [],
        value?.ephemeral ? getEventsFromMatrixSyncResponseEphemeralDTO(value?.ephemeral) : [],
        value?.account_data ? getEventsFromMatrixSyncResponseAccountDataDTO(
            value?.account_data) : []
    );

}

export function isMatrixSyncResponseJoinedRoomDTO (value: any): value is MatrixSyncResponseJoinedRoomDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'summary',
            'state',
            'timeline',
            'ephemeral',
            'account_data',
            'unread_notifications',
            'org.matrix.msc2654.unread_count'
        ])
        && (isUndefined(value?.summary) || isMatrixSyncResponseRoomSummaryDTO(value?.summary))
        && (isUndefined(value?.state) || isMatrixSyncResponseStateDTO(value?.state))
        && (isUndefined(value?.timeline) || isMatrixSyncResponseTimelineDTO(value?.timeline))
        && (isUndefined(value?.ephemeral) || isMatrixSyncResponseEphemeralDTO(value?.ephemeral))
        && (isUndefined(value?.account_data) || isMatrixSyncResponseAccountDataDTO(
            value?.account_data))
        && (isUndefined(
            value?.unread_notifications) || isMatrixSyncResponseUnreadNotificationCountsDTO(
            value?.unread_notifications))
        && (isNumberOrUndefined(value['org.matrix.msc2654.unread_count']))
    );
}

export function assertMatrixSyncResponseJoinedRoomDTO (value: any): void {

    if ( !(isRegularObject(value)) ) {
        throw new TypeError(`value was not object: ${value}`);
    }

    if ( !(hasNoOtherKeysInDevelopment(value, [
        'summary',
        'state',
        'timeline',
        'ephemeral',
        'account_data',
        'unread_notifications',
        'org.matrix.msc2654.unread_count'
    ])) ) {
        throw new TypeError(`value had extra keys: ${value}`);
    }

    if ( !((isUndefined(value?.summary) || isMatrixSyncResponseRoomSummaryDTO(value?.summary))) ) {
        throw new TypeError(`Property "summary" was invalid: ${value}`);
    }

    if ( !((isUndefined(value?.state) || isMatrixSyncResponseStateDTO(value?.state))) ) {
        throw new TypeError(
            `Property "state" was invalid: ${explainMatrixSyncResponseStateDTO(value)}`);
    }

    if ( !((isUndefined(value?.timeline) || isMatrixSyncResponseTimelineDTO(value?.timeline))) ) {
        throw new TypeError(
            `Property "timeline" was invalid: ${explainMatrixSyncResponseTimelineDTO(
                value?.timeline)}`);
    }

    if ( !((isUndefined(value?.ephemeral) || isMatrixSyncResponseEphemeralDTO(
        value?.ephemeral))) ) {
        throw new TypeError(`Property "ephemeral" was invalid: ${value}`);
    }

    if ( !((isUndefined(value?.account_data) || isMatrixSyncResponseAccountDataDTO(
        value?.account_data))) ) {
        throw new TypeError(`Property "account_data" was invalid: ${value}`);
    }

    if ( !((isUndefined(
        value?.unread_notifications) || isMatrixSyncResponseUnreadNotificationCountsDTO(
        value?.unread_notifications))) ) {
        throw new TypeError(`Property "unread_notifications" was invalid: ${value}`);
    }

    if ( !((isNumberOrUndefined(value['org.matrix.msc2654.unread_count']))) ) {
        throw new TypeError(`Property "org.matrix.msc2654.unread_count" was invalid: ${value}`);
    }

}

export function explainMatrixSyncResponseJoinedRoomDTO (value: any): string {
    try {
        assertMatrixSyncResponseJoinedRoomDTO(value);
        return 'No errors detected';
    } catch (err: any) {
        return err?.message;
    }
}

export function stringifyMatrixSyncResponseJoinedRoomDTO (value: MatrixSyncResponseJoinedRoomDTO): string {
    return `MatrixSyncResponseJoinedRoomDTO(${value})`;
}

export function parseMatrixSyncResponseJoinedRoomDTO (value: any): MatrixSyncResponseJoinedRoomDTO | undefined {
    if ( isMatrixSyncResponseJoinedRoomDTO(value) ) return value;
    return undefined;
}


