// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { MatrixIdentifierDTO } from "../login/types/MatrixIdentifierDTO";
import { MatrixLoginType } from "../login/MatrixLoginType";
import { isMatrixLoginRequestDTO, MatrixLoginRequestDTO } from "../login/MatrixLoginRequestDTO";

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
        isMatrixLoginRequestDTO(value)
        && value?.type === MatrixLoginType.M_LOGIN_PASSWORD
    );
}

export function stringifyMatrixPasswordLoginDTO (value: MatrixPasswordLoginDTO): string {
    return `MatrixPasswordLoginDTO(${value})`;
}

export function parseMatrixPasswordLoginDTO (value: any): MatrixPasswordLoginDTO | undefined {
    if ( isMatrixPasswordLoginDTO(value) ) return value;
    return undefined;
}
