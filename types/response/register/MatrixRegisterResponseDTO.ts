// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeys,
    isRegularObject,
    isString,
    isStringOrUndefined
} from "../../../../core/modules/lodash";

export interface MatrixRegisterResponseDTO {

    readonly user_id       : string;
    readonly access_token ?: string;

    /**
     * @deprecated Clients should extract the server_name from user_id
     */
    readonly home_server  ?: string;

    readonly device_id    ?: string;

}

export function isMatrixRegisterResponseDTO (value: any): value is MatrixRegisterResponseDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'user_id',
            'access_token',
            'home_server',
            'device_id'
        ])
        && isString(value?.user_id)
        && isStringOrUndefined(value?.access_token)
        && isStringOrUndefined(value?.home_server)
        && isStringOrUndefined(value?.device_id)
    );
}

export function stringifyMatrixRegisterResponseDTO (value: MatrixRegisterResponseDTO): string {
    return `MatrixRegisterResponseDTO(${value})`;
}

export function parseMatrixRegisterResponseDTO (value: any): MatrixRegisterResponseDTO | undefined {
    if ( isMatrixRegisterResponseDTO(value) ) return value;
    return undefined;
}

export default MatrixRegisterResponseDTO;
