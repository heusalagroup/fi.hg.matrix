// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { isString } from "../../../ts/modules/lodash";

export enum MatrixType {

    M_ROOM_POWER_LEVELS         = "m.room.power_levels",
    M_ROOM_JOIN_RULES           = "m.room.join_rules",
    M_ROOM_HISTORY_VISIBILITY   = "m.room.history_visibility",
    M_ROOM_GUEST_ACCESS         = "m.room.guest_access",
    M_ROOM_CREATE               = "m.room.create",
    M_ROOM_MEMBER               = "m.room.member",
    M_PUSH_RULES                = "m.push_rules",
    M_PRESENCE                  = "m.presence",
    M_SPACE                     = "m.space",
    M_LOGIN_PASSWORD            = "m.login.password",
    M_LOGIN_TOKEN               = "m.login.token",
    M_ID_USER                   = "m.id.user",

    FI_NOR_FORM_DTO             = "fi.nor.form_dto",
    FI_NOR_FORM_VALUE_DTO       = "fi.nor.form_value_dto"

}

export function isMatrixType (value : any) : value is MatrixType {
    return isString(value);
}

export default MatrixType;
