// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    concat,
    hasNoOtherKeysInDevelopment,
    isRegularObject,
    isString,
    isUndefined, keys
} from "../../../../core/modules/lodash";
import {
    MatrixSyncResponseRoomsDTO,
    explainMatrixSyncResponseRoomsDTO,
    getEventsFromMatrixSyncResponseRoomsDTO,
    isMatrixSyncResponseRoomsDTO
} from "./types/MatrixSyncResponseRoomsDTO";
import {
    MatrixSyncResponseAccountDataDTO,
    getEventsFromMatrixSyncResponseAccountDataDTO,
    isMatrixSyncResponseAccountDataDTO
} from "./types/MatrixSyncResponseAccountDataDTO";
import {
    MatrixSyncResponsePresenceDTO,
    getEventsFromMatrixSyncResponsePresenceDTO,
    isMatrixSyncResponsePresenceDTO
} from "./types/MatrixSyncResponsePresenceDTO";
import {
    MatrixSyncResponseToDeviceDTO,
    getEventsFromMatrixSyncResponseToDeviceDTO,
    isMatrixSyncResponseToDeviceDTO
} from "./types/MatrixSyncResponseToDeviceDTO";
import {
    MatrixSyncResponseDeviceListsDTO,
    explainMatrixSyncResponseDeviceListsDTO,
    isMatrixSyncResponseDeviceListsDTO
} from "./types/MatrixSyncResponseDeviceListsDTO";
import {
    MatrixSyncResponseDeviceOneTimeKeysCountDTO,
    isMatrixSyncResponseDeviceOneTimeKeysCountDTO
} from "./types/MatrixSyncResponseDeviceOneTimeKeysCountDTO";
import { MatrixSyncResponseAnyEventDTO } from "./types/MatrixSyncResponseAnyEventDTO";

export interface MatrixSyncResponseDTO {
    readonly next_batch                  : string;
    readonly rooms                      ?: MatrixSyncResponseRoomsDTO;
    readonly presence                   ?: MatrixSyncResponsePresenceDTO;
    readonly account_data               ?: MatrixSyncResponseAccountDataDTO;
    readonly to_device                  ?: MatrixSyncResponseToDeviceDTO;
    readonly device_lists               ?: MatrixSyncResponseDeviceListsDTO;
    readonly device_one_time_keys_count ?: MatrixSyncResponseDeviceOneTimeKeysCountDTO;
}

export function createMatrixSyncResponseDTO(
    next_batch                  : string,
    rooms                      ?: MatrixSyncResponseRoomsDTO,
    presence                   ?: MatrixSyncResponsePresenceDTO,
    account_data               ?: MatrixSyncResponseAccountDataDTO,
    to_device                  ?: MatrixSyncResponseToDeviceDTO,
    device_lists               ?: MatrixSyncResponseDeviceListsDTO,
    device_one_time_keys_count ?: MatrixSyncResponseDeviceOneTimeKeysCountDTO,
) : MatrixSyncResponseDTO {
    return {
        next_batch,
        rooms,
        presence,
        account_data,
        to_device,
        device_lists,
        device_one_time_keys_count
    };
}

export function getEventsFromMatrixSyncResponseDTO (
    value: MatrixSyncResponseDTO
): readonly MatrixSyncResponseAnyEventDTO[] {
    return concat(
        value?.rooms ? getEventsFromMatrixSyncResponseRoomsDTO(value?.rooms) : [],
        value?.presence ? getEventsFromMatrixSyncResponsePresenceDTO(value?.presence) : [],
        value?.account_data ? getEventsFromMatrixSyncResponseAccountDataDTO(
            value?.account_data) : [],
        value?.to_device ? getEventsFromMatrixSyncResponseToDeviceDTO(value?.to_device) : []
    );
}

export function isMatrixSyncResponseDTO (value: any): value is MatrixSyncResponseDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'next_batch',
            'rooms',
            'presence',
            'account_data',
            'to_device',
            'device_lists',
            'device_unused_fallback_key_types',
            'device_one_time_keys_count',
            'org.matrix.msc2732.device_unused_fallback_key_types'
        ])
        && isString(value?.next_batch)
        && (isUndefined(value?.rooms) || isMatrixSyncResponseRoomsDTO(value?.rooms))
        && (isUndefined(value?.presence) || isMatrixSyncResponsePresenceDTO(value?.presence))
        && (isUndefined(value?.account_data) || isMatrixSyncResponseAccountDataDTO(
            value?.account_data))
        && (isUndefined(value?.to_device) || isMatrixSyncResponseToDeviceDTO(value?.to_device))
        && (isUndefined(value?.device_lists) || isMatrixSyncResponseDeviceListsDTO(value?.device_lists))
        && (
            isUndefined(value?.device_one_time_keys_count)
            || isMatrixSyncResponseDeviceOneTimeKeysCountDTO(value?.device_one_time_keys_count)
        )
    );
}

export function assertMatrixSyncResponseDTO (value: any): void {

    if ( !isRegularObject(value) ) {
        throw new TypeError(`value not RegularObject`);
    }

    if ( !hasNoOtherKeysInDevelopment(value, [
        'next_batch',
        'rooms',
        'presence',
        'account_data',
        'to_device',
        'device_lists',
        'device_one_time_keys_count',
        'device_unused_fallback_key_types',
        'org.matrix.msc2732.device_unused_fallback_key_types'
    ]) ) {
        throw new TypeError(`value has additional keys: ${keys(value)}`);
    }

    if ( !isString(value?.next_batch) ) {
        throw new TypeError('Property "next_batch" was not string');
    }

    if ( !(isUndefined(value?.rooms) || isMatrixSyncResponseRoomsDTO(value?.rooms)) ) {
        throw new TypeError(
            `Property "rooms" was invalid: ${explainMatrixSyncResponseRoomsDTO(value?.rooms)}`);
    }

    if ( !(isUndefined(value?.presence) || isMatrixSyncResponsePresenceDTO(value?.presence)) ) {
        throw new TypeError('Property "presence" was invalid');
    }

    if ( !(isUndefined(value?.account_data) || isMatrixSyncResponseAccountDataDTO(
        value?.account_data)) ) {
        throw new TypeError('Property "account_data" was invalid');
    }

    if ( !(isUndefined(value?.to_device) || isMatrixSyncResponseToDeviceDTO(value?.to_device)) ) {
        throw new TypeError('Property "to_device" was invalid');
    }

    if ( !(isUndefined(value?.device_lists) || isMatrixSyncResponseDeviceListsDTO(
        value?.device_lists)) ) {
        throw new TypeError(
            `Property "device_lists" was invalid: ${explainMatrixSyncResponseDeviceListsDTO(
                value?.device_lists)}`);
    }

    if ( !(
        isUndefined(value?.device_one_time_keys_count)
        || isMatrixSyncResponseDeviceOneTimeKeysCountDTO(value?.device_one_time_keys_count)) ) {
        throw new TypeError('Property "device_one_time_keys_count" was invalid');
    }

}

export function explainMatrixSyncResponseDTO (value: any): string {
    try {
        assertMatrixSyncResponseDTO(value);
        return 'No errors detected';
    } catch (err: any) {
        return err?.message;
    }
}

export function stringifyMatrixSyncResponseDTO (value: MatrixSyncResponseDTO): string {
    return `MatrixSyncResponseDTO(${value})`;
}

export function parseMatrixSyncResponseDTO (value: any): MatrixSyncResponseDTO | undefined {
    if ( isMatrixSyncResponseDTO(value) ) return value;
    return undefined;
}


