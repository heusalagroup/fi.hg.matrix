// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { isString } from "../../../../../core/types/String";
import { isRegularObject } from "../../../../../core/types/RegularObject";
import { hasNoOtherKeysInDevelopment } from "../../../../../core/types/OtherKeys";

export interface MatrixIdentityServerInformationDTO {
    readonly base_url: string;
}

export function createMatrixIdentityServerInformationDTO (
    base_url: string
) : MatrixIdentityServerInformationDTO {
    return {
        base_url
    };
}

export function isMatrixIdentityServerInformationDTO (value: any): value is MatrixIdentityServerInformationDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, ['base_url'])
        && isString(value?.base_url)
    );
}

export function stringifyMatrixIdentityServerInformationDTO (value: MatrixIdentityServerInformationDTO): string {
    if ( !isMatrixIdentityServerInformationDTO(value) ) throw new TypeError(`Not MatrixIdentityServerInformationDTO: ${value}`);
    return `MatrixIdentityServerInformationDTO(${value})`;
}

export function parseMatrixIdentityServerInformationDTO (value: any): MatrixIdentityServerInformationDTO | undefined {
    if ( isMatrixIdentityServerInformationDTO(value) ) return value;
    return undefined;
}


