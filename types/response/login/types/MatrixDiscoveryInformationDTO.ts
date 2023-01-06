// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    isMatrixIdentityServerInformationDTO,
    MatrixIdentityServerInformationDTO
} from "./MatrixIdentityServerInformationDTO";
import { isMatrixHomeServerDTO, MatrixHomeServerDTO } from "./MatrixHomeServerDTO";
import { MatrixType } from "../../../core/MatrixType";
import { isUndefined } from "../../../../../core/types/undefined";
import { isRegularObject } from "../../../../../core/types/RegularObject";
import { hasNoOtherKeysInDevelopment } from "../../../../../core/types/OtherKeys";

export interface MatrixDiscoveryInformationDTO {
    readonly [MatrixType.M_HOMESERVER]: MatrixHomeServerDTO;
    readonly [MatrixType.M_IDENTITY_SERVER]: MatrixIdentityServerInformationDTO;
}

export function createMatrixDiscoveryInformationDTO (
    homeserverDto: MatrixHomeServerDTO,
    identityServerDto: MatrixIdentityServerInformationDTO
) : MatrixDiscoveryInformationDTO {
    return {
        [MatrixType.M_HOMESERVER]: homeserverDto,
        [MatrixType.M_IDENTITY_SERVER]: identityServerDto
    };
}

export function isMatrixDiscoveryInformationDTO (value: any): value is MatrixDiscoveryInformationDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [MatrixType.M_HOMESERVER, MatrixType.M_IDENTITY_SERVER])
        && isMatrixHomeServerDTO(value[MatrixType.M_HOMESERVER])
        && ( isUndefined(value[MatrixType.M_IDENTITY_SERVER]) || isMatrixIdentityServerInformationDTO(value[MatrixType.M_IDENTITY_SERVER]) )
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


