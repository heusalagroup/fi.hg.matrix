// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeys,
    isRegularObject, isStringOrUndefined,
    isUndefined
} from "../../../../ts/modules/lodash";
import MatrixRegisterAuthenticationData, { isMatrixRegisterAuthenticationData } from "./types/MatrixRegisterAuthenticationData";

export interface MatrixRegisterDTO {

    readonly auth                        ?: MatrixRegisterAuthenticationData;
    readonly username                    ?: string;
    readonly password                    ?: string;
    readonly device_id                   ?: string;
    readonly initial_device_display_name ?: string;
    readonly inhibit_login               ?: boolean;

}

export function isMatrixMatrixRegisterDTO (value: any): value is MatrixRegisterDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'auth',
            'username',
            'password',
            'device_id',
            'initial_device_display_name',
            'inhibit_login'
        ])
        && ( isUndefined(value?.auth) || isMatrixRegisterAuthenticationData(value?.auth) )
        && isStringOrUndefined(value?.username)
        && isStringOrUndefined(value?.password)
        && isStringOrUndefined(value?.device_id)
        && isStringOrUndefined(value?.initial_device_display_name)
        && isStringOrUndefined(value?.inhibit_login)
    );
}

export function stringifyMatrixMatrixRegisterDTO (value: MatrixRegisterDTO): string {
    return `MatrixMatrixRegisterDTO(${value})`;
}

export function parseMatrixMatrixRegisterDTO (value: any): MatrixRegisterDTO | undefined {
    if ( isMatrixMatrixRegisterDTO(value) ) return value;
    return undefined;
}

export default MatrixRegisterDTO;
