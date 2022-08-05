// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

/**
 * Part of the login end point request `MatrixPasswordLoginDTO`.
 *
 * @see https://github.com/heusalagroup/hghs/issues/3
 */
export enum MatrixLoginType {
    M_LOGIN_PASSWORD = 'm.login.password',
    M_LOGIN_TOKEN    = 'm.login.token'
}

export function isMatrixLoginType (value: any): value is MatrixLoginType {
    switch (value) {
        case MatrixLoginType.M_LOGIN_PASSWORD:
        case MatrixLoginType.M_LOGIN_TOKEN:
            return true;

        default:
            return false;

    }
}

export function stringifyMatrixLoginType (value: MatrixLoginType): string {
    switch (value) {
        case MatrixLoginType.M_LOGIN_PASSWORD  : return 'm.login.password';
        case MatrixLoginType.M_LOGIN_TOKEN     : return 'm.login.token';
    }
    throw new TypeError(`Unsupported MatrixLoginType value: ${value}`);
}

export function parseMatrixLoginType (value: any): MatrixLoginType | undefined {

    switch (`${value}`.toLowerCase()) {

        case 'm.login.password':
        case 'm_login_password' : return MatrixLoginType.M_LOGIN_PASSWORD;

        case 'm.login.token':
        case 'm_login_token'    : return MatrixLoginType.M_LOGIN_TOKEN;

        default                 : return undefined;

    }

}
