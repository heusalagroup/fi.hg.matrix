// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { isNull } from "../../../../core/types/Null";
import { ReadonlyJsonObject } from "../../../../core/Json";
import { isRoomMembershipState, RoomMembershipState } from "./RoomMembershipState";
import { isRoomMemberContent3rdPartyInviteDTOOrUndefined, RoomMemberContent3rdPartyInviteDTO } from "./RoomMemberContent3rdPartyInviteDTO";
import { isBooleanOrUndefined } from "../../../../core/types/Boolean";
import { isStringOrUndefined } from "../../../../core/types/String";
import { isRegularObject } from "../../../../core/types/RegularObject";
import { hasNoOtherKeys } from "../../../../core/types/OtherKeys";

export interface RoomMemberContentDTO extends ReadonlyJsonObject {
    readonly membership                        : RoomMembershipState;
    readonly avatar_url                       ?: string;
    readonly displayname                      ?: string | null;
    readonly is_direct                        ?: boolean;
    readonly join_authorised_via_users_server ?: string;
    readonly reason                           ?: string;
    readonly third_party_invite               ?: RoomMemberContent3rdPartyInviteDTO;
}

export function createRoomMemberContentDTO (
    membership                        : RoomMembershipState,
    reason                           ?: string | undefined,
    avatar_url                       ?: string | undefined,
    displayname                      ?: string | null | undefined,
    is_direct                        ?: boolean | undefined,
    join_authorised_via_users_server ?: string | undefined,
    third_party_invite               ?: RoomMemberContent3rdPartyInviteDTO
): RoomMemberContentDTO {
    return {
        avatar_url,
        displayname,
        is_direct,
        join_authorised_via_users_server,
        membership,
        reason,
        third_party_invite
    };
}

export function isRoomMemberContentDTO (value: any): value is RoomMemberContentDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'membership',
            'avatar_url',
            'displayname',
            'is_direct',
            'join_authorised_via_users_server',
            'reason',
            'third_party_invite'
        ])
        && isRoomMembershipState(value?.membership)
        && isStringOrUndefined(value?.avatar_url)
        && (isStringOrUndefined(value?.displayname) || isNull(value?.displayname))
        && isBooleanOrUndefined(value?.is_direct)
        && isStringOrUndefined(value?.join_authorised_via_users_server)
        && isStringOrUndefined(value?.reason)
        && isRoomMemberContent3rdPartyInviteDTOOrUndefined(value?.third_party_invite)
    );
}

export function stringifyRoomMemberContentDTO (value: RoomMemberContentDTO): string {
    return `RoomMemberContentDTO(${value})`;
}

export function parseRoomMemberContentDTO (value: any): RoomMemberContentDTO | undefined {
    if ( isRoomMemberContentDTO(value) ) return value;
    return undefined;
}
