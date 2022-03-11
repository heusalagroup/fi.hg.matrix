// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { isString } from "../../../core/modules/lodash";

export enum MatrixType {

    M_ROOM_POWER_LEVELS         = "m.room.power_levels",
    M_ROOM_JOIN_RULES           = "m.room.join_rules",
    M_ROOM_MEMBERSHIP           = "m.room.membership",
    M_ROOM_HISTORY_VISIBILITY   = "m.room.history_visibility",
    M_ROOM_GUEST_ACCESS         = "m.room.guest_access",
    M_ROOM_CREATE               = "m.room.create",
    M_FEDERATE                  = "m.federate",
    M_ROOM_MEMBER               = "m.room.member",
    M_PUSH_RULES                = "m.push_rules",
    M_PRESENCE                  = "m.presence",
    M_SPACE                     = "m.space",
    M_LOGIN_PASSWORD            = "m.login.password",
    M_LOGIN_TOKEN               = "m.login.token",
    M_ID_USER                   = "m.id.user",

    FI_NOR_DELETED              = "fi.nor.deleted",
    FI_NOR_FORM_DTO             = "fi.nor.form_dto",
    FI_NOR_FORM_VALUE_DTO       = "fi.nor.form_value_dto",
    FI_NOR_PIPELINE_DTO         = "fi.nor.dto.pipeline",
    FI_NOR_PIPELINE_RUN_DTO     = "fi.nor.dto.pipeline.run",
    FI_NOR_AGENT_DTO            = "fi.nor.dto.agent",
    FI_NOR_PIPELINE             = "fi.nor.pipeline",
    FI_NOR_PIPELINE_STATE       = "fi.nor.pipeline.state"

}

export function isMatrixType (value : any) : value is MatrixType {
    return isString(value);
}


