// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { createRoomEventEntity, RoomEventEntity } from "./RoomEventEntity";
import {
    hasNoOtherKeys,
    isNumber,
    isRegularObject,
    isString
} from "../../../../../../core/modules/lodash";
import { MatrixType } from "../../../../../types/core/MatrixType";
import { isJsonObject, ReadonlyJsonObject } from "../../../../../../core/Json";

/**
 * Base type for room message events saved in the repository.
 */
export interface RoomMessageEventEntity extends RoomEventEntity {
    readonly id              : string;
    readonly type            : MatrixType | string;
    readonly content         : ReadonlyJsonObject;
    readonly originServerTs  : number;
    readonly senderId        : string;
    readonly roomId          : string;
    readonly stateKey       ?: undefined;
}

export function createRoomMessageEventEntity (
    id             : string,
    type           : MatrixType | string,
    content        : ReadonlyJsonObject,
    originServerTs : number,
    senderId       : string,
    roomId         : string
): RoomMessageEventEntity {
    return <RoomMessageEventEntity> createRoomEventEntity(
        id,
        type,
        content,
        originServerTs,
        senderId,
        roomId,
        undefined
    );
}

export function isRoomMessageEventEntity (value: any): value is RoomMessageEventEntity {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'id',
            'type',
            'originServerTs',
            'senderId',
            'roomId',
            'content'
        ])
        && isString(value?.id)
        && isString(value?.type)
        && isNumber(value?.originServerTs)
        && isString(value?.senderId)
        && isString(value?.roomId)
        && isJsonObject(value?.content)
    );
}

export function stringifyRoomMessageEventEntity (value: RoomMessageEventEntity): string {
    return `RoomMessageEvent(${value})`;
}

export function parseRoomMessageEventEntity (value: any): RoomMessageEventEntity | undefined {
    if ( isRoomMessageEventEntity(value) ) return value;
    return undefined;
}
