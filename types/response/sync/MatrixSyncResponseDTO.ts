// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeys,
    isRegularObject,
    isString,
    isUndefined
} from "../../../../ts/modules/lodash";
import MatrixSyncResponseRoomsDTO, { isMatrixSyncResponseRoomsDTO } from "./types/MatrixSyncResponseRoomsDTO";
import MatrixSyncResponseAccountDataDTO, {
    isMatrixSyncResponseAccountDataDTO
} from "./types/MatrixSyncResponseAccountDataDTO";
import MatrixSyncResponsePresenceDTO, { isMatrixSyncResponsePresenceDTO } from "./types/MatrixSyncResponsePresenceDTO";
import MatrixSyncResponseToDeviceDTO, { isMatrixSyncResponseToDeviceDTO } from "./types/MatrixSyncResponseToDeviceDTO";
import MatrixSyncResponseDeviceListsDTO, { isMatrixSyncResponseDeviceListsDTO } from "./types/MatrixSyncResponseDeviceListsDTO";
import MatrixSyncResponseDeviceOneTimeKeysCountDTO
    , { isMatrixSyncResponseDeviceOneTimeKeysCountDTO } from "./types/MatrixSyncResponseDeviceOneTimeKeysCountDTO";

export interface MatrixSyncResponseDTO {
    readonly next_batch                    : string;
    readonly rooms                        ?: MatrixSyncResponseRoomsDTO;
    readonly presence                     ?: MatrixSyncResponsePresenceDTO;
    readonly account_data                 ?: MatrixSyncResponseAccountDataDTO;
    readonly to_device                    ?: MatrixSyncResponseToDeviceDTO;
    readonly device_lists                 ?: MatrixSyncResponseDeviceListsDTO;
    readonly device_one_time_keys_count   ?: MatrixSyncResponseDeviceOneTimeKeysCountDTO;
}

export function isMatrixSyncResponseDTO (value: any): value is MatrixSyncResponseDTO {
    return (
        // FIXME: TODO
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'next_batch',
            'rooms',
            'presence',
            'account_data',
            'to_device',
            'device_lists',
            'device_one_time_keys_count'
        ])
        && isString(value?.next_batch)
        && ( isUndefined(value?.rooms)                       || isMatrixSyncResponseRoomsDTO(value?.rooms) )
        && ( isUndefined(value?.presence)                    || isMatrixSyncResponsePresenceDTO(value?.presence) )
        && ( isUndefined(value?.account_data)                || isMatrixSyncResponseAccountDataDTO(value?.account_data) )
        && ( isUndefined(value?.to_device)                   || isMatrixSyncResponseToDeviceDTO(value?.to_device) )
        && ( isUndefined(value?.device_lists)                || isMatrixSyncResponseDeviceListsDTO(value?.device_lists) )
        && ( isUndefined(value?.device_one_time_keys_count)  || isMatrixSyncResponseDeviceOneTimeKeysCountDTO(value?.device_one_time_keys_count) )
    );
}

export function stringifyMatrixSyncResponseDTO (value: MatrixSyncResponseDTO): string {
    return `MatrixSyncResponseDTO(${value})`;
}

export function parseMatrixSyncResponseDTO (value: any): MatrixSyncResponseDTO | undefined {
    if ( isMatrixSyncResponseDTO(value) ) return value;
    return undefined;
}

export default MatrixSyncResponseDTO;
