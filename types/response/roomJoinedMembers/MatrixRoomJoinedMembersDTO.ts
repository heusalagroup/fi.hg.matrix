// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { hasNoOtherKeys, isRegularObject, isRegularObjectOf } from "../../../../ts/modules/lodash";
import MatrixUserId, { isMatrixUserId } from "../../core/MatrixUserId";
import MatrixRoomJoinedMembersRoomMemberDTO, { isMatrixRoomJoinedMembersRoomMemberDTO } from "./types/MatrixRoomJoinedMembersRoomMemberDTO";

export interface MatrixRoomJoinedMembersDTO {
    readonly joined: {[P in MatrixUserId]: MatrixRoomJoinedMembersRoomMemberDTO}
}

export function isMatrixRoomJoinedMembersDTO (value: any): value is MatrixRoomJoinedMembersDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'joined'
        ])
        && isRegularObjectOf<MatrixUserId, MatrixRoomJoinedMembersRoomMemberDTO>(value?.joined, isMatrixUserId, isMatrixRoomJoinedMembersRoomMemberDTO)
    );
}

export function stringifyMatrixRoomJoinedMembersDTO (value: MatrixRoomJoinedMembersDTO): string {
    return `MatrixRoomJoinedMembersDTO(${value})`;
}

export function parseMatrixRoomJoinedMembersDTO (value: any): MatrixRoomJoinedMembersDTO | undefined {
    if ( isMatrixRoomJoinedMembersDTO(value) ) return value;
    return undefined;
}

export default MatrixRoomJoinedMembersDTO;
