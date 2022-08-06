// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { explainNot, explainOk, explainOr } from "../../core/modules/lodash";

export enum MatrixRoomVersion {
    V1 = "1",
    V2 = "2",
    V3 = "3",
    V4 = "4",
    V5 = "5",
    V6 = "6",
    V7 = "7",
    V8 = "8",
    V9 = "9"
}

export function isMatrixRoomVersion (value: any): value is MatrixRoomVersion {
    switch (value) {
        case MatrixRoomVersion.V1:
        case MatrixRoomVersion.V2:
        case MatrixRoomVersion.V3:
        case MatrixRoomVersion.V4:
        case MatrixRoomVersion.V5:
        case MatrixRoomVersion.V6:
        case MatrixRoomVersion.V7:
        case MatrixRoomVersion.V8:
        case MatrixRoomVersion.V9:
            return true;

        default:
            return false;
    }
}

export function explainMatrixRoomVersion (value : any) : string {
    return isMatrixRoomVersion(value) ? explainOk() : explainNot("MatrixRoomVersion");
}

export function isMatrixRoomVersionOrUndefined (value: any): value is MatrixRoomVersion | undefined {
    return value === undefined || isMatrixRoomVersion(value);
}

export function explainMatrixRoomVersionOrUndefined (value : any) : string {
    return isMatrixRoomVersionOrUndefined(value) ? explainOk() : explainNot(explainOr(["MatrixRoomVersion", "undefined"]));
}

export function stringifyMatrixRoomVersion (value: MatrixRoomVersion): string {
    switch (value) {
        case MatrixRoomVersion.V1    : return '1';
        case MatrixRoomVersion.V2    : return '2';
        case MatrixRoomVersion.V3    : return '3';
        case MatrixRoomVersion.V4    : return '4';
        case MatrixRoomVersion.V5    : return '5';
        case MatrixRoomVersion.V6    : return '6';
        case MatrixRoomVersion.V7    : return '7';
        case MatrixRoomVersion.V8    : return '8';
        case MatrixRoomVersion.V9    : return '9';
    }
    throw new TypeError(`Unsupported MatrixRoomVersion value: ${value}`);
}

export function parseMatrixRoomVersion (value: any): MatrixRoomVersion | undefined {
    switch (`${value}`.toUpperCase()) {

        case "1":
        case "V1" : return MatrixRoomVersion.V1;

        case "2":
        case "V2" : return MatrixRoomVersion.V2;

        case "3":
        case "V3" : return MatrixRoomVersion.V3;

        case "4":
        case "V4" : return MatrixRoomVersion.V4;

        case "5":
        case "V5" : return MatrixRoomVersion.V5;

        case "6":
        case "V6" : return MatrixRoomVersion.V6;

        case "7":
        case "V7" : return MatrixRoomVersion.V7;

        case "8":
        case 'V8' : return MatrixRoomVersion.V8;

        case "9":
        case 'V9' : return MatrixRoomVersion.V9;

        default   : return undefined;

    }
}
