// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { hasNoOtherKeys, isRegularObject, isUndefined } from "../../../../../core/modules/lodash";
import {
    isMatrixIdentityServerInformationDTO,
    MatrixIdentityServerInformationDTO
} from "./MatrixIdentityServerInformationDTO";
import { isMatrixHomeServerDTO, MatrixHomeServerDTO } from "./MatrixHomeServerDTO";

export interface MatrixDiscoveryInformationDTO {

    readonly "m.homeserver": MatrixHomeServerDTO;
    readonly "m.identity_server": MatrixIdentityServerInformationDTO;

}

export function isMatrixDiscoveryInformationDTO (value: any): value is MatrixDiscoveryInformationDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, ["m.homeserver", "m.identity_server"])
        && isMatrixHomeServerDTO(value["m.homeserver"])
        && ( isUndefined(value["m.identity_server"]) || isMatrixIdentityServerInformationDTO(value["m.identity_server"]) )
    );
}

export function stringifyMatrixDiscoveryInformationDTO (value: MatrixDiscoveryInformationDTO): string {
    if ( !isMatrixDiscoveryInformationDTO(value) ) throw new TypeError(`Not MatrixWellKnownDTO: ${value}`);
    return `MatrixWellKnownDTO(${value})`;
}

export function parseMatrixDiscoveryInformationDTO (value: any): MatrixDiscoveryInformationDTO | undefined {
    if ( isMatrixDiscoveryInformationDTO(value) ) return value;
    return undefined;
}


