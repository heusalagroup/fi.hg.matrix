import { isStringOrUndefined } from "../../../core/modules/lodash";

export interface DeviceModel {
    readonly id: any;
    readonly name?: string;
}

export function isDeviceModel(value: any) {
    return (
        !!value
        && isStringOrUndefined(value?.id)
        && isStringOrUndefined(value?.name)
    );
}