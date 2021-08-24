// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { isString } from "../../../ts/modules/lodash";

export type MatrixRoomId = string;

export function isMatrixRoomId (value: any): value is MatrixRoomId {
    return (
        isString(value)
        && !!value
        && value[0] === '!'
    );
}

export function stringifyMatrixRoomId (value: MatrixRoomId): string {
    return `MatrixRoomId(${value})`;
}

export function parseMatrixRoomId (value: any): MatrixRoomId | undefined {
    if ( isMatrixRoomId(value) ) return value;
    return undefined;
}

export default MatrixRoomId;
