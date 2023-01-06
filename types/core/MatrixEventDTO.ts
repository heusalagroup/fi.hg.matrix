// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { isMatrixEventContentDTO, MatrixEventContentDTO } from "./MatrixEventContentDTO";
import { isString } from "../../../core/types/String";
import { isNumber } from "../../../core/types/Number";
import { isRegularObject } from "../../../core/types/RegularObject";
import { hasNoOtherKeysInDevelopment } from "../../../core/types/OtherKeys";

export interface MatrixEventDTO {

    readonly content          : MatrixEventContentDTO;
    readonly room_id          : string;
    readonly event_id         : string;
    readonly origin_server_ts : number;
    readonly sender           : string;
    readonly type             : string;

}

export function isMatrixEventDTO (value: any): value is MatrixEventDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'content',
            'room_id',
            'event_id',
            'origin_server_ts',
            'sender',
            'type'
        ])
        && isMatrixEventContentDTO(value?.content)
        && isString(value?.room_id)
        && isString(value?.event_id)
        && isNumber(value?.origin_server_ts)
        && isString(value?.sender)
        && isString(value?.type)
    );
}

export function stringifyMatrixEventDTO (value: MatrixEventDTO): string {
    return `MatrixEventDTO(${value})`;
}

export function parseMatrixEventDTO (value: any): MatrixEventDTO | undefined {
    if ( isMatrixEventDTO(value) ) return value;
    return undefined;
}


