// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { RepositoryEntry } from "../ts/simpleRepository/types/RepositoryEntry";
import Repository from "../ts/simpleRepository/types/Repository";
import SimpleMatrixClient from "./SimpleMatrixClient";
import MatrixCreateRoomResponseDTO from "./types/response/createRoom/MatrixCreateRoomResponseDTO";
import MatrixCreateRoomPreset
    from "./types/request/createRoom/types/MatrixCreateRoomPreset";
import JsonAny, {
    isJsonObject,
    JsonObject
} from "../ts/Json";
import MatrixSyncResponseDTO from "./types/response/sync/MatrixSyncResponseDTO";
import LogService from "../ts/LogService";
import {
    concat,
    filter,
    get,
    isInteger,
    isNumber,
    keys,
    map,
    reduce,
    parseNonEmptyString,
    uniq
} from "../ts/modules/lodash";
import MatrixRoomId from "./types/core/MatrixRoomId";
import MatrixSyncResponseJoinedRoomDTO
    from "./types/response/sync/types/MatrixSyncResponseJoinedRoomDTO";
import MatrixSyncResponseRoomEventDTO
    from "./types/response/sync/types/MatrixSyncResponseRoomEventDTO";
import MatrixType from "./types/core/MatrixType";
import RequestError from "../ts/request/types/RequestError";
import PutRoomStateWithEventTypeDTO
    from "./types/response/setRoomStateByType/PutRoomStateWithEventTypeDTO";
import MatrixCreateRoomDTO from "./types/request/createRoom/MatrixCreateRoomDTO";
import MatrixStateEvent from "./types/core/MatrixStateEvent";
import MatrixRoomCreateEventDTO from "./types/event/roomCreate/MatrixRoomCreateEventDTO";
import MatrixUserId from "./types/core/MatrixUserId";
import MatrixHistoryVisibility from "./types/event/roomHistoryVisibility/MatrixHistoryVisibility";
import MatrixJoinRule from "./types/event/roomJoinRules/MatrixJoinRule";
import MatrixGuestAccess from "./types/event/roomGuestAccess/MatrixGuestAccess";
import MatrixRoomJoinedMembersDTO
    from "./types/response/roomJoinedMembers/MatrixRoomJoinedMembersDTO";

const LOG = LogService.createLogger('MatrixCrudRepository');

/**
 * Saves JSON-able objects of type T as special Matrix.org rooms identified by `stateType` and
 * `stateKey`.
 *
 * See also [MemoryRepository](https://github.com/sendanor/typescript/tree/main/simpleRepository)
 */
export class MatrixCrudRepository<T> implements Repository<T> {

    private readonly _client         : SimpleMatrixClient;
    private readonly _serviceAccount : SimpleMatrixClient | undefined;
    private readonly _stateType      : string;
    private readonly _stateKey       : string;
    private readonly _deletedType    : string;
    private readonly _deletedKey     : string;
    private readonly _allowedGroups  : MatrixRoomId[] | undefined;

    /**
     * Creates an instance of MatrixCrudRepository.
     *
     * @param client         Use `SimpleMatrixClient.login(user, pw) :
     *     Promise<SimpleMatrixClient>`
     *                       to get a client instance which has been authenticated.
     *
     * @param stateType      The MatrixType for this type of resource. Use matrix-style namespace
     *                       syntax, eg. `com.example.foo.dto`.
     *
     * @param stateKey       Optional. The state key, defaults to ''.
     *
     * @param serviceAccount Optional. If defined, this service account user will be joined to any
     *                       created rooms and removed from them when resoure-room is destroyed.
     *
     * @param deletedType    Optional. The state event type to add to any resource which is
     *     deleted. Defaults to `MatrixType.FI_NOR_DELETED`.
     *
     * @param deletedKey     Optional. The state key for deletedType, defaults to ''.
     *
     * @param allowedGroups  Optional. List of Matrix rooms who's members will be able to access
     *     any resources (eg. rooms) created in this repository without an invite.
     */
    public constructor (
        client                : SimpleMatrixClient,
        stateType             : string,
        stateKey              : string             | undefined = undefined,
        serviceAccount        : SimpleMatrixClient | undefined = undefined,
        deletedType           : string             | undefined = undefined,
        deletedKey            : string             | undefined = undefined,
        allowedGroups         : MatrixRoomId[]     | undefined = undefined
    ) {

        this._client         = client;
        this._stateType      = stateType;
        this._stateKey       = stateKey                          ?? '';
        this._serviceAccount = serviceAccount                    ?? undefined;
        this._deletedType    = parseNonEmptyString(deletedType)  ?? MatrixType.FI_NOR_DELETED;
        this._deletedKey     = deletedKey                        ?? '';

        if (allowedGroups === undefined) {
            this._allowedGroups = undefined;
        } else {
            this._allowedGroups = [...allowedGroups];
        }

    }

