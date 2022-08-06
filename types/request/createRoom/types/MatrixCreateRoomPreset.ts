// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { explainNot, explainOk, explainOr } from "../../../../../core/modules/lodash";

export enum MatrixCreateRoomPreset {
    PRIVATE_CHAT         = "private_chat",
    PUBLIC_CHAT          = "public_chat",
    TRUSTED_PRIVATE_CHAT = "trusted_private_chat"
}

export function isMatrixCreateRoomPreset (value: any): value is MatrixCreateRoomPreset {
    switch (value) {
        case MatrixCreateRoomPreset.PRIVATE_CHAT:
        case MatrixCreateRoomPreset.PUBLIC_CHAT:
        case MatrixCreateRoomPreset.TRUSTED_PRIVATE_CHAT:
            return true;
        default:
            return false;
    }
}

export function explainMatrixCreateRoomPreset (value: any): string {
    return isMatrixCreateRoomPreset(value) ? explainOk() : explainNot("MatrixCreateRoomPreset");
}

export function isMatrixCreateRoomPresetOrUndefined (value: any): value is MatrixCreateRoomPreset | undefined {
    return value === undefined || isMatrixCreateRoomPreset(value);
}

export function explainMatrixCreateRoomPresetOrUndefined (value: any): string {
    return isMatrixCreateRoomPresetOrUndefined(value) ? explainOk() : explainNot( explainOr(["MatrixCreateRoomPreset", "undefined"]));
}

export function stringifyMatrixCreateRoomPreset (value: MatrixCreateRoomPreset): string {
    switch (value) {
        case MatrixCreateRoomPreset.PRIVATE_CHAT         : return 'private_chat';
        case MatrixCreateRoomPreset.PUBLIC_CHAT          : return 'public_chat';
        case MatrixCreateRoomPreset.TRUSTED_PRIVATE_CHAT : return 'trusted_private_chat';
    }
    throw new TypeError(`Unsupported MatrixCreateRoomPreset value: ${value}`);
}

export function parseMatrixCreateRoomPreset (value: any): MatrixCreateRoomPreset | undefined {

    switch (value) {

        case MatrixCreateRoomPreset.PRIVATE_CHAT         : return MatrixCreateRoomPreset.PRIVATE_CHAT;
        case MatrixCreateRoomPreset.PUBLIC_CHAT          : return MatrixCreateRoomPreset.PUBLIC_CHAT;
        case MatrixCreateRoomPreset.TRUSTED_PRIVATE_CHAT : return MatrixCreateRoomPreset.TRUSTED_PRIVATE_CHAT;
        default    :
            return undefined;

    }

}


