// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import {
    hasNoOtherKeys,
    isRegularObject,
    isString
} from "../../../../../core/modules/lodash";
import { RepositoryItem } from "../../../../../core/simpleRepository/types/RepositoryItem";
import { EventEntity, isEventEntity } from "./entities/EventEntity";
import { parseJson } from "../../../../../core/Json";
import { createStoredEventRepositoryItem, StoredEventRepositoryItem } from "./StoredEventRepositoryItem";

export interface EventRepositoryItem extends RepositoryItem<EventEntity> {
    readonly id: string;
    readonly target: EventEntity;
}

export function createEventRepositoryItem (
    id: string,
    target: EventEntity
): EventRepositoryItem {
    return {
        id,
        target
    };
}

export function isEventRepositoryItem (value: any): value is EventRepositoryItem {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'id',
            'target'
        ])
        && isString(value?.id)
        && isEventEntity(value?.target)
    );
}

export function stringifyEventRepositoryItem (value: EventRepositoryItem): string {
    return `HgHsEventRepositoryItem(${value})`;
}

export function parseEventRepositoryItem (id: string, unparsedData: any) : EventRepositoryItem | undefined {
    const data = parseJson(unparsedData);
    if ( !isEventEntity(data) ) return undefined;
    return createEventRepositoryItem(
        id,
        data
    );
}

export function toStoredEventRepositoryItem (
    item: EventRepositoryItem
) : StoredEventRepositoryItem | undefined {
    return createStoredEventRepositoryItem(
        item.id,
        JSON.stringify(item.target),
        item.target.senderId,
        item.target.roomId
    );
}
