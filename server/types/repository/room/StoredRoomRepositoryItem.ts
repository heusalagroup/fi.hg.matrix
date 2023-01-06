// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { StoredRepositoryItem } from "../../../../../core/simpleRepository/types/StoredRepositoryItem";
import { MatrixVisibility } from "../../../../types/request/createRoom/types/MatrixVisibility";
import { isString } from "../../../../../core/types/String";
import { isRegularObject } from "../../../../../core/types/RegularObject";
import { hasNoOtherKeys } from "../../../../../core/types/OtherKeys";

export interface StoredRoomRepositoryItem extends StoredRepositoryItem {

    /**
     * Unique ID
     */
    readonly id : string;

    /** Current item data as JSON string
     */
    readonly target : string;

    readonly visibility : MatrixVisibility;

}

export function createStoredRoomRepositoryItem (
    id: string,
    target: string,
    visibility: MatrixVisibility
): StoredRoomRepositoryItem {
    return {
        id,
        target,
        visibility
    };
}

export function isStoredRoomRepositoryItem (value: any): value is StoredRoomRepositoryItem {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'id',
            'target',
            'visibility'
        ])
        && isString(value?.id)
        && isString(value?.target)
        && isString(value?.visibility)
    );
}

export function stringifyStoredRoomRepositoryItem (value: StoredRoomRepositoryItem): string {
    return `StoredRoomRepositoryItem(${value})`;
}

export function parseStoredRoomRepositoryItem (value: any): StoredRoomRepositoryItem | undefined {
    if ( isStoredRoomRepositoryItem(value) ) return value;
    return undefined;
}
