// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

export enum MatrixErrorCode {
    M_USER_IN_USE      = "M_USER_IN_USE",
    M_INVALID_USERNAME = "M_INVALID_USERNAME",
    M_EXCLUSIVE        = "M_EXCLUSIVE"
}

export function isMatrixErrorCode (value: any): value is MatrixErrorCode {
    switch (value) {

        case MatrixErrorCode.M_USER_IN_USE:
            return true;

        default:
            return false;

    }
}

export function stringifyMatrixErrorCode (value: MatrixErrorCode): string {
    switch (value) {
        case MatrixErrorCode.M_USER_IN_USE  : return 'M_USER_IN_USE';
    }
    throw new TypeError(`Unsupported MatrixErrorCode value: ${value}`);
}

export function parseMatrixErrorCode (value: any): MatrixErrorCode | undefined {

    switch (value) {

        case 'M_USER_IN_USE' : return MatrixErrorCode.M_USER_IN_USE;
        default              : return undefined;

    }

}

export default MatrixErrorCode;
