// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
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

export function stringifyMatrixCreationContentDTO (value: MatrixRoomCreateEventDTO): string {
    return `MatrixCreationContentDTO(${value})`;
}

export function parseMatrixCreationContentDTO (value: any): MatrixRoomCreateEventDTO | undefined {
    if ( isMatrixCreationContentDTO(value) ) return value;
    return undefined;
}


