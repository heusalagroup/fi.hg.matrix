// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { explainNot, explainOk, explainOr } from "../../../../../core/types/explain";

export enum MatrixVisibility {
    PUBLIC  = "public",
    PRIVATE = "private"
}

export function isMatrixVisibility (value: any): value is MatrixVisibility {
    switch (value) {
        case MatrixVisibility.PUBLIC:
        case MatrixVisibility.PRIVATE:
            return true;
        default:
            return false;
    }
}

export function explainMatrixVisibility (value: any): string {
    return isMatrixVisibility(value) ? explainOk() : explainNot('MatrixVisibility');
}

export function isMatrixVisibilityOrUndefined (value: any): value is MatrixVisibility | undefined {
    if (value === undefined) return true;
    switch (value) {
        case MatrixVisibility.PUBLIC:
        case MatrixVisibility.PRIVATE:
            return true;
        default:
            return false;
    }
}

export function explainMatrixVisibilityOrUndefined (value: any): string {
    return isMatrixVisibilityOrUndefined(value) ? explainOk() : explainNot(explainOr(['MatrixVisibility', 'undefined']));
}

export function stringifyMatrixVisibility (value: MatrixVisibility): string {
    switch (value) {
        case MatrixVisibility.PUBLIC  :
            return 'public';
        case MatrixVisibility.PRIVATE  :
            return 'private';
    }
    throw new TypeError(`Unsupported MatrixVisibility value: ${value}`);
}

export function parseMatrixVisibility (value: any): MatrixVisibility | undefined {
    if (value === undefined) return undefined;
    switch (`${value}`.toUpperCase()) {
        case 'PRIVATE' : return MatrixVisibility.PRIVATE;
        case 'PUBLIC'  : return MatrixVisibility.PUBLIC;
        default        : return undefined;
    }
}


