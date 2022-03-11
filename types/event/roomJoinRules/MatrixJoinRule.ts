// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

export enum MatrixJoinRule {

    PUBLIC  = "public",
    KNOCK   = "knock",
    INVITE  = "invite",
    PRIVATE = "private",

    /**
     * Room v8 feature.
     * See https://github.com/matrix-org/matrix-doc/blob/master/proposals/3083-restricted-rooms.md
     */
    RESTRICTED = "restricted"

}

export function isMatrixJoinRule (value: any): value is MatrixJoinRule {
    switch (value) {

        case MatrixJoinRule.PUBLIC  :
        case MatrixJoinRule.KNOCK   :
        case MatrixJoinRule.INVITE  :
        case MatrixJoinRule.PRIVATE :
            return true;

        default: return false;

    }
}

export function stringifyMatrixJoinRule (value: MatrixJoinRule): string {
    switch (value) {
        case MatrixJoinRule.PUBLIC  : return 'PUBLIC';
        case MatrixJoinRule.KNOCK   : return 'KNOCK';
        case MatrixJoinRule.INVITE  : return 'INVITE';
        case MatrixJoinRule.PRIVATE : return 'PRIVATE';
    }
    throw new TypeError(`Unsupported MatrixJoinRule value: ${value}`);
}

export function parseMatrixJoinRule (value: any): MatrixJoinRule | undefined {

    switch (`${value}`.toUpperCase()) {

        case 'PUBLIC'   : return MatrixJoinRule.PUBLIC;
        case 'KNOCK'    : return MatrixJoinRule.KNOCK;
        case 'INVITE'   : return MatrixJoinRule.INVITE;
        case 'PRIVATE'  : return MatrixJoinRule.PRIVATE;
        default         : return undefined;

    }

}


