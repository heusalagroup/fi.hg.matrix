// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { isMatrixHistoryVisibility, MatrixHistoryVisibility } from "./MatrixHistoryVisibility";
import { ReadonlyJsonObject } from "../../../../core/Json";
import { isRegularObject } from "../../../../core/types/RegularObject";
import { hasNoOtherKeysInDevelopment } from "../../../../core/types/OtherKeys";

export interface RoomHistoryVisibilityStateContentDTO  extends ReadonlyJsonObject {
    readonly history_visibility : MatrixHistoryVisibility;
}

export function createRoomHistoryVisibilityStateContentDTO (
    history_visibility : MatrixHistoryVisibility
): RoomHistoryVisibilityStateContentDTO {
    return {
        history_visibility
    };
}

export function isRoomHistoryVisibilityStateContentDTO (value: any): value is RoomHistoryVisibilityStateContentDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'history_visibility'
        ])
        && isMatrixHistoryVisibility(value?.history_visibility)
    );
}

export function stringifyRoomHistoryVisibilityStateContentDTO (value: RoomHistoryVisibilityStateContentDTO): string {
    return `RoomHistoryVisibilityStateContentDTO(${value})`;
}

export function parseRoomHistoryVisibilityStateContentDTO (value: any): RoomHistoryVisibilityStateContentDTO | undefined {
    if ( isRoomHistoryVisibilityStateContentDTO(value) ) return value;
    return undefined;
}
