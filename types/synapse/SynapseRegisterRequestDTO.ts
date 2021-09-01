// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeys,
    isBoolean,
    isRegularObject,
    isString
} from "../../../ts/modules/lodash";

/**
 * @see https://matrix-org.github.io/synapse/latest/admin_api/register_api.html
 */
export interface SynapseRegisterRequestDTO {

    readonly nonce       : string;
    readonly username    : string;
    readonly displayname : string;
    readonly password    : string;
    readonly admin       : boolean;
    readonly mac         : string;

}

export function isSynapseRegisterRequestDTO (value: any): value is SynapseRegisterRequestDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'nonce',
            'username',
            'displayname',
            'password',
            'admin',
            'mac'
        ])
        && isString(value?.nonce)
        && isString(value?.username)
        && isString(value?.displayname)
        && isString(value?.password)
        && isBoolean(value?.admin)
        && isString(value?.mac)
    );
}

export function stringifySynapseRegisterRequestDTO (value: SynapseRegisterRequestDTO): string {
    return `SynapseRegisterRequestDTO(${value})`;
}

export function parseSynapseRegisterRequestDTO (value: any): SynapseRegisterRequestDTO | undefined {
    if ( isSynapseRegisterRequestDTO(value) ) return value;
    return undefined;
}

export default SynapseRegisterRequestDTO;
