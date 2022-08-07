// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import {
    hasNoOtherKeys, isNumber,
    isRegularObject,
    isString,
    isStringOrUndefined
} from "../../../../../../core/modules/lodash";
import { isJsonObject, ReadonlyJsonObject } from "../../../../../../core/Json";
import { MatrixType } from "../../../../../types/core/MatrixType";

/**
 * The base type for events saved in the repository.
 */
export interface EventEntity {
    readonly id              : string;
    readonly type            : MatrixType | string;
    readonly content         : ReadonlyJsonObject;
    readonly originServerTs  : number;
    readonly senderId        : string;
    readonly roomId         ?: string;
    readonly stateKey       ?: string;
}

export function createEventEntity (
    id             : string,
    type           : MatrixType | string,
    content        : ReadonlyJsonObject,
    originServerTs : number,
    senderId       : string,
    roomId        ?: string,
    stateKey      ?: string
): EventEntity {
    return {
        id,
        type,
        originServerTs,
        senderId,
        roomId,
        content,
        stateKey
    };
}

export function isEventEntity (value: any): value is EventEntity {
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
        && isStringOrUndefined(value?.roomId)
        && isJsonObject(value?.content)
        && isStringOrUndefined(value?.stateKey)
    );
}

export function stringifyEventEntity (value: EventEntity): string {
    return `Event(${value})`;
}

export function parseEventEntity (value: any): EventEntity | undefined {
    if ( isEventEntity(value) ) return value;
    return undefined;
}
