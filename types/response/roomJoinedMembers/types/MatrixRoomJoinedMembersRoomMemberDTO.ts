// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeys,
    isNull,
    isRegularObject,
    isString
} from "../../../../../core/modules/lodash";

export interface MatrixRoomJoinedMembersRoomMemberDTO {
    readonly display_name : string;
    readonly avatar_url   : string | null;
}

export function isMatrixRoomJoinedMembersRoomMemberDTO (value: any): value is MatrixRoomJoinedMembersRoomMemberDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'display_name',
            'avatar_url'
        ])
        && isString(value?.display_name)
        && (isString(value?.avatar_url) || isNull(value?.avatar_url))
    );
}

export function stringifyMatrixRoomJoinedMembersRoomMemberDTO (value: MatrixRoomJoinedMembersRoomMemberDTO): string {
    return `MatrixRoomJoinedMembersRoomMemberDTO(${value})`;
}

export function parseMatrixRoomJoinedMembersRoomMemberDTO (value: any): MatrixRoomJoinedMembersRoomMemberDTO | undefined {
    if ( isMatrixRoomJoinedMembersRoomMemberDTO(value) ) return value;
    return undefined;
}


