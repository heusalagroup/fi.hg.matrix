// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeys,
    isInteger,
    isRegularObject
} from "../../../../../ts/modules/lodash";

export interface MatrixSyncResponseUnreadNotificationCountsDTO {
    readonly highlight_count    : number;
    readonly notification_count : number;
}

export function isMatrixSyncResponseUnreadNotificationCountsDTO (value: any): value is MatrixSyncResponseUnreadNotificationCountsDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'highlight_count',
            'notification_count'
        ])
        && isInteger(value?.highlight_count)
        && isInteger(value?.notification_count)
    );
}

export function stringifyMatrixSyncResponseUnreadNotificationCountsDTO (value: MatrixSyncResponseUnreadNotificationCountsDTO): string {
    return `MatrixSyncResponseUnreadNotificationCountsDTO(${value})`;
}

export function parseMatrixSyncResponseUnreadNotificationCountsDTO (value: any): MatrixSyncResponseUnreadNotificationCountsDTO | undefined {
    if ( isMatrixSyncResponseUnreadNotificationCountsDTO(value) ) return value;
    return undefined;
}

export default MatrixSyncResponseUnreadNotificationCountsDTO;
