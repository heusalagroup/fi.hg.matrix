// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    explainNot,
    explainOk, explainOr,
    hasNoOtherKeysInDevelopment,
    isBooleanOrUndefined,
    isRegularObject,
    isString, isStringOrUndefined, isUndefined
} from "../../../../core/modules/lodash";
import { MatrixPreviousRoomDTO,  isMatrixPreviousRoomDTO } from "./types/MatrixPreviousRoomDTO";
import { MatrixType } from "../../core/MatrixType";

export interface MatrixRoomCreateEventDTO {
    readonly type           ?: MatrixType;
    readonly creator         : string;
    readonly [MatrixType.M_FEDERATE]   ?: boolean;
    readonly room_version   ?: string;
    readonly predecessor    ?: MatrixPreviousRoomDTO;
}

export function isMatrixCreationContentDTO (value: any): value is MatrixRoomCreateEventDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'creator',
            MatrixType.M_FEDERATE,
            'room_version',
            'predecessor'
        ])
        && isString(value?.creator)
        && isBooleanOrUndefined(value[MatrixType.M_FEDERATE])
        && isStringOrUndefined(value?.room_version)
        && ( isUndefined(value?.predecessor) || isMatrixPreviousRoomDTO(value?.predecessor) )
    );
}

export function isPartialMatrixCreationContentDTO (value: any): value is Partial<MatrixRoomCreateEventDTO> {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'creator',
            MatrixType.M_FEDERATE,
            'room_version',
            'predecessor'
        ])
        && isStringOrUndefined(value?.creator)
        && isBooleanOrUndefined(value[MatrixType.M_FEDERATE])
        && isStringOrUndefined(value?.room_version)
        && ( isUndefined(value?.predecessor) || isMatrixPreviousRoomDTO(value?.predecessor) )
    );
}


export function isPartialMatrixCreationContentDTOOrUndefined (value: any) : value is Partial<MatrixRoomCreateEventDTO> | undefined {
    return value === undefined || isPartialMatrixCreationContentDTO(value);
}

export function explainPartialMatrixCreationContentDTOOrUndefined (value: any) : string {
    return isPartialMatrixCreationContentDTOOrUndefined(value) ? explainOk() : explainNot( explainOr(['Partial<MatrixCreationContentDTO>', "undefined"]) );
}

export function stringifyMatrixCreationContentDTO (value: MatrixRoomCreateEventDTO): string {
    return `MatrixCreationContentDTO(${value})`;
}

export function parseMatrixCreationContentDTO (value: any): MatrixRoomCreateEventDTO | undefined {
    if ( isMatrixCreationContentDTO(value) ) return value;
    return undefined;
}


