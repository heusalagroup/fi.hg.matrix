// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { RepositoryEntry } from "../ui/types/RepositoryEntry";
import Repository from "../ui/types/Repository";
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
    has,
    get,
    isInteger,
    isNumber,
    keys,
    map,
    reduce,
    values,
    parseNonEmptyString
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

const LOG = LogService.createLogger('MatrixCrudRepository');

/**
 * Saves JSON-able objects of type T as special Matrix.org rooms identified by `stateType` and `stateKey`.
 *
 * See also [MemoryRepository](https://github.com/sendanor/ui/blob/main/repository/MemoryRepository.ts)
 */
export class MatrixCrudRepository<T> implements Repository<T> {

    private readonly _client         : SimpleMatrixClient;
    private readonly _serviceAccount : SimpleMatrixClient | undefined;
    private readonly _stateType      : string;
    private readonly _stateKey       : string;
    private readonly _deletedType    : string;
    private readonly _deletedKey     : string;

    /**
     * Creates an instance of MatrixCrudRepository.
     *
     * @param client Use `SimpleMatrixClient.login(user, pw) : Promise<SimpleMatrixClient>` to get
     *               a client instance which has authenticated.
     *
     * @param stateType The MatrixType for this type of resource. Use matrix-style namespace syntax,
     *                  eg. `com.example.foo.dto`.
     *
     * @param stateKey Optional. The state key, defaults to ''.
     *
     * @param serviceAccount Optional. If defined, this user will be joined to any created rooms
     *                       and removed from them when resoure-room is destroyed.
     *
     * @param deletedType Optional. The state event type to add to any resource which is deleted.
     *                    Defaults to `MatrixType.FI_NOR_DELETED`.
     *
     * @param deletedKey Optional. The state key for deletedType, defaults to ''.
     */
    public constructor (
        client          : SimpleMatrixClient,
        stateType       : string,
        stateKey        : string             | undefined = undefined,
        serviceAccount  : SimpleMatrixClient | undefined = undefined,
        deletedType     : string             | undefined = undefined,
        deletedKey      : string             | undefined = undefined
    ) {
        this._client         = client;
        this._stateType      = stateType;
        this._stateKey       = stateKey                          ?? '';
        this._serviceAccount = serviceAccount                    ?? undefined;
        this._deletedType    = parseNonEmptyString(deletedType)  ?? MatrixType.FI_NOR_DELETED;
        this._deletedKey     = deletedKey                        ?? '';
    }

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

        LOG.debug(`getAll: response = `, response);

        const joinObject = response?.rooms?.join ?? {};

        const joinedRoomIds : string[] = keys(joinObject);

        return reduce(joinedRoomIds, (result : RepositoryEntry<T>[], roomId: MatrixRoomId) : RepositoryEntry<T>[] => {

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
     *
     * @param propertyName This may also be a path to value inside the model,
     *                     eg. `user.id` to match `{user: {id: 123}}`.
     * @param propertyValue
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

    public async createItem (data: T) : Promise<RepositoryEntry<T>> {

        const jsonData : JsonAny = data as unknown as JsonAny;
        const version  : number     = 1;

        const content : JsonObject = {
            data    : jsonData,
            version : version
        };

        const serviceAccountId = this._serviceAccount?.getUserId();

        const response : MatrixCreateRoomResponseDTO = await this._client.createRoom({
            preset: MatrixCreateRoomPreset.PRIVATE_CHAT,
            creation_content: {
                "m.federate": false
            },
            invite: serviceAccountId ? [ serviceAccountId ] : [],
            initial_state: [
                {
                    type: this._stateType,
                    state_key: this._stateKey,
                    content: content
                }
            ]
        });

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

    public async findById (id: string) : Promise<RepositoryEntry<T> | undefined> {

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

        return {
            // @ts-ignore
            data: data,
            id: id,
            version: version
        };

    }

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

                await this._serviceAccount.leaveRoom(id);

                await this._serviceAccount.forgetRoom(id);

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

    private static _filterLatest<T> (list : RepositoryEntry<T>[]) : RepositoryEntry<T>[] {

        return values(reduce(
            list,
            (cache: {[key: string]: RepositoryEntry<T>}, item: RepositoryEntry<T>) : {[key: string]: RepositoryEntry<T>} => {

                if (!has(cache, item.id)) {
                    cache[item.id] = item;
                } else if (item.version > cache[item.id].version) {
                    cache[item.id] = item;
                }

                return cache;

            },
            {} as {[key: string]: RepositoryEntry<T>}
        ));

    }

}

export default MatrixCrudRepository;
