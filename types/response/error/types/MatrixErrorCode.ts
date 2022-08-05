// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

export enum MatrixErrorCode {
    M_USER_IN_USE      = "M_USER_IN_USE",
    M_UNKNOWN          = "M_UNKNOWN",
    M_UNKNOWN_TOKEN    = "M_UNKNOWN_TOKEN",
    M_INVALID_USERNAME = "M_INVALID_USERNAME",
    M_EXCLUSIVE        = "M_EXCLUSIVE",
    M_FORBIDDEN        = "M_FORBIDDEN",
    M_LIMIT_EXCEEDED   = "M_LIMIT_EXCEEDED"
}

export function isMatrixErrorCode (value: any): value is MatrixErrorCode {
    switch (value) {
        case MatrixErrorCode.M_UNKNOWN:
        case MatrixErrorCode.M_UNKNOWN_TOKEN:
        case MatrixErrorCode.M_USER_IN_USE:
        case MatrixErrorCode.M_INVALID_USERNAME:
        case MatrixErrorCode.M_EXCLUSIVE:
        case MatrixErrorCode.M_FORBIDDEN:
        case MatrixErrorCode.M_LIMIT_EXCEEDED:
            return true;
        default:
            return false;
    }
}

export function stringifyMatrixErrorCode (value: MatrixErrorCode): string {
    switch (value) {
        case MatrixErrorCode.M_UNKNOWN           : return 'M_UNKNOWN';
        case MatrixErrorCode.M_UNKNOWN_TOKEN           : return 'M_UNKNOWN_TOKEN';
        case MatrixErrorCode.M_USER_IN_USE       : return 'M_USER_IN_USE';
        case MatrixErrorCode.M_INVALID_USERNAME  : return 'M_INVALID_USERNAME';
        case MatrixErrorCode.M_EXCLUSIVE         : return 'M_EXCLUSIVE';
        case MatrixErrorCode.M_FORBIDDEN         : return 'M_FORBIDDEN';
        case MatrixErrorCode.M_LIMIT_EXCEEDED    : return 'M_LIMIT_EXCEEDED';
    }
    throw new TypeError(`Unsupported MatrixErrorCode value: ${value}`);
}

export function parseMatrixErrorCode (value: any): MatrixErrorCode | undefined {
    switch (value) {
        case 'M_UNKNOWN'          : return MatrixErrorCode.M_UNKNOWN;
        case 'M_UNKNOWN_TOKEN'          : return MatrixErrorCode.M_UNKNOWN_TOKEN;
        case 'M_USER_IN_USE'      : return MatrixErrorCode.M_USER_IN_USE;
        case 'M_INVALID_USERNAME' : return MatrixErrorCode.M_INVALID_USERNAME;
        case 'M_EXCLUSIVE'        : return MatrixErrorCode.M_EXCLUSIVE;
        case 'M_FORBIDDEN'        : return MatrixErrorCode.M_FORBIDDEN;
        case 'M_LIMIT_EXCEEDED'   : return MatrixErrorCode.M_LIMIT_EXCEEDED;
        default                   : return undefined;
    }
}
