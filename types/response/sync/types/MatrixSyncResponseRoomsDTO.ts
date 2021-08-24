// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import MatrixRoomId, { isMatrixRoomId } from "../../../core/MatrixRoomId";
import MatrixSyncResponseJoinedRoomDTO, {
    getEventsFromMatrixSyncResponseJoinedRoomDTO,
    isMatrixSyncResponseJoinedRoomDTO
} from "./MatrixSyncResponseJoinedRoomDTO";
import MatrixSyncResponseInvitedRoomDTO, {
    getEventsFromMatrixSyncResponseInvitedRoomDTO,
    isMatrixSyncResponseInvitedRoomDTO
} from "./MatrixSyncResponseInvitedRoomDTO";
import MatrixSyncResponseLeftRoomDTO, {
    getEventsFromMatrixSyncResponseLeftRoomDTO,
    isMatrixSyncResponseLeftRoomDTO
} from "./MatrixSyncResponseLeftRoomDTO";
import {
    concat,
    hasNoOtherKeys,
    isRegularObject,
    isRegularObjectOf, keys, map, reduce
} from "../../../../../ts/modules/lodash";
import MatrixSyncResponseEventDTO from "./MatrixSyncResponseEventDTO";
import MatrixSyncResponseAnyEventDTO from "./MatrixSyncResponseAnyEventDTO";
import MatrixSyncResponseRoomEventDTO from "./MatrixSyncResponseRoomEventDTO";
import MatrixSyncResponseStrippedStateDTO from "./MatrixSyncResponseStrippedStateDTO";
import MatrixSyncResponseStateEventDTO from "./MatrixSyncResponseStateEventDTO";

export interface MatrixSyncResponseRoomsDTO {
    readonly join   : {[K in MatrixRoomId]: MatrixSyncResponseJoinedRoomDTO};
    readonly invite : {[K in MatrixRoomId]: MatrixSyncResponseInvitedRoomDTO};
    readonly leave  : {[K in MatrixRoomId]: MatrixSyncResponseLeftRoomDTO};
}

interface getEventsCallback<T> {
    (value: T) : MatrixSyncResponseAnyEventDTO[];
}

function getEventsFromObject<T> (
    value    : {[K in MatrixRoomId]: T},
    callback : getEventsCallback<T>
) : MatrixSyncResponseAnyEventDTO[] {

    const propertyKeys : string[] = keys(value);

    return reduce(
        propertyKeys,
        (arr : MatrixSyncResponseAnyEventDTO[], key: string) : MatrixSyncResponseAnyEventDTO[] => {
            return concat(arr, callback(value[key]));
        },
        []
    );

}

export function getEventsFromMatrixSyncResponseRoomsDTO (
    value: MatrixSyncResponseRoomsDTO
) : (MatrixSyncResponseEventDTO|MatrixSyncResponseRoomEventDTO|MatrixSyncResponseStrippedStateDTO|MatrixSyncResponseStateEventDTO)[] {

    return concat(
        getEventsFromObject(value?.join   ?? {}, getEventsFromMatrixSyncResponseJoinedRoomDTO),
        getEventsFromObject(value?.invite ?? {}, getEventsFromMatrixSyncResponseInvitedRoomDTO),
        getEventsFromObject(value?.leave  ?? {}, getEventsFromMatrixSyncResponseLeftRoomDTO),
    );

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
