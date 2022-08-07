// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { MatrixRoomAlias } from "./types/core/MatrixRoomAlias";
import { MatrixUserId } from "./types/core/MatrixUserId";
import { MatrixRoomId } from "./types/core/MatrixRoomId";
import { MatrixCreateRoomPreset } from "./types/request/createRoom/types/MatrixCreateRoomPreset";
import { MatrixVisibility } from "./types/request/createRoom/types/MatrixVisibility";
import { MatrixStateEvent } from "./types/core/MatrixStateEvent";
import { LogService } from "../core/LogService";
import { createRoomJoinRulesStateEventDTO, RoomJoinRulesStateEventDTO } from "./types/event/roomJoinRules/RoomJoinRulesStateEventDTO";
import { createRoomJoinRulesStateContentDTO } from "./types/event/roomJoinRules/RoomJoinRulesStateContentDTO";
import { MatrixJoinRule } from "./types/event/roomJoinRules/MatrixJoinRule";
import { createRoomJoinRulesAllowConditionDTO } from "./types/event/roomJoinRules/RoomJoinRulesAllowConditionDTO";
import { RoomMembershipType } from "./types/event/roomJoinRules/RoomMembershipType";
import { createRoomHistoryVisibilityStateEventDTO, RoomHistoryVisibilityStateEventDTO } from "./types/event/roomHistoryVisibility/RoomHistoryVisibilityStateEventDTO";
import { createRoomHistoryVisibilityStateContentDTO } from "./types/event/roomHistoryVisibility/RoomHistoryVisibilityStateContentDTO";
import { MatrixHistoryVisibility } from "./types/event/roomHistoryVisibility/MatrixHistoryVisibility";
import { createRoomGuestAccessStateEventDTO, RoomGuestAccessStateEventDTO } from "./types/event/roomGuestAccess/RoomGuestAccessStateEventDTO";
import { createRoomGuestAccessContentDTO } from "./types/event/roomGuestAccess/RoomGuestAccessContentDTO";
import { MatrixGuestAccess } from "./types/event/roomGuestAccess/MatrixGuestAccess";
import { createRoomMemberStateEventDTO, RoomMemberStateEventDTO } from "./types/event/roomMember/RoomMemberStateEventDTO";
import { createRoomMemberContentDTO } from "./types/event/roomMember/RoomMemberContentDTO";
import { RoomMembershipState } from "./types/event/roomMember/RoomMembershipState";
import { RoomMemberContent3rdPartyInviteDTO } from "./types/event/roomMember/RoomMemberContent3rdPartyInviteDTO";

const LOG = LogService.createLogger('MatrixUtils');

export class MatrixUtils {

    public static getUserId (
        username: string,
        hostname: string
    ) : MatrixUserId {
        return `@${username}:${hostname}`;
    }

    public static getRoomAlias (
        alias: string,
        hostname: string
    ) : MatrixRoomAlias {
        return `#${alias}:${hostname}`;
    }

    public static getRoomId (
        id: string,
        hostname: string
    ) : MatrixRoomId {
        return `!${id}:${hostname}`;
    }

    /**
     * Get default preset from visibility setting
     *
     * @param visibility
     * @see https://spec.matrix.org/v1.2/client-server-api/#post_matrixclientv3createroom
     */
    public static getRoomPresetFromVisibility (
        visibility : MatrixVisibility
    ) : MatrixCreateRoomPreset {
        switch (visibility) {
            case MatrixVisibility.PUBLIC  : return MatrixCreateRoomPreset.PUBLIC_CHAT;
            default:
            case MatrixVisibility.PRIVATE : return MatrixCreateRoomPreset.PRIVATE_CHAT;
        }
    }

    public static createRoomJoinRulesEventDTO (
        roomId : string,
        joinRule: MatrixJoinRule
    ) : RoomJoinRulesStateEventDTO {
        return createRoomJoinRulesStateEventDTO(
            createRoomJoinRulesStateContentDTO(
                joinRule,
                [
                    createRoomJoinRulesAllowConditionDTO(
                        RoomMembershipType.M_ROOM_MEMBERSHIP,
                        roomId
                    )
                ]
            )
        );
    }

    public static createRoomHistoryVisibilityEventDTO (
        visibility: MatrixHistoryVisibility
    ) : RoomHistoryVisibilityStateEventDTO {
        return createRoomHistoryVisibilityStateEventDTO(
            createRoomHistoryVisibilityStateContentDTO(
                visibility
            )
        );
    }

    public static createRoomGuestAccessEventDTO (
        access: MatrixGuestAccess
    ) : RoomGuestAccessStateEventDTO {
        return createRoomGuestAccessStateEventDTO(
            createRoomGuestAccessContentDTO(access)
        );
    }

    public static createRoomMemberEventDTO (
        userId                            : string,
        membership                        : RoomMembershipState,
        reason                           ?: string | undefined,
        avatar_url                       ?: string | undefined,
        displayname                      ?: string | null | undefined,
        is_direct                        ?: boolean | undefined,
        join_authorised_via_users_server ?: string | undefined,
        third_party_invite               ?: RoomMemberContent3rdPartyInviteDTO
    ) : RoomMemberStateEventDTO {
        return createRoomMemberStateEventDTO(
            userId,
            createRoomMemberContentDTO(
                membership,
                reason,
                avatar_url,
                displayname,
                is_direct,
                join_authorised_via_users_server,
                third_party_invite
            )
        );
    }

    /**
     * Get initial room state events for specific preset
     *
     * @param roomId
     * @param preset
     * @see https://spec.matrix.org/v1.2/client-server-api/#post_matrixclientv3createroom
     */
    public static getRoomStateEventsFromPreset (
        roomId : string,
        preset : MatrixCreateRoomPreset
    ) : readonly MatrixStateEvent[] {
        switch (preset) {

            case MatrixCreateRoomPreset.PRIVATE_CHAT:
                return [
                    this.createRoomJoinRulesEventDTO(roomId, MatrixJoinRule.INVITE),
                    this.createRoomHistoryVisibilityEventDTO(MatrixHistoryVisibility.SHARED),
                    this.createRoomGuestAccessEventDTO(MatrixGuestAccess.CAN_JOIN)
                ];

            case MatrixCreateRoomPreset.PUBLIC_CHAT:
                return [
                    this.createRoomJoinRulesEventDTO(roomId, MatrixJoinRule.PUBLIC),
                    this.createRoomHistoryVisibilityEventDTO(MatrixHistoryVisibility.SHARED),
                    this.createRoomGuestAccessEventDTO(MatrixGuestAccess.CAN_JOIN)
                ];

            case MatrixCreateRoomPreset.TRUSTED_PRIVATE_CHAT:
                return [
                    this.createRoomJoinRulesEventDTO(roomId, MatrixJoinRule.INVITE),
                    this.createRoomHistoryVisibilityEventDTO(MatrixHistoryVisibility.SHARED),
                    this.createRoomGuestAccessEventDTO(MatrixGuestAccess.FORBIDDEN)
                ];

        }
        LOG.warn(`MatrixUtils: Warning! Unimplemented preset: ${preset}`);
        return [];
    }

}
