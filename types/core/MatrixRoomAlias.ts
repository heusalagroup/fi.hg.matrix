// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { isString } from "../../../core/modules/lodash";

export type MatrixRoomAlias = string;

export function isMatrixRoomAlias (value: any): value is MatrixRoomAlias {
    return (
        isString(value)
        && !!value
        && value[0] === '#'
    );
}

export function stringifyMatrixRoomAlias (value: MatrixRoomAlias): string {
    return `MatrixRoomAlias(${value})`;
}

export function parseMatrixRoomAlias (value: any): MatrixRoomAlias | undefined {
    if ( isMatrixRoomAlias(value) ) return value;
    return undefined;
}


