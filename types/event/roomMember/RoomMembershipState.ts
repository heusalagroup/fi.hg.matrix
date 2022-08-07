// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

export enum RoomMembershipState {
    INVITE = "INVITE",
    JOIN = "JOIN",
    KNOCK = "KNOCK",
    LEAVE = "LEAVE",
    BAN = "BAN"
}

export function isRoomMembershipState (value: any): value is RoomMembershipState {
    switch (value) {
        case RoomMembershipState.INVITE:
        case RoomMembershipState.JOIN:
        case RoomMembershipState.KNOCK:
        case RoomMembershipState.LEAVE:
        case RoomMembershipState.BAN:
            return true;
        default:
            return false;
    }
}

export function stringifyRoomMembershipState (value: RoomMembershipState): string {
    switch (value) {
        case RoomMembershipState.INVITE : return 'INVITE';
        case RoomMembershipState.JOIN   : return 'JOIN';
        case RoomMembershipState.KNOCK  : return 'KNOCK';
        case RoomMembershipState.LEAVE  : return 'LEAVE';
        case RoomMembershipState.BAN    : return 'BAN';
    }
    throw new TypeError(`Unsupported RoomMembershipState value: ${value}`);
}

export function parseRoomMembershipState (value: any): RoomMembershipState | undefined {
    if (value === undefined) return undefined;
    switch (`${value}`.toUpperCase()) {
        case 'INVITE'  : return RoomMembershipState.INVITE;
        case 'JOIN'    : return RoomMembershipState.JOIN;
        case 'KNOCK'   : return RoomMembershipState.KNOCK;
        case 'LEAVE'   : return RoomMembershipState.LEAVE;
        case 'BAN'     : return RoomMembershipState.BAN;
        default        : return undefined;
    }
}
