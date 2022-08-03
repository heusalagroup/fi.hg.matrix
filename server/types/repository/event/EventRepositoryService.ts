// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { LogService } from "../../../../../core/LogService";
import { Observer, ObserverCallback, ObserverDestructor } from "../../../../../core/Observer";
import { RepositoryService } from "../../../../../core/simpleRepository/types/RepositoryService";
import { StoredEventRepositoryItem } from "./StoredEventRepositoryItem";
import { RepositoryServiceEvent } from "../../../../../core/simpleRepository/types/RepositoryServiceEvent";
import { SharedClientService } from "../../../../../core/simpleRepository/types/SharedClientService";
import { Repository } from "../../../../../core/simpleRepository/types/Repository";
import { RepositoryInitializer } from "../../../../../core/simpleRepository/types/RepositoryInitializer";
import { EventRepositoryItem, parseEventRepositoryItem, toStoredEventRepositoryItem } from "./EventRepositoryItem";
import { RepositoryEntry } from "../../../../../core/simpleRepository/types/RepositoryEntry";
import { map } from "../../../../../core/modules/lodash";

const LOG = LogService.createLogger('EventRepositoryService');

export type EventRepositoryServiceDestructor = ObserverDestructor;

export class EventRepositoryService implements RepositoryService<StoredEventRepositoryItem> {

    public Event = RepositoryServiceEvent;

    protected readonly _sharedClientService : SharedClientService;
    protected readonly _observer            : Observer<RepositoryServiceEvent>;
    protected _repository                   : Repository<StoredEventRepositoryItem>  | undefined;
    protected _repositoryInitializer        : RepositoryInitializer<StoredEventRepositoryItem>  | undefined;

    public constructor (
        sharedClientService   : SharedClientService,
        repositoryInitializer : RepositoryInitializer<StoredEventRepositoryItem>
    ) {
        this._observer = new Observer<RepositoryServiceEvent>("EventRepositoryService");
        this._sharedClientService = sharedClientService;
        this._repositoryInitializer = repositoryInitializer;
        this._repository = undefined;
    }

    public on (
        name: RepositoryServiceEvent,
        callback: ObserverCallback<RepositoryServiceEvent>
    ): EventRepositoryServiceDestructor {
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

    public async getAllEvents () : Promise<readonly EventRepositoryItem[]> {
        const list : readonly RepositoryEntry<StoredEventRepositoryItem>[] = await this._getAllEvents();
        return map(list, (item: RepositoryEntry<StoredEventRepositoryItem>) : EventRepositoryItem => {
            return parseEventRepositoryItem(
                item.id,
                item.data
            );
        });
    }

    public async getSomeEvents (
        idList : readonly string[]
    ) : Promise<readonly EventRepositoryItem[]> {
        const list : readonly RepositoryEntry<StoredEventRepositoryItem>[] = await this._getSomeEvents(idList);
        return map(list, (item: RepositoryEntry<StoredEventRepositoryItem>) : EventRepositoryItem => {
            return parseEventRepositoryItem(
                item.id,
                item.data
            );
        });
    }

    public async getEventById (id: string) : Promise<EventRepositoryItem | undefined> {
        await this._sharedClientService.waitForInitialization();
        const foundItem : RepositoryEntry<StoredEventRepositoryItem> | undefined = await this._repository.findById(id);
        if (!foundItem) return undefined;
        return parseEventRepositoryItem(
            foundItem.id,
            foundItem.data
        );
    }

    public async deleteAllEvents () : Promise<void> {
        await this._sharedClientService.waitForInitialization();
        const list : readonly RepositoryEntry<StoredEventRepositoryItem>[] = await this._getAllEvents();
        await this._repository.deleteByList(list);
    }

    public async deleteSomeEvents (
        idList : readonly string[]
    ) : Promise<void> {
        await this._sharedClientService.waitForInitialization();
        const list : readonly RepositoryEntry<StoredEventRepositoryItem>[] = await this._getSomeEvents(idList);
        await this._repository.deleteByList(list);
    }

    public async saveEvent (
        item : EventRepositoryItem
    ) : Promise<EventRepositoryItem> {
        await this._sharedClientService.waitForInitialization();
        const foundItem = await this._repository.updateOrCreateItem(toStoredEventRepositoryItem(item));
        return parseEventRepositoryItem(foundItem.id, foundItem.data);
    }

    // PRIVATE METHODS

    private async _getAllEvents () : Promise<readonly RepositoryEntry<StoredEventRepositoryItem>[]> {
        return await this._repository.getAll();
    }

    private async _getSomeEvents (
        idList : readonly string[]
    ) : Promise<readonly RepositoryEntry<StoredEventRepositoryItem>[]> {
        return await this._repository.getSome(idList);
    }

}
