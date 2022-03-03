// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import MatrixDiscoveryInformationDTO, {
    isMatrixDiscoveryInformationDTO
} from "./types/MatrixDiscoveryInformationDTO";
import {
    hasNoOtherKeys,
    isRegularObject,
    isString,
    isStringOrUndefined,
    isUndefined
} from "../../../../core/modules/lodash";

export interface MatrixLoginResponseDTO {

    readonly user_id      : string;
    readonly access_token : string;

    /**
     * Clients should extract the server_name from user_id
     * @deprecated
     */
    readonly home_server  ?: string;

    readonly device_id     : string;
    readonly well_known   ?: MatrixDiscoveryInformationDTO;

}

export function isMatrixLoginResponseDTO (value: any): value is MatrixLoginResponseDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, ['user_id', 'access_token', 'home_server', 'device_id', 'well_known'])
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

export default MatrixLoginResponseDTO;
