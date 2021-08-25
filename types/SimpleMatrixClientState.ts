// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

export enum SimpleMatrixClientState {

    UNAUTHENTICATED,
    AUTHENTICATING,
    AUTHENTICATED,
    AUTHENTICATED_AND_STARTING,
    AUTHENTICATED_AND_STARTED

}

export function isSimpleMatrixClientState (value: any): value is SimpleMatrixClientState {
    switch (value) {
        // FIXME: TODO
        case SimpleMatrixClientState.UNAUTHENTICATED:
        case SimpleMatrixClientState.AUTHENTICATING:
        case SimpleMatrixClientState.AUTHENTICATED:
        case SimpleMatrixClientState.AUTHENTICATED_AND_STARTING:
        case SimpleMatrixClientState.AUTHENTICATED_AND_STARTED:
            return true;

        default:
            return false;

    }
}

export function stringifySimpleMatrixClientState (value: SimpleMatrixClientState): string {
    switch (value) {
        case SimpleMatrixClientState.UNAUTHENTICATED            : return 'UNAUTHENTICATED';
        case SimpleMatrixClientState.AUTHENTICATING             : return 'AUTHENTICATING';
        case SimpleMatrixClientState.AUTHENTICATED              : return 'AUTHENTICATED';
        case SimpleMatrixClientState.AUTHENTICATED_AND_STARTING : return 'AUTHENTICATED_AND_STARTING';
        case SimpleMatrixClientState.AUTHENTICATED_AND_STARTED  : return 'AUTHENTICATED_AND_STARTED';
    }
    throw new TypeError(`Unsupported SimpleMatrixClientState value: ${value}`);
}

export function parseSimpleMatrixClientState (value: any): SimpleMatrixClientState | undefined {

    switch (value.toUpperCase()) {

        case 'UNAUTHENTICATED'              : return SimpleMatrixClientState.UNAUTHENTICATED;
        case 'AUTHENTICATING'               : return SimpleMatrixClientState.AUTHENTICATING;
        case 'AUTHENTICATED'                : return SimpleMatrixClientState.AUTHENTICATED;
        case 'AUTHENTICATED_AND_STARTING'   : return SimpleMatrixClientState.AUTHENTICATED_AND_STARTING;
        case 'AUTHENTICATED_AND_STARTED'    : return SimpleMatrixClientState.AUTHENTICATED_AND_STARTED;

        default    : return undefined;

    }

}

export default SimpleMatrixClientState;
