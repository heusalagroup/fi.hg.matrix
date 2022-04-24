// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { MatrixIdentifierDTO } from "../login/types/MatrixIdentifierDTO";
import { MatrixLoginType } from "../login/MatrixLoginType";
import { isMatrixLoginRequestDTO, MatrixLoginRequestDTO } from "../login/MatrixLoginRequestDTO";

export interface MatrixPasswordLoginRequestDTO extends MatrixLoginRequestDTO {
    readonly type       : MatrixLoginType.M_LOGIN_PASSWORD;
    readonly identifier : MatrixIdentifierDTO;
    readonly password   : string;
}

export function createMatrixPasswordLoginRequestDTO (
    identifier : MatrixIdentifierDTO,
    password   : string
): MatrixPasswordLoginRequestDTO {
    return {
        type: MatrixLoginType.M_LOGIN_PASSWORD,
        identifier,
        password
    };
}

export function isMatrixPasswordLoginRequestDTO (value: any): value is MatrixPasswordLoginRequestDTO {
    return (
        isMatrixLoginRequestDTO(value)
        && value?.type === MatrixLoginType.M_LOGIN_PASSWORD
    );
}

export function stringifyMatrixPasswordLoginRequestDTO (value: MatrixPasswordLoginRequestDTO): string {
    return `MatrixPasswordLoginDTO(${value})`;
}

export function parseMatrixPasswordLoginRequestDTO (value: any): MatrixPasswordLoginRequestDTO | undefined {
    if ( isMatrixPasswordLoginRequestDTO(value) ) return value;
    return undefined;
}
