// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    MatrixDiscoveryInformationDTO,
    isMatrixDiscoveryInformationDTO
} from "./types/MatrixDiscoveryInformationDTO";
import {
    hasNoOtherKeysInDevelopment,
    isRegularObject,
    isString,
    isStringOrUndefined,
    isUndefined
} from "../../../../core/modules/lodash";
import { MatrixUserId } from "../../core/MatrixUserId";

export interface MatrixLoginResponseDTO {

    readonly user_id      : MatrixUserId | string;
    readonly access_token : string;

    /**
     * Clients should extract the server_name from user_id
     * @deprecated
     */
    readonly home_server  ?: string;

    readonly device_id     : string;
    readonly well_known   ?: MatrixDiscoveryInformationDTO;

}

export function createMatrixLoginResponseDTO (
    user_id       : MatrixUserId | string,
    access_token  : string,
    home_server   : string | undefined,
    device_id     : string,
    well_known    : MatrixDiscoveryInformationDTO | undefined
) : MatrixLoginResponseDTO {
    return {
        user_id,
        access_token,
        home_server,
        device_id,
        well_known
    };
}

export function isMatrixLoginResponseDTO (value: any): value is MatrixLoginResponseDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, ['user_id', 'access_token', 'home_server', 'device_id', 'well_known'])
        && isString(value?.user_id)
        && isString(value?.access_token)
        && isStringOrUndefined(value?.home_server)
        && isStringOrUndefined(value?.device_id)
        && ( isUndefined(value?.MatrixWellKnownDTO) || isMatrixDiscoveryInformationDTO(value))
    );
}

export function stringifyMatrixLoginResponseDTO (value: MatrixLoginResponseDTO): string {
    if ( !isMatrixLoginResponseDTO(value) ) throw new TypeError(`Not MatrixLoginResponseDTO: ${value}`);
    return `MatrixLoginResponseDTO(${value})`;
}

export function parseMatrixLoginResponseDTO (value: any): MatrixLoginResponseDTO | undefined {
    if ( isMatrixLoginResponseDTO(value) ) return value;
    return undefined;
}


