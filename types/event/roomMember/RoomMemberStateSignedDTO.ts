// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { hasNoOtherKeys, isRegularObject, isString } from "../../../../core/modules/lodash";
import { isReadonlyJsonObject, ReadonlyJsonObject } from "../../../../core/Json";

export interface RoomMemberStateSignedDTO extends ReadonlyJsonObject {
    readonly mxid : string;
    readonly signatures : ReadonlyJsonObject;
    readonly token : string;
}

export function createRoomMemberStateSignedDTO (
    mxid: string,
    signatures: ReadonlyJsonObject,
    token : string
): RoomMemberStateSignedDTO {
    return {
        mxid,
        signatures,
        token
    };
}

export function isRoomMemberStateSignedDTO (value: any): value is RoomMemberStateSignedDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'mxid',
            'signatures',
            'token'
        ])
        && isString(value?.mxid)
        && isReadonlyJsonObject(value?.signatures)
        && isString(value?.token)
    );
}

export function stringifyRoomMemberStateSignedDTO (value: RoomMemberStateSignedDTO): string {
    return `RoomMemberStateSignedDTO(${value})`;
}

export function parseRoomMemberStateSignedDTO (value: any): RoomMemberStateSignedDTO | undefined {
    if ( isRoomMemberStateSignedDTO(value) ) return value;
    return undefined;
}
