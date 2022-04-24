// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { hasNoOtherKeys, isRegularObject, isString } from "../../../../core/modules/lodash";
import { isMatrixType, MatrixType } from "../../core/MatrixType";

/**
 * @see https://github.com/heusalagroup/hghs/issues/17
 */
export interface MatrixTextMessageDTO {
    readonly msgtype : MatrixType;
    readonly body    : string;
}

export function createMatrixTextMessageDTO (
    body: string
): MatrixTextMessageDTO {
    return {
        msgtype: MatrixType.M_TEXT,
        body
    };
}

export function isMatrixTextMessageDTO (value: any): value is MatrixTextMessageDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'msgtype',
            'body'
        ])
        && isMatrixType(value?.msgtype)
        && isString(value?.body)
    );
}

export function stringifyMatrixTextMessageDTO (value: MatrixTextMessageDTO): string {
    return `MatrixTextMessageDTO(${value})`;
}

export function parseMatrixTextMessageDTO (value: any): MatrixTextMessageDTO | undefined {
    if ( isMatrixTextMessageDTO(value) ) return value;
    return undefined;
}
