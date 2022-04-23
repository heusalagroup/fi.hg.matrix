// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { MatrixRegisterKind } from "../types/request/register/types/MatrixRegisterKind";
import { MatrixType } from "../types/core/MatrixType";
import { join, keys, map } from "../../core/modules/lodash";

export interface MatrixSyncQueryParams {
    filter       ?: string,
    since        ?: string,
    full_state   ?: string,
    set_presence ?: string,
    timeout      ?: string
}

export const MATRIX_AUTHORIZATION_HEADER_NAME = 'Authorization';

export const SYNAPSE_REGISTER_URL                = '/_synapse/admin/v1/register';

export const MATRIX_WHOAMI_URL                   = '/_matrix/client/r0/account/whoami';
export const MATRIX_LOGIN_URL                    = '/_matrix/client/r0/login';
export const MATRIX_ROOM_DIRECTORY_URL           = (roomName: string) => `/_matrix/client/r0/directory/room/${q(roomName)}`;
export const MATRIX_JOINED_MEMBERS_URL           = (roomId : string) => `/_matrix/client/r0/rooms/${q(roomId)}/joined_members`;
export const MATRIX_REGISTER_URL                 = (kind: MatrixRegisterKind | undefined) => `/_matrix/client/r0/register${kind ? `?kind=${q(kind)}`: ''}`;
export const MATRIX_ROOM_EVENT_STATE_FETCH_URL   = (roomId : string, eventType : string, stateKey : string) => `/_matrix/client/r0/rooms/${q(roomId)}/state/${q(eventType)}/${q(stateKey)}`;
export const MATRIX_ROOM_EVENT_STATE_UPDATE_URL  = (roomId : string, eventType : string, stateKey : string) => `/_matrix/client/r0/rooms/${q(roomId)}/state/${q(eventType)}/${q(stateKey)}`;
export const MATRIX_ROOM_FORGET_URL              = (roomId : string) => `/_matrix/client/r0/rooms/${q(roomId)}/forget`;
export const MATRIX_ROOM_LEAVE_URL               = (roomId : string) => `/_matrix/client/r0/rooms/${q(roomId)}/leave`;
export const MATRIX_ROOM_INVITE_URL              = (roomId : string) => `/_matrix/client/r0/rooms/${q(roomId)}/invite`;
export const MATRIX_ROOM_TRIGGER_EVENT_URL       = (roomId : string, eventName: MatrixType) => `/_matrix/client/r0/rooms/${q(roomId)}/send/${q(eventName)}`;
export const MATRIX_CREATE_ROOM_URL              = `/_matrix/client/r0/createRoom`;
export const MATRIX_JOIN_ROOM_URL                = (roomId : string) => `/_matrix/client/r0/rooms/${q(roomId)}/join`;
export const MATRIX_SYNC_URL                     = (queryParams: MatrixSyncQueryParams) => `/_matrix/client/r0/sync?${qParams(queryParams)}`;

function qParams (queryParams: MatrixSyncQueryParams) : string {
    return join(
        map(
            keys(queryParams),
            (key : string) : string => {
                // @ts-ignore
                const value : string = queryParams[key];
                return `${q(key)}=${q(value)}`;
            }
        ),
        '&'
    );
}

function q (value: string) : string {
    return encodeURIComponent(value);
}
