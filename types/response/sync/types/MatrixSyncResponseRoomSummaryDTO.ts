// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeys,
    isIntegerOrUndefined,
    isRegularObject,
    isStringArrayOrUndefined
} from "../../../../../core/modules/lodash";

export interface MatrixSyncResponseRoomSummaryDTO {

    readonly "m.heroes"               ?: string[];
    readonly "m.joined_member_count"  ?: number;
    readonly "m.invited_member_count" ?: number;

}

export function isMatrixSyncResponseRoomSummaryDTO (value: any): value is MatrixSyncResponseRoomSummaryDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            "m.heroes",
            "m.joined_member_count",
            "m.invited_member_count"
        ])
        && isStringArrayOrUndefined(value["m.heroes"])
        && isIntegerOrUndefined(value["m.joined_member_count"])
        && isIntegerOrUndefined(value["m.invited_member_count"])
    );
}

export function stringifyMatrixSyncResponseRoomSummaryDTO (value: MatrixSyncResponseRoomSummaryDTO): string {
    return `MatrixSyncResponseRoomSummaryDTO(${value})`;
}

export function parseMatrixSyncResponseRoomSummaryDTO (value: any): MatrixSyncResponseRoomSummaryDTO | undefined {
    if ( isMatrixSyncResponseRoomSummaryDTO(value) ) return value;
    return undefined;
}

export default MatrixSyncResponseRoomSummaryDTO;
