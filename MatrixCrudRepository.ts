// Copyright (c) 2021-2022. Sendanor <info@sendanor.fi>. All rights reserved.

import { SimpleRepositoryEntry } from "../core/simpleRepository/types/SimpleRepositoryEntry";
import { SimpleRepository, REPOSITORY_NEW_IDENTIFIER } from "../core/simpleRepository/types/SimpleRepository";
import { SimpleMatrixClient } from "./SimpleMatrixClient";
import { MatrixCreateRoomResponseDTO } from "./types/response/createRoom/MatrixCreateRoomResponseDTO";
import { MatrixCreateRoomPreset } from "./types/request/createRoom/types/MatrixCreateRoomPreset";
import { isJsonObject, ReadonlyJsonAny, ReadonlyJsonObject } from "../core/Json";
import { MatrixSyncResponseDTO } from "./types/response/sync/MatrixSyncResponseDTO";
import { LogService } from "../core/LogService";
import { concat} from "../core/functions/concat";
import { filter } from "../core/functions/filter";
import { forEach } from "../core/functions/forEach";
import { get } from "../core/functions/get";
import { map } from "../core/functions/map";
import { reduce } from "../core/functions/reduce";
import { uniq } from "../core/functions/uniq";
import { MatrixRoomId } from "./types/core/MatrixRoomId";
import { MatrixSyncResponseJoinedRoomDTO } from "./types/response/sync/types/MatrixSyncResponseJoinedRoomDTO";
import { MatrixSyncResponseRoomEventDTO } from "./types/response/sync/types/MatrixSyncResponseRoomEventDTO";
import { isMatrixType, MatrixType } from "./types/core/MatrixType";
import { RequestError } from "../core/request/types/RequestError";
import { PutRoomStateWithEventTypeResponseDTO } from "./types/response/setRoomStateByType/PutRoomStateWithEventTypeResponseDTO";
import { MatrixCreateRoomDTO } from "./types/request/createRoom/MatrixCreateRoomDTO";
import { createMatrixStateEvent } from "./types/core/MatrixStateEvent";
import { MatrixRoomCreateEventDTO } from "./types/event/roomCreate/MatrixRoomCreateEventDTO";
import { MatrixUserId } from "./types/core/MatrixUserId";
import { MatrixHistoryVisibility } from "./types/event/roomHistoryVisibility/MatrixHistoryVisibility";
import { MatrixJoinRule } from "./types/event/roomJoinRules/MatrixJoinRule";
import { MatrixGuestAccess } from "./types/event/roomGuestAccess/MatrixGuestAccess";
import { MatrixRoomJoinedMembersDTO } from "./types/response/roomJoinedMembers/MatrixRoomJoinedMembersDTO";
import { SimpleRepositoryMember } from "../core/simpleRepository/types/SimpleRepositoryMember";
import { LogLevel } from "../core/types/LogLevel";
import { createRoomGuestAccessStateEventDTO } from "./types/event/roomGuestAccess/RoomGuestAccessStateEventDTO";
import { createRoomGuestAccessContentDTO } from "./types/event/roomGuestAccess/RoomGuestAccessContentDTO";
import { MatrixStateEventOf } from "./types/core/MatrixStateEventOf";
import { createRoomHistoryVisibilityStateEventDTO } from "./types/event/roomHistoryVisibility/RoomHistoryVisibilityStateEventDTO";
import { createRoomHistoryVisibilityStateContentDTO } from "./types/event/roomHistoryVisibility/RoomHistoryVisibilityStateContentDTO";
import { createRoomJoinRulesAllowConditionDTO, RoomJoinRulesAllowConditionDTO } from "./types/event/roomJoinRules/RoomJoinRulesAllowConditionDTO";
import { RoomMembershipType } from "./types/event/roomJoinRules/RoomMembershipType";
import { createRoomJoinRulesStateContentDTO } from "./types/event/roomJoinRules/RoomJoinRulesStateContentDTO";
import { createRoomJoinRulesStateEventDTO } from "./types/event/roomJoinRules/RoomJoinRulesStateEventDTO";
import { SetRoomStateByTypeRequestDTO } from "./types/request/setRoomStateByType/SetRoomStateByTypeRequestDTO";
import { GetRoomStateByTypeResponseDTO } from "./types/response/getRoomStateByType/GetRoomStateByTypeResponseDTO";
import { isStoredRepositoryItem, SimpleStoredRepositoryItem, StoredRepositoryItemExplainCallback, StoredRepositoryItemTestCallback } from "../core/simpleRepository/types/SimpleStoredRepositoryItem";
import { SimpleRepositoryUtils } from "../core/simpleRepository/SimpleRepositoryUtils";
import { MatrixRoomVersion } from "./types/MatrixRoomVersion";
import { explainNot, explainOk } from "../core/types/explain";
import { parseNonEmptyString } from "../core/types/String";
import { isInteger, isNumber } from "../core/types/Number";
import { keys } from "../core/functions/keys";

