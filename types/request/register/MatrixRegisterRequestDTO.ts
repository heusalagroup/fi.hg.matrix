// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeysInDevelopment,
    isRegularObject,
    isStringOrUndefined,
    isUndefined
} from "../../../../core/modules/lodash";
import { MatrixRegisterAuthenticationData,  isMatrixRegisterAuthenticationData } from "./types/MatrixRegisterAuthenticationData";

export interface MatrixRegisterRequestDTO {
    readonly auth                        ?: MatrixRegisterAuthenticationData;
    readonly username                    ?: string;
    readonly password                    ?: string;
    readonly device_id                   ?: string;
    readonly initial_device_display_name ?: string;
    readonly inhibit_login               ?: boolean;
}

export function createMatrixRegisterRequestDTO (
    auth                        ?: MatrixRegisterAuthenticationData,
    username                    ?: string,
    password                    ?: string,
    device_id                   ?: string,
    initial_device_display_name ?: string,
    inhibit_login               ?: boolean
) : MatrixRegisterRequestDTO {
    return {
        auth,
        username,
        password,
        device_id,
        initial_device_display_name,
        inhibit_login
    };
}

export function isMatrixMatrixRegisterRequestDTO (value: any): value is MatrixRegisterRequestDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
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

export function stringifyMatrixMatrixRegisterRequestDTO (value: MatrixRegisterRequestDTO): string {
    return `MatrixMatrixRegisterDTO(${value})`;
}

export function parseMatrixMatrixRegisterRequestDTO (value: any): MatrixRegisterRequestDTO | undefined {
    if ( isMatrixMatrixRegisterRequestDTO(value) ) return value;
    return undefined;
}


