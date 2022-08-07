// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { createRoomEventEntity, RoomEventEntity } from "./RoomEventEntity";
import { hasNoOtherKeys, isNumber, isRegularObject, isString } from "../../../../../../core/modules/lodash";
import { MatrixType } from "../../../../../types/core/MatrixType";
import { isReadonlyJsonObject, ReadonlyJsonObject } from "../../../../../../core/Json";

/**
 * Base type for room state events saved in the repository.
 */
export interface RoomStateEventEntity extends RoomEventEntity {
    readonly id              : string;
    readonly type            : MatrixType | string;
    readonly content         : ReadonlyJsonObject;
    readonly originServerTs  : number;
    readonly senderId        : string;
    readonly roomId          : string;
    readonly stateKey        : string;
}

export function createRoomStateEventEntity (
    id             : string,
    type           : MatrixType | string,
    content        : ReadonlyJsonObject,
    originServerTs : number,
    senderId       : string,
    roomId         : string,
    stateKey       : string,
): RoomStateEventEntity {
    return <RoomStateEventEntity> createRoomEventEntity(
        id,
        type,
        content,
        originServerTs,
        senderId,
        roomId,
        stateKey
    );
}

export function isRoomStateEvent (value: any): value is RoomStateEventEntity {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'id',
            'type',
            'originServerTs',
            'senderId',
            'roomId',
            'content',
            'stateKey'
        ])
        && isString(value?.id)
        && isString(value?.type)
        && isNumber(value?.originServerTs)
        && isString(value?.senderId)
        && isString(value?.roomId)
        && isReadonlyJsonObject(value?.content)
        && isString(value?.stateKey)
    );
}

export function stringifyRoomStateEvent (value: RoomStateEventEntity): string {
    return `RoomStateEvent(${value})`;
}

export function parseRoomStateEvent (value: any): RoomStateEventEntity | undefined {
    if ( isRoomStateEvent(value) ) return value;
    return undefined;
}
