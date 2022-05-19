import { isStringOrUndefined } from "../../../core/modules/lodash";

export interface DeviceModel {
    readonly id: any;
}

export function isDeviceModel(value: any) {
    return (
        !!value
        && isStringOrUndefined(value?.id)
    );
}