const LOG = LogService.createLogger('MatrixCrudRepository');

/**
 * Saves JSON-able objects of type T as special Matrix.org rooms identified by `stateType` and
 * `stateKey`.
 *
 * See also [MemoryRepository](https://github.com/sendanor/typescript/tree/main/simpleRepository)
 */
export class MatrixCrudRepository<T extends SimpleStoredRepositoryItem> implements SimpleRepository<T> {

    public static setLogLevel (level: LogLevel) {
        LOG.setLogLevel(level);
    }

    private readonly _client         : SimpleMatrixClient;
    private readonly _serviceAccount : SimpleMatrixClient | undefined;
    private readonly _stateType      : MatrixType;
    private readonly _stateKey       : string;
    private readonly _deletedType    : string;
    private readonly _deletedKey     : string;
    private readonly _allowedGroups  : readonly MatrixRoomId[] | undefined;
    private readonly _allowedEvents  : readonly string[] | undefined;
    private readonly _isT            : StoredRepositoryItemTestCallback;
    private readonly _explainT       : StoredRepositoryItemExplainCallback;
    private readonly _tName          : string;

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
     *     NOTE! This only has partial support. Filtering for example does not support it yet.
     *
     * @param deletedKey     Optional. The state key for deletedType, defaults to ''.
     *
     * @param allowedGroups  Optional. List of Matrix rooms who's members will be able to access
     *     any resources (eg. rooms) created in this repository without an invite.
     *
     * @param allowedEvents  Optional. List of allowed event IDs in the room.
     *
     * @param isT            Optional. Test function to check if the type really is T.
     * @param explainT Optional. Function to explain if isT fails
     * @param tName    Optional. The name of the T type for debugging purposes. Defaults to "T".
     *
     */
    public constructor (
        client                : SimpleMatrixClient,
        stateType             : string,
        stateKey              : string                              | undefined = undefined,
        serviceAccount        : SimpleMatrixClient                  | undefined = undefined,
        deletedType           : string                              | undefined = undefined,
        deletedKey            : string                              | undefined = undefined,
        allowedGroups         : readonly MatrixRoomId[]             | undefined = undefined,
        allowedEvents         : readonly string[]                   | undefined = undefined,
        isT                   : StoredRepositoryItemTestCallback    | undefined = undefined,
        tName                 : string                              | undefined = undefined,
        explainT              : StoredRepositoryItemExplainCallback | undefined = undefined
    ) {

        if (!isMatrixType(stateType)) {
            throw new TypeError('MatrixCrudRepository: stateType invalid: ' + stateType);
        }

        this._client         = client;
        this._stateType      = stateType;
        this._stateKey       = stateKey                          ?? '';
        this._serviceAccount = serviceAccount                    ?? undefined;
        this._deletedType    = parseNonEmptyString(deletedType)  ?? MatrixType.FI_NOR_DELETED;
        this._deletedKey     = deletedKey                        ?? '';
        this._allowedEvents  = allowedEvents;
        this._isT            = isT ?? isStoredRepositoryItem;
        this._tName          = tName ?? 'T';
        this._explainT       = explainT ?? ( (value: any) : string => this._isT(value) ? explainOk() : explainNot(this._tName) );

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
    public async getAll () : Promise<readonly SimpleRepositoryEntry<T>[]> {
        const list = this._getAll();
        if (!this.isRepositoryEntryList(list)) {
            throw new TypeError(`MatrixCrudRepository.getAll: Illegal data from database: ${this.explainRepositoryEntryList(list)}`);
        }
        return list;
    }

    /**
     * Returns all resources (eg. Matrix rooms) from the repository which are of this type.
     *
     * @returns Array of resources
     */
    public async getSome (idList : readonly string[]) : Promise<readonly SimpleRepositoryEntry<T>[]> {
        const allList : readonly SimpleRepositoryEntry<T>[] = await this._getAll();
        const list = filter(
            allList,
            (item : SimpleRepositoryEntry<T>) : boolean => !!item?.id && idList.includes(item?.id)
        );
        if (!this.isRepositoryEntryList(list)) {
            throw new TypeError(`MatrixCrudRepository.getSome: Illegal data from database: ${this.explainRepositoryEntryList(list)}`);
        }
        return list;
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
    ): Promise<readonly SimpleRepositoryEntry<T>[]> {
        const items = await this._getAll();
        const list = map(
            filter(
                items,
                (item: SimpleRepositoryEntry<T>) : boolean => get(item?.data, propertyName) === propertyValue
            ),
            (item: SimpleRepositoryEntry<T>) : SimpleRepositoryEntry<T> => ({
                id       : item.id,
                version  : item.version,
                data     : item.data
            })
        );
        if (!this.isRepositoryEntryList(list)) {
            throw new TypeError(`MatrixCrudRepository.getAllByProperty: Illegal data from database: ${this.explainRepositoryEntryList(list)}`);
        }
        return list;
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
        members ?: readonly string[]
    ) : Promise<SimpleRepositoryEntry<T>> {

        const clientUserId : string | undefined = this._client.getUserId();
        LOG.debug(`createItem: clientUserId = `, clientUserId);

        const jsonData : ReadonlyJsonAny = data as unknown as ReadonlyJsonAny;
        const version  : number     = 1;

        const content : ReadonlyJsonObject = {
            data    : jsonData,
            version : version
        };
        LOG.debug(`createItem: content = `, content);

        const serviceAccountId = this._serviceAccount?.getUserId();
        LOG.debug(`createItem: serviceAccountId = `, serviceAccountId);

        const invitedMembers : readonly MatrixUserId[] = (
            filter(
                uniq(concat(
                    serviceAccountId ? [ serviceAccountId ]: [],
                    members ? members : []
                )),
                item => item !== clientUserId
            )
        );
        LOG.debug(`createItem: invitedMembers = `, invitedMembers);

        const allowedGroups : readonly MatrixRoomId[] | undefined = this._allowedGroups;
        LOG.debug(`createItem: allowedGroups = `, allowedGroups);

        const creationContent : Partial<MatrixRoomCreateEventDTO> = {
            [MatrixType.M_FEDERATE]: false
        };

        let initialState : readonly MatrixStateEventOf<any>[] = [

            // Set our own state which indicates this is a special group for our CRUD item,
            // including our CRUD item value.
            createMatrixStateEvent(
                this._stateType,
                this._stateKey,
                content
            ),

            // Allow visibility to older events
            createRoomHistoryVisibilityStateEventDTO(
                createRoomHistoryVisibilityStateContentDTO(
                    MatrixHistoryVisibility.SHARED
                )
            ),

            // Disallow guest from joining
            createRoomGuestAccessStateEventDTO(
                createRoomGuestAccessContentDTO(MatrixGuestAccess.FORBIDDEN)
            )

        ];

        // Allow members from these groups to access the item.
        // See also https://github.com/matrix-org/matrix-doc/blob/master/proposals/3083-restricted-rooms.md
        if (allowedGroups !== undefined) {
            initialState = [
                ...initialState,
                ...[
                    createRoomJoinRulesStateEventDTO(
                        createRoomJoinRulesStateContentDTO(
                            MatrixJoinRule.RESTRICTED,
                            map(
                                allowedGroups,
                                (item : MatrixRoomId) : RoomJoinRulesAllowConditionDTO => createRoomJoinRulesAllowConditionDTO(RoomMembershipType.M_ROOM_MEMBERSHIP, item)
                            )
                        )
                    )
                ]
            ];
        }

        LOG.debug(`createItem: initialState = `, initialState);

        const inviteOptions : Partial<MatrixCreateRoomDTO> = (
            invitedMembers.length ? {invite: invitedMembers} : {}
        );
        LOG.debug(`createItem: inviteOptions = `, inviteOptions);

        const allowedEventsObject = {
            [this._stateType]: 0,
            [this._deletedType]: 0
        };

        if (this._allowedEvents?.length) {
            forEach(this._allowedEvents, (eventName : string ) => {
                allowedEventsObject[eventName] = 0;
            });
        }

        const options : MatrixCreateRoomDTO = {
            ...inviteOptions,
            preset: MatrixCreateRoomPreset.PRIVATE_CHAT,
            creation_content: creationContent,
            initial_state: initialState,
            room_version: MatrixRoomVersion.V8,
            power_level_content_override: {
                events: allowedEventsObject
            }
        };

        const response : MatrixCreateRoomResponseDTO = await this._client.createRoom(options);
        LOG.debug(`createItem: response = `, response);

        const room_id = response.room_id;
        LOG.debug(`createItem: room_id = `, room_id);

        if ( this._serviceAccount && clientUserId && clientUserId !== this._serviceAccount.getUserId() ) {
            try {
                await this._serviceAccount.joinRoom(room_id);
            } catch (err : any) {
                LOG.warn(`Warning! Could not join service account to room "${room_id}": `, err);
            }
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
     * @param includeMembers Include list of members who have access to this item.
     *
     * @returns Promise of the latest resource with this ID, if it's defined, otherwise
     *     `undefined`.
     */
    public async findById (
        id              : string,
        includeMembers ?: boolean
    ) : Promise<SimpleRepositoryEntry<T> | undefined> {

        const response : GetRoomStateByTypeResponseDTO | undefined = await this._client.getRoomStateByType(
            id,
            this._stateType,
            this._stateKey
        );

        if (response === undefined) {
            LOG.debug(`findById: response not found for ${id}`);
            return undefined;
        }

        LOG.debug(`findById: response = `, JSON.stringify(response, null, 2));

        const data = response?.data;
        if (!isJsonObject(data)) {
            throw new TypeError(`MatrixCrudRepository.findById: data was not JsonObject: ${data}`);
        }

        const version = response?.version;
        if (!isInteger(version)) {
            throw new TypeError(`MatrixCrudRepository.findById: version was not integer: ${version}`);
        }

        let members : readonly SimpleRepositoryMember[] | undefined = undefined;
        if (includeMembers) {
            const dto : MatrixRoomJoinedMembersDTO = await this._client.getJoinedMembers(id);
            members = map(keys(dto.joined), (memberId: string) : SimpleRepositoryMember => {
                const member = dto.joined[memberId];
                return {
                    id          : memberId,
                    displayName : member.display_name,
                    avatarUrl   : member?.avatar_url ? member.avatar_url : undefined
                };
            });
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
     * Returns one resource (eg. Matrix room) which have this property defined in their state.
     *
     * If no resource found, returns `undefined`.
     *
     * @param propertyName This may also be a path to value inside the model,
     *                     eg. `user.id` to match `{user: {id: 123}}`.
     *
     * @param propertyValue The value to find
     *
     * @throws TypeError if multiple values found
     *
     */
    public async findByProperty (
        propertyName  : string,
        propertyValue : any
    ) : Promise<SimpleRepositoryEntry<T> | undefined> {
        const result = await this.getAllByProperty(propertyName, propertyValue);
        const resultCount : number = result?.length ?? 0;
        if (resultCount === 0) return undefined;
        if (resultCount !== 1) throw new TypeError(`MemoryRepository.findByProperty: Multiple items found by property "${propertyName}" as: ${propertyValue}`);
        return result[0];
    }

    /**
     * Find a record by an ID and update it.
     *
     * @param id
     * @param item
     * @protected
     */
    public async findByIdAndUpdate (
        id: string,
        item: T
    ) : Promise<SimpleRepositoryEntry<T>> {
        const rItem : SimpleRepositoryEntry<T> | undefined = await this.findById(id);
        if (rItem === undefined) throw new TypeError(`findByIdAndUpdate: Could not find item for "${id}"`);
        return await this.update(rItem.id, item);
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
    public async update (id: string, jsonData: T) : Promise<SimpleRepositoryEntry<T>> {

        if (!isJsonObject(jsonData)) {
            throw new TypeError(`MatrixCrudRepository.update: jsonData was not JsonObject: ${jsonData}`);
        }

        const record = await this.findById(id);

        if (record === undefined) {
            throw new RequestError(404);
        }

        const newVersion : number = record.version + 1;
        if (!isInteger(newVersion)) {
            throw new TypeError(`MatrixCrudRepository.update: newVersion was not integer: ${newVersion}`);
        }

        const content : SetRoomStateByTypeRequestDTO = {
            // @ts-ignore
            data    : jsonData,
            version : newVersion
        };

        const response : PutRoomStateWithEventTypeResponseDTO = await this._client.setRoomStateByType(
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
     * Update the state of a resource located by this ID.
     *
     * It will set the state of the Matrix room to `jsonData` with a newer version number.
     *
     * @param item New data
     */
    public async updateOrCreateItem (item: T) : Promise<SimpleRepositoryEntry<T>> {
        if (!isJsonObject(item)) {
            throw new TypeError(`MatrixCrudRepository.updateOrCreateItem: jsonData was not JsonObject: ${item}`);
        }
        const id = item.id;
        const foundItem : SimpleRepositoryEntry<T> | undefined = id !== REPOSITORY_NEW_IDENTIFIER ? await this.findById(id) : undefined;
        if (foundItem) {
            return await this.update(foundItem.id, item);
        } else {
            return await this.createItem(item);
        }
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
    public async deleteById (id: string) : Promise<SimpleRepositoryEntry<T>> {

        let record : SimpleRepositoryEntry<T> | undefined;

        try {

            record = await this.findById(id);
            LOG.debug(`deleteById: record = `, record);

            if (record === undefined) {
                // FIXME: Create our own errors. HTTP error is wrong here.
                throw new RequestError(404);
            }

            const newVersion : number = record.version + 1;
            if (!isInteger(newVersion)) {
                throw new TypeError(`MatrixCrudRepository.deleteById: newVersion was not integer: ${newVersion}`);
            }
            LOG.debug(`deleteById: newVersion = `, newVersion);

            const content : SetRoomStateByTypeRequestDTO = {
                data    : record.data as unknown as ReadonlyJsonObject,
                version : newVersion,
                deleted : true
            };
            LOG.debug(`deleteById: content = `, content);

            const response : PutRoomStateWithEventTypeResponseDTO = await this._client.setRoomStateByType(
                id,
                this._stateType,
                this._stateKey,
                content
            );
            LOG.debug(`deleteById: response = `, response);

            const deletedResponse : PutRoomStateWithEventTypeResponseDTO = await this._client.setRoomStateByType(
                id,
                this._deletedType,
                this._deletedKey,
                {}
            );
            LOG.debug(`deleteById: deletedResponse = `, deletedResponse);

            if (this._serviceAccount) {

                try {
                    LOG.debug(`Leaving from room "${id}" as service account`);
                    await this._serviceAccount.leaveRoom(id);
                } catch (err : any) {
                    LOG.warn(`Warning! Service account could not leave from the room ${id}: `, err);
                }

                try {
                    LOG.debug(`Forgetting room "${id}" as service account`);
                    await this._serviceAccount.forgetRoom(id);
                } catch (err : any) {
                    LOG.warn(`Warning! Service account could not forget the room ${id}: `, err);
                }

            }

            LOG.debug(`Leaving from room "${id}"`);
            await this._client.leaveRoom(id);

            LOG.debug(`Forgetting room "${id}"`);
            await this._client.forgetRoom(id);

            LOG.debug(`response = `, JSON.stringify(response, null, 2));
            return {
                data: record.data,
                id: id,
                version: newVersion,
                deleted: true
            };

        } catch (err : any) {

            if ( err instanceof RequestError && [401, 403, 404].includes(err.getStatusCode()) ) {
                throw err;
            }

            LOG.error(`Error in deleteById(${id}): `, err);

            // FIXME: Create our own errors. HTTP error is wrong here.
            throw new RequestError(500);

        }

    }

    /**
     *
     * @param list
     */
    public async deleteByIdList (list: readonly string[]) : Promise<readonly SimpleRepositoryEntry<T>[]> {
        const results : SimpleRepositoryEntry<T>[] = [];
        let i = 0;
        for (; i < list.length; i += 1) {
            results.push( await this.deleteById(list[i]) );
        }
        if (!this.isRepositoryEntryList(results)) {
            throw new TypeError(`MatrixCrudRepository.getAllByProperty: Illegal data from database: ${this.explainRepositoryEntryList(results)}`);
        }
        return results;
    }

    /**
     * Delete by item list
     *
     * @param list
     */
    public async deleteByList (list: readonly SimpleRepositoryEntry<T>[]) : Promise<readonly SimpleRepositoryEntry<T>[]> {
        return this.deleteByIdList( map(list, item => item.id) );
    }

    /**
     * Delete all
     */
    public async deleteAll () : Promise<readonly SimpleRepositoryEntry<T>[]> {
        const list : readonly SimpleRepositoryEntry<T>[] = await this._getAll();
        return this.deleteByIdList( map(list, item => item.id) );
    }

    /**
     *
     * @param id
     * @param members
     */
    public async inviteToItem (
        id      : string,
        members : readonly string[]
    ): Promise<void> {

        let serviceAccountUserId : string | undefined;
        if (this._serviceAccount) {
            serviceAccountUserId = this._serviceAccount?.getUserId();
            if (!serviceAccountUserId) {
                serviceAccountUserId = await this._serviceAccount.whoami();
            }
        }

        await reduce(
            members,
            async (p : Promise<void>, item : string) => {

                await p;

                if ( serviceAccountUserId && item === serviceAccountUserId ) {
                    return;
                }

                try {
                    await this._client.inviteToRoom(id, item);
                } catch (err : any) {

                    if ( this._client.isAlreadyInTheRoom(err?.body) ) return;

                    LOG.error(`Warning! Could not invite user ${item} to room ${id}: `, err);
                    throw err;

                }

            },
            Promise.resolve()
        )

    }

    /**
     *
     * @param id
     */
    public async subscribeToItem (
        id : string
    ): Promise<void> {

        await this._client.joinRoom(id);

    }

    /**
     * Wait for item to change
     * @param id
     * @param includeMembers
     * @param timeout
     */
    public async waitById (
        id              : string,
        includeMembers ?: boolean,
        timeout        ?: number
    ) : Promise< SimpleRepositoryEntry<T> | undefined > {

        if (!id) throw new TypeError(`MatrixCrudRepository.waitById: id is required: ${id}`);

        const isNotTimeout : boolean = await this._client.waitForEvents(
            [
                this._stateType
            ], [
                id
            ],
            timeout
        );

        if (!isNotTimeout) {
            LOG.debug(`waitById: Timeout received for ${id}`);
        }

        return await this.findById(id, includeMembers);

    }

    /**
     * Returns true if the list is in correct format.
     *
     * @param list
     * @private
     */
    public isRepositoryEntryList (list: any) : list is SimpleRepositoryEntry<T>[] {
        return SimpleRepositoryUtils.isRepositoryEntryList(list, this._isT);
    }

    public explainRepositoryEntryList (list: any): string {
        return SimpleRepositoryUtils.explainRepositoryEntryList(list, this._isT, this._explainT, this._tName);
    }

    /**
     * Returns all resources (eg. Matrix rooms) from the repository which are of this type.
     *
     * @returns Array of resources
     */
    private async _getAll () : Promise<readonly SimpleRepositoryEntry<T>[]> {

        const response: MatrixSyncResponseDTO = await this._client.sync(
            {
                filter: {
                    presence: {
                        limit: 0
                    },
                    account_data: {
                        limit: 0
                    },
                    room: {
                        account_data: {
                            limit: 0
                        },
                        ephemeral: {
                            limit: 0
                        },
                        timeline: {
                            limit: 0
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
            }
        );

        LOG.debug(`getAll: response = `, JSON.stringify(response, null, 2));

        const joinObject = response?.rooms?.join ?? {};
        const inviteObject = response?.rooms?.invite ?? {};

        const joinedRooms  : readonly MatrixRoomId[] = keys(joinObject);
        LOG.debug(`joinedRooms = `, joinedRooms);

        const invitedRooms : readonly MatrixRoomId[] = keys(inviteObject);
        LOG.debug(`invitedRooms = `, invitedRooms);

        const roomsNotYetJoined : readonly MatrixRoomId[] = filter(
            invitedRooms,
            (item : MatrixRoomId) : boolean => !joinedRooms.includes(item)
        );

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

                    } catch (err : any) {
                        LOG.warn(`Warning! Could not join client "${this._client.getUserId()}" to room: ${roomId}`);
                    }

                },
                Promise.resolve()
            )

            if (joinedRooms >= 1) {
                LOG.debug("Fetching results again after joining");
                return await this._getAll();
            }

        }

        return reduce(
            joinedRooms,
            (result : readonly SimpleRepositoryEntry<T>[], roomId: MatrixRoomId) : readonly SimpleRepositoryEntry<T>[] => {
                const value : MatrixSyncResponseJoinedRoomDTO = joinObject[roomId];
                const events : readonly MatrixSyncResponseRoomEventDTO[] = filter(
                    value?.state?.events ?? [],
                    (item : MatrixSyncResponseRoomEventDTO) : boolean => {
                        return (
                            (item?.type === this._stateType)
                            && (item?.state_key === this._stateKey)
                            && isNumber(item?.content?.version)
                        );
                    }
                );
                return concat(
                    result,
                    map(
                        events,
                        (item : MatrixSyncResponseRoomEventDTO) : SimpleRepositoryEntry<T> => {

                            // @ts-ignore
                            const data    : T       = item?.content?.data ?? {};

                            // @ts-ignore
                            const version : number  = item?.content?.version;

                            // @ts-ignore
                            const deleted : boolean = !!(item?.content?.deleted);

                            return {
                                data: data,
                                id: roomId,
                                version: version,
                                deleted: deleted
                            };

                        }
                    )
                );
            },
            []
        );

    }

}
