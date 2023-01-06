// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { MatrixRoomId, explainMatrixRoomId, isMatrixRoomId } from "../../../core/MatrixRoomId";
import { MatrixSyncResponseJoinedRoomDTO,
    explainMatrixSyncResponseJoinedRoomDTO,
    getEventsFromMatrixSyncResponseJoinedRoomDTO,
    isMatrixSyncResponseJoinedRoomDTO
} from "./MatrixSyncResponseJoinedRoomDTO";
import { MatrixSyncResponseInvitedRoomDTO,
    explainMatrixSyncResponseInvitedRoomDTO,
    getEventsFromMatrixSyncResponseInvitedRoomDTO,
    isMatrixSyncResponseInvitedRoomDTO
} from "./MatrixSyncResponseInvitedRoomDTO";
import { MatrixSyncResponseLeftRoomDTO,
    getEventsFromMatrixSyncResponseLeftRoomDTO,
    isMatrixSyncResponseLeftRoomDTO
} from "./MatrixSyncResponseLeftRoomDTO";
import { concat } from "../../../../../core/functions/concat";
import { reduce } from "../../../../../core/functions/reduce";
import { MatrixSyncResponseAnyEventDTO } from "./MatrixSyncResponseAnyEventDTO";
import { isUndefined } from "../../../../../core/types/undefined";
import { explainRegularObjectOf, isRegularObject, isRegularObjectOf } from "../../../../../core/types/RegularObject";
import { explainNoOtherKeys, hasNoOtherKeysInDevelopment } from "../../../../../core/types/OtherKeys";
import { keys } from "../../../../../core/functions/keys";

export interface MatrixSyncResponseRoomsDTO {
    readonly join   ?: {[K in MatrixRoomId]: MatrixSyncResponseJoinedRoomDTO};
    readonly invite ?: {[K in MatrixRoomId]: MatrixSyncResponseInvitedRoomDTO};
    readonly leave  ?: {[K in MatrixRoomId]: MatrixSyncResponseLeftRoomDTO};
}

interface getEventsCallback<T> {
    (value: T) : readonly MatrixSyncResponseAnyEventDTO[];
}

function getEventsFromObject<T> (
    value    : {[K in MatrixRoomId]: T},
    callback : getEventsCallback<T>
) : readonly MatrixSyncResponseAnyEventDTO[] {
    const propertyKeys : readonly string[] = keys(value);
    return reduce(
        propertyKeys,
        (arr : readonly MatrixSyncResponseAnyEventDTO[], key: string) : readonly MatrixSyncResponseAnyEventDTO[] => {
            return concat(arr, callback(value[key]));
        },
        []
    );
}

export function getEventsFromMatrixSyncResponseRoomsDTO (
    value: MatrixSyncResponseRoomsDTO
) : readonly MatrixSyncResponseAnyEventDTO[] {
    return concat(
        [] as readonly MatrixSyncResponseAnyEventDTO[],
        getEventsFromObject(value?.join   ?? {}, getEventsFromMatrixSyncResponseJoinedRoomDTO),
        getEventsFromObject(value?.invite ?? {}, getEventsFromMatrixSyncResponseInvitedRoomDTO),
        getEventsFromObject(value?.leave  ?? {}, getEventsFromMatrixSyncResponseLeftRoomDTO),
    );
}

export function isMatrixSyncResponseRoomsDTO (value: any): value is MatrixSyncResponseRoomsDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'join',
            'invite',
            'peek',
            'leave'
        ])
        && ( isUndefined(value?.join)   || isRegularObjectOf<MatrixRoomId, MatrixSyncResponseJoinedRoomDTO>( value?.join,   isMatrixRoomId, isMatrixSyncResponseJoinedRoomDTO) )
        && ( isUndefined(value?.invite) || isRegularObjectOf<MatrixRoomId, MatrixSyncResponseInvitedRoomDTO>(value?.invite, isMatrixRoomId, isMatrixSyncResponseInvitedRoomDTO) )
        && ( isUndefined(value?.leave)  || isRegularObjectOf<MatrixRoomId, MatrixSyncResponseLeftRoomDTO>(   value?.leave,  isMatrixRoomId, isMatrixSyncResponseLeftRoomDTO) )
    );
}

export function assertMatrixSyncResponseRoomsDTO (value: any) : void {

    if(!( isRegularObject(value) )) {
        throw new TypeError(`value was not regular object`);
    }

    const propertyKeys = [
        'join',
        'invite',
        'leave',
        'peek'
    ];

    if(!( hasNoOtherKeysInDevelopment(value, propertyKeys) )) {
        throw new TypeError(`MatrixSyncResponseRoomsDTO: hasNoOtherKeysInDevelopment: ${explainNoOtherKeys(value, propertyKeys)}`);
    }

    if(!(
        isUndefined(value?.join)
        || isRegularObjectOf<MatrixRoomId, MatrixSyncResponseJoinedRoomDTO>(
            value?.join,
            isMatrixRoomId,
            isMatrixSyncResponseJoinedRoomDTO
        )
    )) {
        throw new TypeError(`Property "join" was invalid: ${
            explainRegularObjectOf<
                MatrixRoomId, 
                MatrixSyncResponseJoinedRoomDTO
            >(
                value?.join,
                isMatrixRoomId,
                isMatrixSyncResponseJoinedRoomDTO,
                explainMatrixRoomId,
                explainMatrixSyncResponseJoinedRoomDTO
            )
        }`);
    }

    if(!( ( isUndefined(value?.invite) || isRegularObjectOf<MatrixRoomId, MatrixSyncResponseInvitedRoomDTO>(value?.invite, isMatrixRoomId, isMatrixSyncResponseInvitedRoomDTO) ) )) {
        throw new TypeError(`Property "invite" was invalid: ${explainRegularObjectOf<MatrixRoomId, MatrixSyncResponseInvitedRoomDTO>(value?.invite, isMatrixRoomId, isMatrixSyncResponseInvitedRoomDTO, explainMatrixRoomId, explainMatrixSyncResponseInvitedRoomDTO)}`);
    }

    if(!( ( isUndefined(value?.leave)  || isRegularObjectOf<MatrixRoomId, MatrixSyncResponseLeftRoomDTO>(   value?.leave,  isMatrixRoomId, isMatrixSyncResponseLeftRoomDTO) ) )) {
        throw new TypeError(`Property "leave" was invalid`);
    }

}

export function explainMatrixSyncResponseRoomsDTO (value : any) : string {
    try {
        assertMatrixSyncResponseRoomsDTO(value);
        return 'No errors detected';
    } catch (err: any) {
        return err?.message;
    }
}

export function stringifyMatrixSyncResponseRoomsDTO (value: MatrixSyncResponseRoomsDTO): string {
    return `MatrixSyncResponseRoomsDTO(${value})`;
}

export function parseMatrixSyncResponseRoomsDTO (value: any): MatrixSyncResponseRoomsDTO | undefined {
    if ( isMatrixSyncResponseRoomsDTO(value) ) return value;
    return undefined;
}


