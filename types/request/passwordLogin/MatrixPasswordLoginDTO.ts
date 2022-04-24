// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { isMatrixIdentifierDTO, MatrixIdentifierDTO } from "../login/types/MatrixIdentifierDTO";
import { MatrixLoginType } from "../login/MatrixLoginType";
import { hasNoOtherKeysInDevelopment, isRegularObject, isString } from "../../../../core/modules/lodash";
import { MatrixLoginRequestDTO } from "../login/MatrixLoginRequestDTO";

export interface MatrixPasswordLoginDTO extends MatrixLoginRequestDTO {
    readonly type       : MatrixLoginType.M_LOGIN_PASSWORD;
    readonly identifier : MatrixIdentifierDTO;
    readonly password   : string;
}

export function createMatrixPasswordLoginDTO (
    identifier : MatrixIdentifierDTO,
    password   : string
): MatrixPasswordLoginDTO {
    return {
        type: MatrixLoginType.M_LOGIN_PASSWORD,
        identifier,
        password
    };
}

export function isMatrixPasswordLoginDTO (value: any): value is MatrixPasswordLoginDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'type',
            'identifier',
            'password'
        ])
        && value?.type === MatrixLoginType.M_LOGIN_PASSWORD
        && isMatrixIdentifierDTO(value?.identifier)
        && isString(value?.password)
    );
}

export function stringifyMatrixPasswordLoginDTO (value: MatrixPasswordLoginDTO): string {
    return `MatrixPasswordLoginDTO(${value})`;
}

export function parseMatrixPasswordLoginDTO (value: any): MatrixPasswordLoginDTO | undefined {
    if ( isMatrixPasswordLoginDTO(value) ) return value;
    return undefined;
}
