// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { MatrixSyncResponseInviteStateDTO,
    explainMatrixSyncResponseInviteStateDTO,
    getEventsFromMatrixSyncResponseInviteStateDTO,
    isMatrixSyncResponseInviteStateDTO
} from "./MatrixSyncResponseInviteStateDTO";
import { MatrixSyncResponseStrippedStateDTO } from "./MatrixSyncResponseStrippedStateDTO";
import { isRegularObject } from "../../../../../core/types/RegularObject";
import { hasNoOtherKeysInDevelopment } from "../../../../../core/types/OtherKeys";
import { keys } from "../../../../../core/functions/keys";

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
        && hasNoOtherKeysInDevelopment(value, [
            'invite_state'
        ])
        && isMatrixSyncResponseInviteStateDTO(value?.invite_state)
    );
}

export function assertMatrixSyncResponseInvitedRoomDTO (value: any): void {

    if(!( isRegularObject(value) )) {
        throw new TypeError(`Value not object: ${value}`);
    }

    if(!( hasNoOtherKeysInDevelopment(value, [
            'invite_state'
        ]) )) {
        throw new TypeError(`Object has extra keys: all keys: ${keys(value)}`);
    }

    if(!( isMatrixSyncResponseInviteStateDTO(value?.invite_state) )) {
        throw new TypeError(`Property "invite_state" invalid: ${explainMatrixSyncResponseInviteStateDTO(value?.invite_state)}`);
    }

}

export function explainMatrixSyncResponseInvitedRoomDTO (value : any) : string {
    try {
        assertMatrixSyncResponseInvitedRoomDTO(value);
        return 'No errors detected';
    } catch (err: any) {
        return err?.message;
    }
}

export function stringifyMatrixSyncResponseInvitedRoomDTO (value: MatrixSyncResponseInvitedRoomDTO): string {
    return `MatrixSyncResponseInvitedRoomDTO(${value})`;
}

export function parseMatrixSyncResponseInvitedRoomDTO (value: any): MatrixSyncResponseInvitedRoomDTO | undefined {
    if ( isMatrixSyncResponseInvitedRoomDTO(value) ) return value;
    return undefined;
}


