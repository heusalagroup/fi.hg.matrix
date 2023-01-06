// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { RepositoryItem } from "../../../../../core/simpleRepository/types/RepositoryItem";
import { EventEntity, explainEventEntity, isEventEntity } from "./entities/EventEntity";
import { parseJson } from "../../../../../core/Json";
import { createStoredEventRepositoryItem, StoredEventRepositoryItem } from "./StoredEventRepositoryItem";
import { LogService } from "../../../../../core/LogService";
import { explain, explainProperty } from "../../../../../core/types/explain";
import { explainString, isString } from "../../../../../core/types/String";
import { explainRegularObject, isRegularObject } from "../../../../../core/types/RegularObject";
import { explainNoOtherKeys, hasNoOtherKeys } from "../../../../../core/types/OtherKeys";

const LOG = LogService.createLogger('EventRepositoryItem');

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

export function explainEventRepositoryItem (value: any) : string {
    return explain(
        [
            explainRegularObject(value),
            explainNoOtherKeys(value, [
                'id',
                'target'
            ]),
            explainProperty("id", explainString(value?.id)),
            explainProperty("target", explainEventEntity(value?.target))
        ]
    );
}

export function stringifyEventRepositoryItem (value: EventRepositoryItem): string {
    return `HgHsEventRepositoryItem(${value})`;
}

export function parseEventRepositoryItem (id: string, unparsedData: any) : EventRepositoryItem | undefined {
    const data = parseJson(unparsedData);
    if ( !isEventEntity(data) ) {
        LOG.warn(`Warning! Could not parse repository item "${id}" because ${explainEventEntity(data)}`);
        return undefined;
    }
    return createEventRepositoryItem(
        id,
        data
    );
}

export function toStoredEventRepositoryItem (
    item: EventRepositoryItem
) : StoredEventRepositoryItem {
    if (!isEventRepositoryItem(item)) {
        LOG.debug(`toStoredEventRepositoryItem: item: `, item);
        throw new TypeError(`EventRepositoryItem.toStoredEventRepositoryItem: Item ${explainEventRepositoryItem(item)}`);
    }
    return createStoredEventRepositoryItem(
        item.id,
        JSON.stringify(item.target),
        item.target.senderId,
        item.target?.roomId
    );
}
