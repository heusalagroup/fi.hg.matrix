// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { isString } from "../../../core/types/String";
import { isRegularObject } from "../../../core/types/RegularObject";
import { hasNoOtherKeysInDevelopment } from "../../../core/types/OtherKeys";

/**
 * @see https://github.com/heusalagroup/hghs/issues/1
 */
export interface SynapseRegisterResponseDTO {
    readonly access_token : string;
    readonly user_id      : string;
    readonly home_server  : string;
    readonly device_id    : string;
}

export function createSynapseRegisterResponseDTO (
    access_token : string,
    user_id      : string,
    home_server  : string,
    device_id    : string,
) : SynapseRegisterResponseDTO {
    return {
        access_token,
        user_id,
        home_server,
        device_id
    };
}

export function isSynapseRegisterResponseDTO (value: any): value is SynapseRegisterResponseDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'access_token',
            'user_id',
            'home_server',
            'device_id'
        ])
        && isString(value?.access_token)
        && isString(value?.user_id)
        && isString(value?.home_server)
        && isString(value?.device_id)
    );
}

export function stringifySynapseRegisterResponseDTO (value: SynapseRegisterResponseDTO): string {
    return `SynapseRegisterResponseDTO(${value})`;
}

export function parseSynapseRegisterResponseDTO (value: any): SynapseRegisterResponseDTO | undefined {
    if ( isSynapseRegisterResponseDTO(value) ) return value;
    return undefined;
}


