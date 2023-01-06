// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { explain, explainProperty } from "../../../../../core/types/explain";
import { explainString, isString } from "../../../../../core/types/String";
import { explainRegularObject, isRegularObject } from "../../../../../core/types/RegularObject";
import { explainNoOtherKeys, hasNoOtherKeysInDevelopment } from "../../../../../core/types/OtherKeys";

export interface MatrixInvite3PidDTO {
    readonly id_server       : string;
    readonly id_access_token : string;
    readonly medium          : string;
    readonly address         : string;
}

export function isMatrixInvite3PidDTO (value: any): value is MatrixInvite3PidDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'id_server',
            'id_access_token',
            'medium',
            'address'
        ])
        && isString(value?.id_server)
        && isString(value?.id_access_token)
        && isString(value?.medium)
        && isString(value?.address)
    );
}

export function explainMatrixInvite3PidDTO (value : any) : string {
    return explain(
        [
            explainRegularObject(value),
            explainNoOtherKeys(value, [
                'id_server',
                'id_access_token',
                'medium',
                'address'
            ]),
            explainProperty("id_server", explainString(value?.id_server)),
            explainProperty("id_access_token", explainString(value?.id_access_token)),
            explainProperty("medium", explainString(value?.medium)),
            explainProperty("address", explainString(value?.address))
        ]
    );
}

export function stringifyMatrixInvite3PidDTO (value: MatrixInvite3PidDTO): string {
    return `MatrixInvite3PidDTO(${value})`;
}

export function parseMatrixInvite3PidDTO (value: any): MatrixInvite3PidDTO | undefined {
    if ( isMatrixInvite3PidDTO(value) ) return value;
    return undefined;
}


