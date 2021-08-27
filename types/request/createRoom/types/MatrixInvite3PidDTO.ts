import { hasNoOtherKeys, isRegularObject, isString } from "../../../../../ts/modules/lodash";

export interface MatrixInvite3PidDTO {

    readonly id_server       : string;
    readonly id_access_token : string;
    readonly medium          : string;
    readonly address         : string;

}

export function isMatrixInvite3PidDTO (value: any): value is MatrixInvite3PidDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
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

export function stringifyMatrixInvite3PidDTO (value: MatrixInvite3PidDTO): string {
    return `MatrixInvite3PidDTO(${value})`;
}

export function parseMatrixInvite3PidDTO (value: any): MatrixInvite3PidDTO | undefined {
    if ( isMatrixInvite3PidDTO(value) ) return value;
    return undefined;
}

export default MatrixInvite3PidDTO;
