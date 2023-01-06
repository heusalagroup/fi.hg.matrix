// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { MatrixJoinRoomThirdPartySignedDTO,  isMatrixJoinRoomThirdPartySignedDTO } from "./types/MatrixJoinRoomThirdPartySignedDTO";
import { isUndefined } from "../../../../core/types/undefined";
import { isRegularObject } from "../../../../core/types/RegularObject";
import { hasNoOtherKeysInDevelopment } from "../../../../core/types/OtherKeys";

export interface MatrixJoinRoomRequestDTO {

    readonly third_party_signed ?: MatrixJoinRoomThirdPartySignedDTO;

}

export function isMatrixJoinRoomRequestDTO (value: any): value is MatrixJoinRoomRequestDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'third_party_signed'
        ])
        && ( isUndefined(value?.third_party_signed) || isMatrixJoinRoomThirdPartySignedDTO(value?.third_party_signed) )
    );
}

export function stringifyMatrixJoinRoomRequestDTO (value: MatrixJoinRoomRequestDTO): string {
    return `MatrixJoinRoomRequestDTO(${value})`;
}

export function parseMatrixJoinRoomRequestDTO (value: any): MatrixJoinRoomRequestDTO | undefined {
    if ( isMatrixJoinRoomRequestDTO(value) ) return value;
    return undefined;
}


