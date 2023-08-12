// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { LogService } from "../../../../../core/LogService";
import { Observer, ObserverCallback, ObserverDestructor } from "../../../../../core/Observer";
import { SimpleRepositoryService } from "../../../../../core/simpleRepository/types/SimpleRepositoryService";
import { StoredRoomRepositoryItem } from "./StoredRoomRepositoryItem";
import { SimpleRepositoryServiceEvent } from "../../../../../core/simpleRepository/types/SimpleRepositoryServiceEvent";
import { SimpleSharedClientService } from "../../../../../core/simpleRepository/types/SimpleSharedClientService";
import { SimpleRepository } from "../../../../../core/simpleRepository/types/SimpleRepository";
import { SimpleRepositoryInitializer } from "../../../../../core/simpleRepository/types/SimpleRepositoryInitializer";
import { RoomRepositoryItem, parseRoomRepositoryItem, toStoredRoomRepositoryItem } from "./RoomRepositoryItem";
import { SimpleRepositoryEntry } from "../../../../../core/simpleRepository/types/SimpleRepositoryEntry";
import { map } from "../../../../../core/functions/map";

const LOG = LogService.createLogger('RoomRepositoryService');

export type RoomRepositoryServiceDestructor = ObserverDestructor;

/**
 * @deprecated SimpleRepository framework should not be used anymore. Will be removed later.
 */
export class RoomRepositoryService implements SimpleRepositoryService {

    public Event = SimpleRepositoryServiceEvent;

    protected readonly _sharedClientService : SimpleSharedClientService;
    protected readonly _observer            : Observer<SimpleRepositoryServiceEvent>;
    protected _repository                   : SimpleRepository<StoredRoomRepositoryItem>  | undefined;
    protected _repositoryInitializer        : SimpleRepositoryInitializer<StoredRoomRepositoryItem>  | undefined;

    public constructor (
        sharedClientService   : SimpleSharedClientService,
        repositoryInitializer : SimpleRepositoryInitializer<StoredRoomRepositoryItem>
    ) {
        this._observer = new Observer<SimpleRepositoryServiceEvent>("RoomRepositoryService");
        this._sharedClientService = sharedClientService;
        this._repositoryInitializer = repositoryInitializer;
        this._repository = undefined;
    }

    public on (
        name: SimpleRepositoryServiceEvent,
        callback: ObserverCallback<SimpleRepositoryServiceEvent>
    ): RoomRepositoryServiceDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public destroy (): void {
        this._observer.destroy();
    }

    public async initialize () : Promise<void> {
        LOG.debug(`Initialization started`);
        await this._sharedClientService.waitForInitialization();
        if (!this._repositoryInitializer) throw new TypeError(`Repository uninitialized`);
        const client = this._sharedClientService.getClient();
        if (!client) throw new TypeError(`Client uninitialized`);
        this._repository = await this._repositoryInitializer.initializeRepository( client );
        LOG.debug(`Initialization finished`);
        if (this._observer.hasCallbacks(SimpleRepositoryServiceEvent.INITIALIZED)) {
            this._observer.triggerEvent(SimpleRepositoryServiceEvent.INITIALIZED);
        }
    }

    public async getAllRooms () : Promise<readonly RoomRepositoryItem[]> {
        const list : readonly SimpleRepositoryEntry<StoredRoomRepositoryItem>[] = await this._getAllRooms();
        return map(list, (item: SimpleRepositoryEntry<StoredRoomRepositoryItem>) : RoomRepositoryItem => {
            return this._toRoomRepositoryItem(item);
        });
    }

    public async getSomeRooms (
        idList : readonly string[]
    ) : Promise<readonly RoomRepositoryItem[]> {
        const list : readonly SimpleRepositoryEntry<StoredRoomRepositoryItem>[] = await this._getSomeRooms(idList);
        return map(list, (item: SimpleRepositoryEntry<StoredRoomRepositoryItem>) : RoomRepositoryItem => {
            return this._toRoomRepositoryItem(item);
        });
    }

    public async findRoomById (id: string) : Promise<RoomRepositoryItem | undefined> {
        await this._sharedClientService.waitForInitialization();
        if (!this._repository) throw new TypeError(`Repository uninitialized`);
        const foundItem : SimpleRepositoryEntry<StoredRoomRepositoryItem> | undefined = await this._repository.findById(id);
        if (!foundItem) return undefined;
        return this._toRoomRepositoryItem(foundItem);
    }

    public async deleteAllRooms () : Promise<void> {
        await this._sharedClientService.waitForInitialization();
        const list : readonly SimpleRepositoryEntry<StoredRoomRepositoryItem>[] = await this._getAllRooms();
        if (!this._repository) throw new TypeError(`Repository uninitialized`);
        await this._repository.deleteByList(list);
    }

    public async deleteSomeRooms (
        idList : readonly string[]
    ) : Promise<void> {
        await this._sharedClientService.waitForInitialization();
        const list : readonly SimpleRepositoryEntry<StoredRoomRepositoryItem>[] = await this._getSomeRooms(idList);
        if (!this._repository) throw new TypeError(`Repository uninitialized`);
        await this._repository.deleteByList(list);
    }

    public async createRoom (
        item : RoomRepositoryItem
    ) : Promise<RoomRepositoryItem> {
        await this._sharedClientService.waitForInitialization();
        if (!this._repository) throw new TypeError(`Repository uninitialized`);
        const createdItem = await this._repository.createItem(toStoredRoomRepositoryItem(item));
        return this._toRoomRepositoryItem(createdItem);
    }

    public async saveRoom (
        item : RoomRepositoryItem
    ) : Promise<RoomRepositoryItem> {
        await this._sharedClientService.waitForInitialization();
        if (!this._repository) throw new TypeError(`Repository uninitialized`);
        const foundItem = await this._repository.updateOrCreateItem(toStoredRoomRepositoryItem(item));
        return this._toRoomRepositoryItem(foundItem);
    }

    // PRIVATE METHODS

    private async _getAllRooms () : Promise<readonly SimpleRepositoryEntry<StoredRoomRepositoryItem>[]> {
        if (!this._repository) throw new TypeError(`Repository uninitialized`);
        return await this._repository.getAll();
    }

    private async _getSomeRooms (
        idList : readonly string[]
    ) : Promise<readonly SimpleRepositoryEntry<StoredRoomRepositoryItem>[]> {
        if (!this._repository) throw new TypeError(`Repository uninitialized`);
        return await this._repository.getSome(idList);
    }

    private _toRoomRepositoryItem (storedItem: SimpleRepositoryEntry<StoredRoomRepositoryItem>) : RoomRepositoryItem {
        const id = storedItem.id;
        const target = storedItem.data?.target;
        LOG.debug(`Room with id "${id}": `, storedItem, target);
        const item = parseRoomRepositoryItem(
            id,
            target
        );
        LOG.debug(`Room "${id}" as: `, item);
        if (!item) {
            throw new TypeError(`RoomRepositoryService: Could not parse "${storedItem.id}" and ${JSON.stringify(target)}`);
        }
        return item;
    }

}
