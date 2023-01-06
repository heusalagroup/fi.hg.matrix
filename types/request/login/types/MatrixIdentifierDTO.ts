// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { MatrixType } from "../../../core/MatrixType";
import { MatrixUserId } from "../../../core/MatrixUserId";
import { isString } from "../../../../../core/types/String";
import { isRegularObject } from "../../../../../core/types/RegularObject";
import { hasNoOtherKeysInDevelopment } from "../../../../../core/types/OtherKeys";

export interface MatrixIdentifierDTO {
    readonly type: MatrixType.M_ID_USER;
    readonly user: string | MatrixUserId;
}

export function createMatrixIdentifierDTO (
    user: string | MatrixUserId
): MatrixIdentifierDTO {
    return {
        type: MatrixType.M_ID_USER,
        user
    };
}

export function isMatrixIdentifierDTO (value: any): value is MatrixIdentifierDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'user',
            'type'
        ])
        && value?.type === MatrixType.M_ID_USER
        && isString(value?.user)
    );
}

export function stringifyMatrixIdentifierDTO (value: MatrixIdentifierDTO): string {
    return `MatrixIdentifierDTO(${value})`;
}

export function parseMatrixIdentifierDTO (value: any): MatrixIdentifierDTO | undefined {
    if ( isMatrixIdentifierDTO(value) ) return value;
    return undefined;
}
