// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { MatrixType } from "../../../core/MatrixType";
import { isIntegerOrUndefined } from "../../../../../core/types/Number";
import { isStringArrayOrUndefined } from "../../../../../core/types/StringArray";
import { isRegularObject } from "../../../../../core/types/RegularObject";
import { hasNoOtherKeysInDevelopment } from "../../../../../core/types/OtherKeys";

export interface MatrixSyncResponseRoomSummaryDTO {
    readonly [MatrixType.M_HEROES]               ?: readonly string[];
    readonly [MatrixType.M_JOINED_MEMBER_COUNT]  ?: number;
    readonly [MatrixType.M_INVITED_MEMBER_COUNT] ?: number;
}

export function isMatrixSyncResponseRoomSummaryDTO (value: any): value is MatrixSyncResponseRoomSummaryDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            MatrixType.M_HEROES,
            MatrixType.M_JOINED_MEMBER_COUNT,
            MatrixType.M_INVITED_MEMBER_COUNT
        ])
        && isStringArrayOrUndefined(value[MatrixType.M_HEROES])
        && isIntegerOrUndefined(value[MatrixType.M_JOINED_MEMBER_COUNT])
        && isIntegerOrUndefined(value[MatrixType.M_INVITED_MEMBER_COUNT])
    );
}

export function stringifyMatrixSyncResponseRoomSummaryDTO (value: MatrixSyncResponseRoomSummaryDTO): string {
    return `MatrixSyncResponseRoomSummaryDTO(${value})`;
}

export function parseMatrixSyncResponseRoomSummaryDTO (value: any): MatrixSyncResponseRoomSummaryDTO | undefined {
    if ( isMatrixSyncResponseRoomSummaryDTO(value) ) return value;
    return undefined;
}


