// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { RepositoryEntry } from "../ui/types/RepositoryEntry";
import Repository from "../ui/types/Repository";
import SimpleMatrixClient from "./SimpleMatrixClient";
import MatrixCreateRoomResponseDTO from "./types/response/createRoom/MatrixCreateRoomResponseDTO";
import MatrixCreateRoomPreset
    from "./types/request/createRoom/types/MatrixCreateRoomPreset";
import JsonAny, { isJsonObject, JsonObject } from "../ts/Json";
import MatrixSyncResponseDTO from "./types/response/sync/MatrixSyncResponseDTO";
import LogService from "../ts/LogService";
import {
    concat,
    filter, has,
    isInteger,
    isNumber,
    keys,
    map,
    reduce
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
import { values } from "lodash";

const LOG = LogService.createLogger('MatrixCrudRepository');

/**
 * Saves objects of type T as special matrix rooms identified by `stateType` and `stateKey`.
 */
export class MatrixCrudRepository<T> implements Repository<T> {

    private readonly _client    : SimpleMatrixClient;
    private readonly _stateType : string;
    private readonly _stateKey  : string;

    public constructor (
        client    : SimpleMatrixClient,
        stateType : string,
        stateKey  : string = ''
    ) {
        this._client    = client;
        this._stateType = stateType;
        this._stateKey  = stateKey;
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
                    timeline: {
                        limit: 0,
                        // types: [ this._stateType ]
                    },
                    state: {
                        limit: 1,
                        include_redundant_members: true,
                        types: [ this._stateType ]
                    }
                }
            },
            full_state: true
        });

        LOG.debug(`response = `, JSON.stringify(response, null, 2));

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

                return {
                    data: data,
                    id: roomId,
                    version: version
                };

            }));

            return entries;
            // return MatrixCrudRepository._filterLatest<T>(entries);

        }, []);

    }

    public async getAllByFormId (id: string): Promise<RepositoryEntry<T>[]> {
        throw new Error(`Not implemented yet`);
        // function test (item: MatrixItem<T>) : boolean {
        //     // @ts-ignore
        //     return item?.data?.formId === id;
        // }
        // return map(
        //     filter(this._items, test),
        //     (item: MatrixItem<T>) : RepositoryEntry<T> => ({
        //         id       : item.id,
        //         version  : item.version,
        //         data     : item.data
        //     })
        // );
    }

    public async createItem (data: T) : Promise<RepositoryEntry<T>> {

        const jsonData : JsonAny = data as unknown as JsonAny;
        const version  : number     = 1;

        const content : JsonObject = {
            data    : jsonData,
            version : version
        };

        const response : MatrixCreateRoomResponseDTO = await this._client.createRoom({
            preset: MatrixCreateRoomPreset.PRIVATE_CHAT,
            creation_content: {
                "m.federate": false
            },
            initial_state: [
                {
                    type: this._stateType,
                    state_key: this._stateKey,
                    content: content
                }
            ]
        });

        const room_id = response.room_id;

        return {
            id      : room_id,
            version : version,
            data    : data
        };

    }

    public async findById (id: string) : Promise<RepositoryEntry<T> | undefined> {

        const response : JsonObject | undefined = await this._client.getRoomStateByType(
            id,
            MatrixType.FI_NOR_FORM_DTO,
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

        const record = await this.findById(id);

        if (record === undefined) {
            throw new RequestError(404);
        }

        // const item = find(this._items, item => item.id === id);
        // if (item === undefined) throw new TypeError(`No item found: #${id}`);
        // item.version += 1;
        // item.data = data;
        // return {
        //     id      : item.id,
        //     version : item.version,
        //     data    : item.data
        // };

        if (!isJsonObject(jsonData)) {
            throw new TypeError(`jsonData was not JsonObject: ${jsonData}`);
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
            MatrixType.FI_NOR_FORM_DTO,
            this._stateKey,
            content
        );

        LOG.debug(`response = `, JSON.stringify(response, null, 2));

        return {
            data: jsonData,
            id: id,
            version: newVersion
        };

    }

    public async deleteById (id: string) : Promise<void> {

        throw new Error(`Not implemented yet`);

        // remove(this._items, item => item.id === id);
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
