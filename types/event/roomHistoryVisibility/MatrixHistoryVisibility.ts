// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

export enum MatrixHistoryVisibility {
    INVITED         = "invited",
    JOINED          = "joined",
    SHARED          = "shared",
    WORLD_READABLE  = "world_readable",
}

export function isMatrixHistoryVisibility (value: any): value is MatrixHistoryVisibility {
    switch (value) {

        case MatrixHistoryVisibility.INVITED:
        case MatrixHistoryVisibility.JOINED:
        case MatrixHistoryVisibility.SHARED:
        case MatrixHistoryVisibility.WORLD_READABLE:
            return true;

        default:
            return false;

    }
}

export function stringifyMatrixHistoryVisibility (value: MatrixHistoryVisibility): string {
    switch (value) {
        case MatrixHistoryVisibility.INVITED         : return 'invited';
        case MatrixHistoryVisibility.JOINED          : return 'joined';
        case MatrixHistoryVisibility.SHARED          : return 'shared';
        case MatrixHistoryVisibility.WORLD_READABLE  : return 'world_readable';
    }
    throw new TypeError(`Unsupported MatrixHistoryVisibility value: ${value}`);
}

export function parseMatrixHistoryVisibility (value: any): MatrixHistoryVisibility | undefined {
    if (value === undefined) return undefined;
    switch (`${value}`.toUpperCase()) {
        case 'INVITED'        : return MatrixHistoryVisibility.INVITED;
        case 'JOINED'         : return MatrixHistoryVisibility.JOINED;
        case 'SHARED'         : return MatrixHistoryVisibility.SHARED;
        case 'WORLD_READABLE' : return MatrixHistoryVisibility.WORLD_READABLE;
        default               : return undefined;
    }
}