    /**
     * Returns all resources (eg. Matrix rooms) from the repository which are of this type.
     *
     * @returns Array of resources
     */
    public async getAll () : Promise<RepositoryEntry<T>[]> {

        const response : MatrixSyncResponseDTO = await this._client.sync({
            filter: {
                presence: {
                    limit: 0,
                    // types: [ this._stateType ]
                },
                account_data: {
                    limit: 0,
                    // types: [ this._stateType ]
                },
                room: {
                    account_data: {
                        limit: 0,
                        // types: [ this._stateType ]
                    },
                    ephemeral: {
                        limit: 0,
                    },
                    timeline: {
                        limit: 0,
                        // types: [ this._stateType ]
                    },
                    state: {
                        limit: 1,
                        include_redundant_members: true,
                        types: [ this._stateType ],
                        not_types: [ this._deletedType ]
                    }
                }
            },
            full_state: true
        });

        LOG.debug(`getAll: response = `, JSON.stringify(response, null, 2));

        const joinObject = response?.rooms?.join ?? {};
        const inviteObject = response?.rooms?.invite ?? {};

        const joinedRooms  : MatrixRoomId[] = keys(joinObject);
        const invitedRooms : MatrixRoomId[] = keys(inviteObject);

        const roomsNotYetJoined : MatrixRoomId[] = filter(invitedRooms, (item : MatrixRoomId) : boolean => {
            return !joinedRooms.includes(item);
        });

        if (roomsNotYetJoined.length) {

            LOG.debug("Joining to rooms = ", roomsNotYetJoined);

            let joinedRooms : number = 0;

            await reduce(
                roomsNotYetJoined,
                async (p, roomId : MatrixRoomId) : Promise<void> => {

                    await p;

                    try {

                        LOG.debug("Joining to room = ", roomId);
                        await this._client.joinRoom(roomId);

                        joinedRooms += 1;

                    } catch (err) {
                        LOG.warn(`Warning! Could not join client to room ${roomId}`);
                    }

                },
                Promise.resolve()
            )

            if (joinedRooms >= 1) {
                LOG.debug("Fetching results again after joining");
                return await this.getAll();
            }

        }

        return reduce(joinedRooms, (result : RepositoryEntry<T>[], roomId: MatrixRoomId) : RepositoryEntry<T>[] => {

            const value : MatrixSyncResponseJoinedRoomDTO = joinObject[roomId];

            const events : MatrixSyncResponseRoomEventDTO[] = filter(
                value?.state?.events ?? [],
                (item : MatrixSyncResponseRoomEventDTO) : boolean => {
                    return (
                        (item?.type === this._stateType)
                        && (item?.state_key === this._stateKey)
                        && isNumber(item?.content?.version)
                    );
                }
            );

            let entries : RepositoryEntry<T>[] = concat(result, map(events, (item : MatrixSyncResponseRoomEventDTO) : RepositoryEntry<T> => {

                // @ts-ignore
                const data    : T = item?.content?.data ?? {};

                // @ts-ignore
                const version : number = item?.content?.version;

                // @ts-ignore
                const deleted : boolean = !!(item?.content?.deleted);

                return {
                    data: data,
                    id: roomId,
                    version: version,
                    deleted: deleted
                };

            }));

            return entries;

        }, []);

    }

