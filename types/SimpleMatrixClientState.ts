// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

export enum SimpleMatrixClientState {

    /**
     * Client has been initialized but does not have authenticated session
     */
    UNAUTHENTICATED,

    /**
     * Client is in the middle of authenticating and has not started long polling
     */
    AUTHENTICATING,

    /**
     * Client has authenticated session but has not started sync (eg. long polling events)
     */
    AUTHENTICATED,

    /**
     * Client has authenticated session and is in the middle of initial sync request from the
     * backend
     */
    AUTHENTICATED_AND_STARTING,

    /**
     * Client has authenticated session but the initial sync resulted in an error and client is
     * in the middle of timeout until next try is done
     */
    AUTHENTICATED_AND_RESTARTING,

    /**
     * Client has authenticated session and has finished initial sync and is in the middle of
     * the sync retry timeout (eg. client side sync delay timer is active only)
     */
    AUTHENTICATED_AND_STARTED,

    /**
     * Client has authenticated session and is in the middle of a long polling sync request from
     * the backend
     */
    AUTHENTICATED_AND_SYNCING

}

export function isSimpleMatrixClientState (value: any): value is SimpleMatrixClientState {
    switch (value) {
        case SimpleMatrixClientState.UNAUTHENTICATED:
        case SimpleMatrixClientState.AUTHENTICATING:
        case SimpleMatrixClientState.AUTHENTICATED:
        case SimpleMatrixClientState.AUTHENTICATED_AND_STARTING:
        case SimpleMatrixClientState.AUTHENTICATED_AND_RESTARTING:
        case SimpleMatrixClientState.AUTHENTICATED_AND_STARTED:
        case SimpleMatrixClientState.AUTHENTICATED_AND_SYNCING:
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
        case SimpleMatrixClientState.AUTHENTICATED_AND_RESTARTING : return 'AUTHENTICATED_AND_RESTARTING';
        case SimpleMatrixClientState.AUTHENTICATED_AND_STARTED  : return 'AUTHENTICATED_AND_STARTED';
        case SimpleMatrixClientState.AUTHENTICATED_AND_SYNCING  : return 'AUTHENTICATED_AND_SYNCING';
    }
    throw new TypeError(`Unsupported SimpleMatrixClientState value: ${value}`);
}

export function parseSimpleMatrixClientState (value: any): SimpleMatrixClientState | undefined {

    switch ( `${value}`.toUpperCase() ) {

        case 'UNAUTHENTICATED'              : return SimpleMatrixClientState.UNAUTHENTICATED;
        case 'AUTHENTICATING'               : return SimpleMatrixClientState.AUTHENTICATING;
        case 'AUTHENTICATED'                : return SimpleMatrixClientState.AUTHENTICATED;
        case 'AUTHENTICATED_AND_STARTING'   : return SimpleMatrixClientState.AUTHENTICATED_AND_STARTING;
        case 'AUTHENTICATED_AND_RESTARTING'   : return SimpleMatrixClientState.AUTHENTICATED_AND_RESTARTING;
        case 'AUTHENTICATED_AND_STARTED'    : return SimpleMatrixClientState.AUTHENTICATED_AND_STARTED;
        case 'AUTHENTICATED_AND_SYNCING'    : return SimpleMatrixClientState.AUTHENTICATED_AND_SYNCING;

        default    : return undefined;

    }

}


