// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { isString } from "../../../core/modules/lodash";

export enum MatrixType {

    /**
     * Event
     * @see https://github.com/heusalagroup/hghs/issues/17
     */
    M_TEXT                      = 'm.text',

    /**
     * Not an event, part of the well known DTO response
     */
    M_HOMESERVER                = 'm.homeserver',

    /**
     * Not an event, part of the well known DTO response
     */
    M_IDENTITY_SERVER           = 'm.identity_server',

    /**
     * Part of the MatrixSyncResponseRoomSummaryDTO
     */
    M_HEROES                    = 'm.heroes',

    /**
     * Part of the MatrixSyncResponseRoomSummaryDTO
     */
    M_JOINED_MEMBER_COUNT       = 'm.joined_member_count',

    /**
     * Part of the MatrixSyncResponseRoomSummaryDTO
     */
    M_INVITED_MEMBER_COUNT      = 'm.invited_member_count',

    /**
     * Event
     * @see https://github.com/heusalagroup/hghs/issues/18
     */
    M_ROOM_MESSAGE              = 'm.room.message',

    /**
     * Event
     */
    M_ROOM_POWER_LEVELS         = 'm.room.power_levels',

    /**
     * Event
     */
    M_ROOM_JOIN_RULES           = 'm.room.join_rules',

    /**
     * Used as part of the MatrixType.M_ROOM_JOIN_RULES event.
     *
     * This may be written in wrong syntax, see https://github.com/heusalagroup/hghs/issues/20
     */
    M_ROOM_MEMBERSHIP           = 'm.room.membership',

    /**
     * Event
     */
    M_ROOM_HISTORY_VISIBILITY   = 'm.room.history_visibility',

    /**
     * Event
     */
    M_ROOM_GUEST_ACCESS         = 'm.room.guest_access',

    /**
     * Event
     */
    M_ROOM_CREATE               = 'm.room.create',

    /**
     * Part of room create event.
     *
     * See also MatrixRoomCreateEventDTO.
     */
    M_FEDERATE                  = 'm.federate',

    /**
     * Event
     */
    M_ROOM_MEMBER               = 'm.room.member',

    /**
     * Event
     */
    M_PUSH_RULES                = 'm.push_rules',

    /**
     * Event
     */
    M_PRESENCE                  = 'm.presence',

    /**
     * Room type
     */
    M_SPACE                     = 'm.space',

    /**
     * Part of the login end point. See MatrixPasswordLoginDTO.
     */
    M_LOGIN_PASSWORD            = 'm.login.password',

    /**
     * Part of the login end point.
     */
    M_LOGIN_TOKEN               = 'm.login.token',

    /**
     * Part of the login end point. See also MatrixIdentifierDTO.
     */
    M_ID_USER                   = 'm.id.user',

    FI_NOR_DELETED              = 'fi.nor.deleted',
    FI_NOR_FORM_DTO             = 'fi.nor.form_dto',
    FI_NOR_FORM_VALUE_DTO       = 'fi.nor.form_value_dto',
    FI_NOR_PIPELINE_DTO         = 'fi.nor.dto.pipeline',
    FI_NOR_PIPELINE_RUN_DTO     = 'fi.nor.dto.pipeline.run',
    FI_NOR_AGENT_DTO            = 'fi.nor.dto.agent',
    FI_NOR_PIPELINE             = 'fi.nor.pipeline',
    FI_NOR_PIPELINE_STATE       = 'fi.nor.pipeline.state'

}

export function isMatrixType (value : any) : value is MatrixType {
    return isString(value);
}


