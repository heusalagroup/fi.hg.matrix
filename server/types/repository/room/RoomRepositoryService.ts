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
import { map } from "../../../../../core/modules/lodash";

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
        this._repository = await this._repositoryInitializer.initializeRepository( this._sharedClientService.getClient() );
        LOG.debug(`Initialization finished`);
        if (this._observer.hasCallbacks(RepositoryServiceEvent.INITIALIZED)) {
            this._observer.triggerEvent(RepositoryServiceEvent.INITIALIZED);
        }
    }

    public async getAllRooms () : Promise<readonly RoomRepositoryItem[]> {
        const list : readonly RepositoryEntry<StoredRoomRepositoryItem>[] = await this._getAllRooms();
        return map(list, (item: RepositoryEntry<StoredRoomRepositoryItem>) : RoomRepositoryItem => {
            return parseRoomRepositoryItem(
                item.id,
                item.data
            );
        });
    }

    public async getSomeRooms (
        idList : readonly string[]
    ) : Promise<readonly RoomRepositoryItem[]> {
        const list : readonly RepositoryEntry<StoredRoomRepositoryItem>[] = await this._getSomeRooms(idList);
        return map(list, (item: RepositoryEntry<StoredRoomRepositoryItem>) : RoomRepositoryItem => {
            return parseRoomRepositoryItem(
                item.id,
                item.data
            );
        });
    }

    public async getRoomById (id: string) : Promise<RoomRepositoryItem | undefined> {
        await this._sharedClientService.waitForInitialization();
        const foundItem : RepositoryEntry<StoredRoomRepositoryItem> | undefined = await this._repository.findById(id);
        if (!foundItem) return undefined;
        return parseRoomRepositoryItem(
            foundItem.id,
            foundItem.data
        );
    }

    public async deleteAllRooms () : Promise<void> {
        await this._sharedClientService.waitForInitialization();
        const list : readonly RepositoryEntry<StoredRoomRepositoryItem>[] = await this._getAllRooms();
        await this._repository.deleteByList(list);
    }

    public async deleteSomeRooms (
        idList : readonly string[]
    ) : Promise<void> {
        await this._sharedClientService.waitForInitialization();
        const list : readonly RepositoryEntry<StoredRoomRepositoryItem>[] = await this._getSomeRooms(idList);
        await this._repository.deleteByList(list);
    }

    public async saveRoom (
        item : RoomRepositoryItem
    ) : Promise<RoomRepositoryItem> {
        await this._sharedClientService.waitForInitialization();
        const foundItem = await this._repository.updateOrCreateItem(toStoredRoomRepositoryItem(item));
        return parseRoomRepositoryItem(foundItem.id, foundItem.data);
    }

    // PRIVATE METHODS

    private async _getAllRooms () : Promise<readonly RepositoryEntry<StoredRoomRepositoryItem>[]> {
        return await this._repository.getAll();
    }

    private async _getSomeRooms (
        idList : readonly string[]
    ) : Promise<readonly RepositoryEntry<StoredRoomRepositoryItem>[]> {
        return await this._repository.getSome(idList);
    }

}
