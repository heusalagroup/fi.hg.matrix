// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { LogService } from "../../../../../core/LogService";
import { Observer, ObserverCallback, ObserverDestructor } from "../../../../../core/Observer";
import { RepositoryService } from "../../../../../core/simpleRepository/types/RepositoryService";
import { StoredRoomRepositoryItem } from "./StoredRoomRepositoryItem";
import { RepositoryServiceEvent } from "../../../../../core/simpleRepository/types/RepositoryServiceEvent";
import { SharedClientService } from "../../../../../core/simpleRepository/types/SharedClientService";
import { Repository } from "../../../../../core/simpleRepository/types/Repository";
import { RepositoryInitializer } from "../../../../../core/simpleRepository/types/RepositoryInitializer";
import { RoomRepositoryItem, parseRoomRepositoryItem, toStoredRoomRepositoryItem } from "./RoomRepositoryItem";
import { RepositoryEntry } from "../../../../../core/simpleRepository/types/RepositoryEntry";
import { map } from "../../../../../core/functions/map";

const LOG = LogService.createLogger('RoomRepositoryService');

export type RoomRepositoryServiceDestructor = ObserverDestructor;

export class RoomRepositoryService implements RepositoryService<StoredRoomRepositoryItem> {

    public Event = RepositoryServiceEvent;

    protected readonly _sharedClientService : SharedClientService;
    protected readonly _observer            : Observer<RepositoryServiceEvent>;
    protected _repository                   : Repository<StoredRoomRepositoryItem>  | undefined;
    protected _repositoryInitializer        : RepositoryInitializer<StoredRoomRepositoryItem>  | undefined;

    public constructor (
        sharedClientService   : SharedClientService,
        repositoryInitializer : RepositoryInitializer<StoredRoomRepositoryItem>
    ) {
        this._observer = new Observer<RepositoryServiceEvent>("RoomRepositoryService");
        this._sharedClientService = sharedClientService;
        this._repositoryInitializer = repositoryInitializer;
        this._repository = undefined;
    }

    public on (
        name: RepositoryServiceEvent,
        callback: ObserverCallback<RepositoryServiceEvent>
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
        if (this._observer.hasCallbacks(RepositoryServiceEvent.INITIALIZED)) {
            this._observer.triggerEvent(RepositoryServiceEvent.INITIALIZED);
        }
    }

    public async getAllRooms () : Promise<readonly RoomRepositoryItem[]> {
        const list : readonly RepositoryEntry<StoredRoomRepositoryItem>[] = await this._getAllRooms();
        return map(list, (item: RepositoryEntry<StoredRoomRepositoryItem>) : RoomRepositoryItem => {
            return this._toRoomRepositoryItem(item);
        });
    }

    public async getSomeRooms (
        idList : readonly string[]
    ) : Promise<readonly RoomRepositoryItem[]> {
        const list : readonly RepositoryEntry<StoredRoomRepositoryItem>[] = await this._getSomeRooms(idList);
        return map(list, (item: RepositoryEntry<StoredRoomRepositoryItem>) : RoomRepositoryItem => {
            return this._toRoomRepositoryItem(item);
        });
    }

    public async findRoomById (id: string) : Promise<RoomRepositoryItem | undefined> {
        await this._sharedClientService.waitForInitialization();
        if (!this._repository) throw new TypeError(`Repository uninitialized`);
        const foundItem : RepositoryEntry<StoredRoomRepositoryItem> | undefined = await this._repository.findById(id);
        if (!foundItem) return undefined;
        return this._toRoomRepositoryItem(foundItem);
    }

    public async deleteAllRooms () : Promise<void> {
        await this._sharedClientService.waitForInitialization();
        const list : readonly RepositoryEntry<StoredRoomRepositoryItem>[] = await this._getAllRooms();
        if (!this._repository) throw new TypeError(`Repository uninitialized`);
        await this._repository.deleteByList(list);
    }

    public async deleteSomeRooms (
        idList : readonly string[]
    ) : Promise<void> {
        await this._sharedClientService.waitForInitialization();
        const list : readonly RepositoryEntry<StoredRoomRepositoryItem>[] = await this._getSomeRooms(idList);
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

    private async _getAllRooms () : Promise<readonly RepositoryEntry<StoredRoomRepositoryItem>[]> {
        if (!this._repository) throw new TypeError(`Repository uninitialized`);
        return await this._repository.getAll();
    }

    private async _getSomeRooms (
        idList : readonly string[]
    ) : Promise<readonly RepositoryEntry<StoredRoomRepositoryItem>[]> {
        if (!this._repository) throw new TypeError(`Repository uninitialized`);
        return await this._repository.getSome(idList);
    }

    private _toRoomRepositoryItem (storedItem: RepositoryEntry<StoredRoomRepositoryItem>) : RoomRepositoryItem {
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
