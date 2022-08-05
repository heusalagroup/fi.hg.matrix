// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { hasNoOtherKeysInDevelopment, isRegularObject, isString } from "../../../../../core/modules/lodash";
import { MatrixUserId,  isMatrixUserId } from "../../../core/MatrixUserId";
import { isJsonObject, JsonObject } from "../../../../../core/Json";

export interface MatrixJoinRoomThirdPartySignedDTO {

    readonly sender      : MatrixUserId;
    readonly mxid        : MatrixUserId;
    readonly token       : string;

    // TODO: define MatrixSignaturesDTO
    readonly signatures  : JsonObject;

}

export function isMatrixJoinRoomThirdPartySignedDTO (value: any): value is MatrixJoinRoomThirdPartySignedDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'sender',
            'mxid',
            'token',
            'signatures'
        ])
        && isMatrixUserId(value?.sender)
        && isMatrixUserId(value?.mxid)
        && isString(value?.token)
        && isJsonObject(value?.signatures)
    );
}

export function stringifyMatrixJoinRoomThirdPartySignedDTO (value: MatrixJoinRoomThirdPartySignedDTO): string {
    return `MatrixJoinRoomThirdPartySignedDTO(${value})`;
}

export function parseMatrixJoinRoomThirdPartySignedDTO (value: any): MatrixJoinRoomThirdPartySignedDTO | undefined {
    if ( isMatrixJoinRoomThirdPartySignedDTO(value) ) return value;
    return undefined;
}


