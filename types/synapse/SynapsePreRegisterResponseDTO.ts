// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { hasNoOtherKeysInDevelopment, isRegularObject, isString } from "../../../core/modules/lodash";

/**
 * @see https://github.com/heusalagroup/hghs/issues/1
 */
export interface SynapsePreRegisterResponseDTO {
    readonly nonce : string;
}

export function createSynapsePreRegisterResponseDTO (
    nonce : string
): SynapsePreRegisterResponseDTO {
    return {nonce};
}

export function isSynapsePreRegisterResponseDTO (value: any): value is SynapsePreRegisterResponseDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'nonce'
        ])
        && isString(value?.nonce)
    );
}

export function stringifySynapsePreRegisterResponseDTO (value: SynapsePreRegisterResponseDTO): string {
    return `SynapsePreRegisterResponseDTO(${value})`;
}

export function parseSynapsePreRegisterResponseDTO (value: any): SynapsePreRegisterResponseDTO | undefined {
    if ( isSynapsePreRegisterResponseDTO(value) ) return value;
    return undefined;
}