    /**
     * Returns all resources (eg. Matrix rooms) which have this property defined in their state.
     *
     * @param propertyName This may also be a path to value inside the model,
     *                     eg. `user.id` to match `{user: {id: 123}}`.
     *
     * @param propertyValue The value to find
     *
     * @returns Array of resources
     */
    public async getAllByProperty (
        propertyName  : string,
        propertyValue : any
    ): Promise<RepositoryEntry<T>[]> {

        const items = await this.getAll();

        return map(
            filter(
                items,
                (item: RepositoryEntry<T>) : boolean => get(item?.data, propertyName) === propertyValue
            ),
            (item: RepositoryEntry<T>) : RepositoryEntry<T> => ({
                id       : item.id,
                version  : item.version,
                data     : item.data
            })
        );

    }

    /**
     * Creates a resource in the repository for `data`, eg. a room in Matrix for this resource.
     *
     * @param data The data of the resource.
     * @param members Any members which will be invited to this resource
     *
     * @returns The new resource
     */
    public async createItem (
        data    : T,
        members ?: string[]
    ) : Promise<RepositoryEntry<T>> {

        const jsonData : JsonAny = data as unknown as JsonAny;
        const version  : number     = 1;

        const content : JsonObject = {
            data    : jsonData,
            version : version
        };

        const serviceAccountId = this._serviceAccount?.getUserId();

        const invitedMembers : MatrixUserId[] = (
            uniq(concat(
                serviceAccountId ? [ serviceAccountId ]: [],
                members ? members : []
            ))
        );

        const allowedGroups : MatrixRoomId[] | undefined = this._allowedGroups;

        const creationContent : Partial<MatrixRoomCreateEventDTO> = {
            [MatrixType.M_FEDERATE]: false
        };

        const initialState : MatrixStateEvent[] = [

            // Set our own state which indicates this is a special group for our CRUD item,
            // including our CRUD item value.
            {
                type: this._stateType,
                state_key: this._stateKey,
                content: content
            },

            // Allow visibility to older events
            {
                type: MatrixType.M_ROOM_HISTORY_VISIBILITY,
                state_key: '',
                content: {
                    history_visibility: MatrixHistoryVisibility.SHARED
                }
            },

            // Disallow guest from joining
            {
                type: MatrixType.M_ROOM_GUEST_ACCESS,
                state_key: '',
                content: {
                    guest_access: MatrixGuestAccess.FORBIDDEN
                }
            }

        ];

        // Allow members from these groups to access the item.
        // See also https://github.com/matrix-org/matrix-doc/blob/master/proposals/3083-restricted-rooms.md
        if (allowedGroups !== undefined) {
            initialState.push({
                type: MatrixType.M_ROOM_JOIN_RULES,
                state_key: "",
                content: {
                    join_rule: MatrixJoinRule.RESTRICTED,
                    allow: map(allowedGroups, (item : MatrixRoomId) => ({
                        type: MatrixType.M_ROOM_MEMBERSHIP,
                        room_id: item
                    }))
                }
            });
        }

        const inviteOptions : Partial<MatrixCreateRoomDTO> = (
            invitedMembers.length ? {invite: invitedMembers} : {}
        );

        const options : MatrixCreateRoomDTO = {
            ...inviteOptions,
            preset: MatrixCreateRoomPreset.PRIVATE_CHAT,
            creation_content: creationContent,
            initial_state: initialState,
            room_version: "8"
        };

        const response : MatrixCreateRoomResponseDTO = await this._client.createRoom(options);

        const room_id = response.room_id;

        if (this._serviceAccount) {
            await this._serviceAccount.joinRoom(room_id);
        }

        return {
            id      : room_id,
            version : version,
            data    : data,
            deleted : false
        };

    }

