// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { isMatrixIdentifierDTO, MatrixIdentifierDTO } from "./types/MatrixIdentifierDTO";
import { isMatrixLoginType, MatrixLoginType } from "./MatrixLoginType";
import { hasNoOtherKeysInDevelopment, isRegularObject, isString, isStringOrUndefined, isUndefined } from "../../../../core/modules/lodash";
import { MatrixUserId } from "../../core/MatrixUserId";

export interface MatrixLoginRequestDTO {

    readonly type                         : MatrixLoginType;
    readonly identifier                  ?: MatrixIdentifierDTO;

    /**
     * Required when type is MatrixLoginType.M_LOGIN_PASSWORD
     */
    readonly password                    ?: string;

    readonly device_id                   ?: string;

    /**
     * Use `identifier`
     * @deprecated
     */
    readonly address                     ?: string;

    readonly initial_device_display_name ?: string;

    /**
     * Use `identifier`
     * @deprecated
     */
    readonly medium                      ?: string;

    /**
     * Required when type is MatrixLoginType.M_LOGIN_TOKEN
     */
    readonly token                       ?: string;

    /**
     * Use `identifier`
     * @deprecated
     */
    readonly user                        ?: MatrixUserId | string;

}

export function isMatrixLoginRequestDTO (value: any): value is MatrixLoginRequestDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'type',
            'identifier',
            'password',
            'device_id',
            'address',
            'initial_device_display_name',
            'medium',
            'token',
            'user'
        ])
        && isMatrixLoginType(value?.type)
        && (isUndefined(value?.identifier) || isMatrixIdentifierDTO(value?.identifier))
        && ( value?.type === MatrixLoginType.M_LOGIN_PASSWORD ? isString(value?.password) : isStringOrUndefined(value?.password) )
        && isStringOrUndefined(value?.device_id)
        && isStringOrUndefined(value?.address)
        && isStringOrUndefined(value?.initial_device_display_name)
        && isStringOrUndefined(value?.medium)
        && ( value?.type === MatrixLoginType.M_LOGIN_TOKEN ? isString(value?.token) : isStringOrUndefined(value?.token) )
        && isStringOrUndefined(value?.user)
    );
}

export function stringifyMatrixLoginRequestDTO (value: MatrixLoginRequestDTO): string {
    return `MatrixLoginRequestDTO(${value})`;
}

export function parseMatrixLoginRequestDTO (value: any): MatrixLoginRequestDTO | undefined {
    if ( isMatrixLoginRequestDTO(value) ) return value;
    return undefined;
}
