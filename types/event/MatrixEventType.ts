// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

export enum MatrixEventType {
    M_ROOM_POWER_LEVELS = "m.room.power_levels"
}

export function isMatrixEventType (value: any): value is MatrixEventType {
    switch (value) {
        case MatrixEventType.M_ROOM_POWER_LEVELS:
            return true;

        default:
            return false;

    }
}

export function stringifyMatrixEventType (value: MatrixEventType): string {
    switch (value) {
        case MatrixEventType.M_ROOM_POWER_LEVELS: return MatrixEventType.M_ROOM_POWER_LEVELS;
    }
    throw new TypeError(`Unsupported MatrixEventType value: ${value}`);
}

export function parseMatrixEventType (value: any): MatrixEventType | undefined {

    switch (value.toLowerCase()) {

        case MatrixEventType.M_ROOM_POWER_LEVELS:
        case 'm_room_power_levels' :
            return MatrixEventType.M_ROOM_POWER_LEVELS;

        default    :
            return undefined;

    }

}


