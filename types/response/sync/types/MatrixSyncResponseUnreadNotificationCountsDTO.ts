// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { isInteger } from "../../../../../core/types/Number";
import { isRegularObject } from "../../../../../core/types/RegularObject";
import { hasNoOtherKeysInDevelopment } from "../../../../../core/types/OtherKeys";

export interface MatrixSyncResponseUnreadNotificationCountsDTO {
    readonly highlight_count    : number;
    readonly notification_count : number;
}

export function isMatrixSyncResponseUnreadNotificationCountsDTO (value: any): value is MatrixSyncResponseUnreadNotificationCountsDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
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


