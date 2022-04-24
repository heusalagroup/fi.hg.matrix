// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { MatrixIdentifierDTO } from "./types/MatrixIdentifierDTO";
import { isMatrixLoginType, MatrixLoginType } from "./MatrixLoginType";
import { hasNoOtherKeysInDevelopment, isRegularObject, isString } from "../../../../core/modules/lodash";

export interface MatrixLoginRequestDTO {
    readonly type        : MatrixLoginType;
    readonly identifier ?: MatrixIdentifierDTO;
    readonly password   ?: string;
}

export function isMatrixLoginRequestDTO (value: any): value is MatrixLoginRequestDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'type',
            'identifier',
            'password'
        ])
        && isMatrixLoginType(MatrixLoginType.M_LOGIN_PASSWORD)
    );
}

export function stringifyMatrixLoginRequestDTO (value: MatrixLoginRequestDTO): string {
    return `MatrixLoginRequestDTO(${value})`;
}

export function parseMatrixLoginRequestDTO (value: any): MatrixLoginRequestDTO | undefined {
    if ( isMatrixLoginRequestDTO(value) ) return value;
    return undefined;
}
