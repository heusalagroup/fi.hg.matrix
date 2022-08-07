// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { hasNoOtherKeys, isRegularObject, isString, isUndefined } from "../../../../core/modules/lodash";
import { isRoomMemberStateSignedDTO, RoomMemberStateSignedDTO } from "./RoomMemberStateSignedDTO";
import { ReadonlyJsonObject } from "../../../../core/Json";

export interface RoomMemberContent3rdPartyInviteDTO extends ReadonlyJsonObject {
    readonly display_name : string;
    readonly signed       : RoomMemberStateSignedDTO;
}

export function createRoomMemberContent3rdPartyInviteDTO (
    display_name: string,
    signed: RoomMemberStateSignedDTO
): RoomMemberContent3rdPartyInviteDTO {
    return {
        display_name,
        signed
    };
}

export function isRoomMemberContent3rdPartyInviteDTO (value: any): value is RoomMemberContent3rdPartyInviteDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'display_name',
            'signed'
        ])
        && isString(value?.display_name)
        && isRoomMemberStateSignedDTO(value?.signed)
    );
}

export function isRoomMemberContent3rdPartyInviteDTOOrUndefined (value: any): value is RoomMemberContent3rdPartyInviteDTO | undefined {
    return isUndefined(value) || isRoomMemberContent3rdPartyInviteDTO(value);
}

export function stringifyRoomMemberContent3rdPartyInviteDTO (value: RoomMemberContent3rdPartyInviteDTO): string {
    return `RoomMemberStateInviteDTO(${value})`;
}

export function parseRoomMemberContent3rdPartyInviteDTO (value: any): RoomMemberContent3rdPartyInviteDTO | undefined {
    if ( isRoomMemberContent3rdPartyInviteDTO(value) ) return value;
    return undefined;
}
