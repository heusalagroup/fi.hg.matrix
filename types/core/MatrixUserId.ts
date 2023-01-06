// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { explainNot, explainOk } from "../../../core/types/explain";
import { isString } from "../../../core/types/String";

/**
 * Size must not exceed 255 bytes.
 */
export type MatrixUserId = string;

export function isMatrixUserId (value: any): value is MatrixUserId {
    return (
        isString(value)
        && !!value
        && value[0] === '@'
    );
}

export function explainMatrixUserId (value: any) : string {
    return isMatrixUserId(value) ? explainOk() : explainNot('MatrixUserId');
}

export function stringifyMatrixUserId (value: MatrixUserId): string {
    return `MatrixUserId(${value})`;
}

export function parseMatrixUserId (value: any): MatrixUserId | undefined {
    if ( isMatrixUserId(value) ) return value;
    return undefined;
}


