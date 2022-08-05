// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

export enum RoomMembershipType {

    /**
     * There is also MatrixType.M_ROOM_MEMBERSHIP but that should not be used.
     */
    M_ROOM_MEMBERSHIP = "m.room_membership"

}

export function isRoomMembershipType (value: any): value is RoomMembershipType {
    switch (value) {
        case RoomMembershipType.M_ROOM_MEMBERSHIP:
            return true;

        default:
            return false;

    }
}

export function stringifyRoomMembershipType (value: RoomMembershipType): string {
    switch (value) {
        case RoomMembershipType.M_ROOM_MEMBERSHIP  : return 'm.room_membership';
    }
    throw new TypeError(`Unsupported RoomMembershipType value: ${value}`);
}

export function parseRoomMembershipType (value: any): RoomMembershipType | undefined {
    switch (`${value}`.toLowerCase()) {

        case 'm.room_membership':
        case 'room_membership' : return RoomMembershipType.M_ROOM_MEMBERSHIP;

        default                : return undefined;
    }
}