    /**
     * Search a resource from the repository with this ID.
     *
     * @param id The ID of the resource. It's also a Matrix Room ID.
     *
     * @returns Promise of the latest resource with this ID, if it's defined, otherwise
     *     `undefined`.
     */
    public async findById (
        id              : string,
        includeMembers ?: boolean
    ) : Promise<RepositoryEntry<T> | undefined> {

        const response : JsonObject | undefined = await this._client.getRoomStateByType(
            id,
            this._stateType,
            this._stateKey
        );

        LOG.debug(`response = `, JSON.stringify(response, null, 2));

        const data = response?.data;
        if (!isJsonObject(data)) {
            throw new TypeError(`data was not JsonObject: ${data}`);
        }

        const version = response?.version;
        if (!isInteger(version)) {
            throw new TypeError(`version was not integer: ${version}`);
        }

        let members : string[] | undefined = undefined;

        if (includeMembers) {
            const dto : MatrixRoomJoinedMembersDTO = await this._client.getJoinedMembers(id);
            members = keys(dto);
        }

        return {
            // @ts-ignore
            data: data,
            id: id,
            version: version,
            members
        };

    }

    /**
     * Update the state of a resource located by this ID.
     *
     * It will set the state of the Matrix room to `jsonData` with a newer version number.
     *
     * @param id The ID of the resource. It's a Matrix Room ID.
     *
     * @param jsonData New data
     */
    public async update (id: string, jsonData: T) : Promise<RepositoryEntry<T>> {

        if (!isJsonObject(jsonData)) {
            throw new TypeError(`jsonData was not JsonObject: ${jsonData}`);
        }

        const record = await this.findById(id);

        if (record === undefined) {
            throw new RequestError(404);
        }

        const newVersion : number = record.version + 1;
        if (!isInteger(newVersion)) {
            throw new TypeError(`newVersion was not integer: ${newVersion}`);
        }

        const content : JsonObject = {
            // @ts-ignore
            data    : jsonData,
            version : newVersion
        };

        const response : PutRoomStateWithEventTypeDTO = await this._client.setRoomStateByType(
            id,
            this._stateType,
            this._stateKey,
            content
        );

        LOG.debug(`response = `, JSON.stringify(response, null, 2));

        return {
            data: jsonData,
            id: id,
            version: newVersion,
            deleted: false
        };

    }

    /**
     * Removes a resource by `id` from repository.
     *
     * This will make the client leave & forget the Matrix room for this resource.
     *
     * If the service account is defined, it will also make the service account to leave & forget
     * the room.
     *
     * @FIXME Make the client and/or service account kick every other user out of the room also.
     *
     * @param id The ID of the resource to delete. This is a Matrix room ID.
     *
     * @returns The resource with `deleted` property as `false`
     *
     */
    public async deleteById (id: string) : Promise<RepositoryEntry<T>> {

        let record;

        try {

            record = await this.findById(id);

            if (record === undefined) {
                // FIXME: Create our own errors. HTTP error is wrong here.
                throw new RequestError(404);
            }

            const newVersion : number = record.version + 1;
            if (!isInteger(newVersion)) {
                throw new TypeError(`newVersion was not integer: ${newVersion}`);
            }

            const content : JsonObject = {
                // @ts-ignore
                data    : record.data,
                version : newVersion,
                deleted : true
            };

            const response : PutRoomStateWithEventTypeDTO = await this._client.setRoomStateByType(
                id,
                this._stateType,
                this._stateKey,
                content
            );

            const deletedResponse : PutRoomStateWithEventTypeDTO = await this._client.setRoomStateByType(
                id,
                this._deletedType,
                this._deletedKey,
                {}
            );

            if (this._serviceAccount) {

                try {
                    await this._serviceAccount.leaveRoom(id);
                } catch (err) {
                    LOG.warn(`Warning! Service account could not leave from the room ${id}: `, err);
                }

                try {
                    await this._serviceAccount.forgetRoom(id);
                } catch (err) {
                    LOG.warn(`Warning! Service account could not forget the room ${id}: `, err);
                }

            }

            await this._client.leaveRoom(id);

            await this._client.forgetRoom(id);

            LOG.debug(`response = `, JSON.stringify(response, null, 2));

            return {
                data: record.data,
                id: id,
                version: newVersion,
                deleted: true
            };

        } catch (err) {

            if ( err instanceof RequestError && [401, 403, 404].includes(err.getStatusCode()) ) {
                throw err;
            }

            LOG.error(`Error in deleteById(${id}): `, err);

            // FIXME: Create our own errors. HTTP error is wrong here.
            throw new RequestError(500);

        }

    }

}

export default MatrixCrudRepository;
