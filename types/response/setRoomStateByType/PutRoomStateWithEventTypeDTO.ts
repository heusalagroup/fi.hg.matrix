// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { hasNoOtherKeys, isRegularObject, isString } from "../../../../core/modules/lodash";

export interface PutRoomStateWithEventTypeDTO {
    readonly event_id: string;
}

export function isPutRoomStateWithEventTypeDTO (value: any): value is PutRoomStateWithEventTypeDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'event_id'
        ])
        && isString(value?.event_id)
    );
}

export function stringifyPutRoomStateWithEventTypeDTO (value: PutRoomStateWithEventTypeDTO): string {
    return `PutRoomStateWithEventTypeDTO(${value})`;
}

export function parsePutRoomStateWithEventTypeDTO (value: any): PutRoomStateWithEventTypeDTO | undefined {
    if ( isPutRoomStateWithEventTypeDTO(value) ) return value;
    return undefined;
}


