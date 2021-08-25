// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import MatrixSyncResponseInviteStateDTO, {
    getEventsFromMatrixSyncResponseInviteStateDTO,
    isMatrixSyncResponseInviteStateDTO
} from "./MatrixSyncResponseInviteStateDTO";
import { hasNoOtherKeys, isRegularObject } from "../../../../../ts/modules/lodash";
import MatrixSyncResponseStrippedStateDTO from "./MatrixSyncResponseStrippedStateDTO";

export interface MatrixSyncResponseInvitedRoomDTO {
    readonly invite_state : MatrixSyncResponseInviteStateDTO;
}

export function getEventsFromMatrixSyncResponseInvitedRoomDTO (
    value: MatrixSyncResponseInvitedRoomDTO
) : readonly MatrixSyncResponseStrippedStateDTO[] {
    return getEventsFromMatrixSyncResponseInviteStateDTO(value.invite_state);
}

export function isMatrixSyncResponseInvitedRoomDTO (value: any): value is MatrixSyncResponseInvitedRoomDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'invite_state'
        ])
        && isMatrixSyncResponseInviteStateDTO(value?.invite_state)
    );
}

export function stringifyMatrixSyncResponseInvitedRoomDTO (value: MatrixSyncResponseInvitedRoomDTO): string {
    return `MatrixSyncResponseInvitedRoomDTO(${value})`;
}

export function parseMatrixSyncResponseInvitedRoomDTO (value: any): MatrixSyncResponseInvitedRoomDTO | undefined {
    if ( isMatrixSyncResponseInvitedRoomDTO(value) ) return value;
    return undefined;
}

export default MatrixSyncResponseInvitedRoomDTO;
