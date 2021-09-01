// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

export enum MatrixErrorCode {
    M_USER_IN_USE      = "M_USER_IN_USE",
    M_INVALID_USERNAME = "M_INVALID_USERNAME",
    M_EXCLUSIVE        = "M_EXCLUSIVE",
    M_FORBIDDEN        = "M_FORBIDDEN"
}

export function isMatrixErrorCode (value: any): value is MatrixErrorCode {
    switch (value) {

        case MatrixErrorCode.M_USER_IN_USE:
        case MatrixErrorCode.M_INVALID_USERNAME:
        case MatrixErrorCode.M_EXCLUSIVE:
        case MatrixErrorCode.M_FORBIDDEN:
            return true;

        default:
            return false;

    }
}

export function stringifyMatrixErrorCode (value: MatrixErrorCode): string {
    switch (value) {
        case MatrixErrorCode.M_USER_IN_USE       : return 'M_USER_IN_USE';
        case MatrixErrorCode.M_INVALID_USERNAME  : return 'M_INVALID_USERNAME';
        case MatrixErrorCode.M_EXCLUSIVE         : return 'M_EXCLUSIVE';
        case MatrixErrorCode.M_FORBIDDEN         : return 'M_FORBIDDEN';
    }
    throw new TypeError(`Unsupported MatrixErrorCode value: ${value}`);
}

export function parseMatrixErrorCode (value: any): MatrixErrorCode | undefined {

    switch (value) {

        case 'M_USER_IN_USE'      : return MatrixErrorCode.M_USER_IN_USE;
        case 'M_INVALID_USERNAME' : return MatrixErrorCode.M_INVALID_USERNAME;
        case 'M_EXCLUSIVE'        : return MatrixErrorCode.M_EXCLUSIVE;
        case 'M_FORBIDDEN'        : return MatrixErrorCode.M_FORBIDDEN;
        default                   : return undefined;

    }

}

export default MatrixErrorCode;
