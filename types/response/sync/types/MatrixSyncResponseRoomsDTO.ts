// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import MatrixRoomId, { isMatrixRoomId } from "../../../core/MatrixRoomId";
import MatrixSyncResponseJoinedRoomDTO, { isMatrixSyncResponseJoinedRoomDTO } from "./MatrixSyncResponseJoinedRoomDTO";
import MatrixSyncResponseInvitedRoomDTO, { isMatrixSyncResponseInvitedRoomDTO } from "./MatrixSyncResponseInvitedRoomDTO";
import MatrixSyncResponseLeftRoomDTO, { isMatrixSyncResponseLeftRoomDTO } from "./MatrixSyncResponseLeftRoomDTO";
import {
    hasNoOtherKeys,
    isRegularObject,
    isRegularObjectOf
} from "../../../../../ts/modules/lodash";

export interface MatrixSyncResponseRoomsDTO {
    readonly join   : {[K in MatrixRoomId]: MatrixSyncResponseJoinedRoomDTO};
    readonly invite : {[K in MatrixRoomId]: MatrixSyncResponseInvitedRoomDTO};
    readonly leave  : {[K in MatrixRoomId]: MatrixSyncResponseLeftRoomDTO};
}

export function isMatrixSyncResponseRoomsDTO (value: any): value is MatrixSyncResponseRoomsDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'join',
            'invite',
            'leave'
        ])
        && isRegularObjectOf<MatrixRoomId, MatrixSyncResponseJoinedRoomDTO>( value?.join,   isMatrixRoomId, isMatrixSyncResponseJoinedRoomDTO)
        && isRegularObjectOf<MatrixRoomId, MatrixSyncResponseInvitedRoomDTO>(value?.invite, isMatrixRoomId, isMatrixSyncResponseInvitedRoomDTO)
        && isRegularObjectOf<MatrixRoomId, MatrixSyncResponseLeftRoomDTO>(   value?.leave,  isMatrixRoomId, isMatrixSyncResponseLeftRoomDTO)
    );
}

export function stringifyMatrixSyncResponseRoomsDTO (value: MatrixSyncResponseRoomsDTO): string {
    return `MatrixSyncResponseRoomsDTO(${value})`;
}

export function parseMatrixSyncResponseRoomsDTO (value: any): MatrixSyncResponseRoomsDTO | undefined {
    if ( isMatrixSyncResponseRoomsDTO(value) ) return value;
    return undefined;
}

export default MatrixSyncResponseRoomsDTO;
