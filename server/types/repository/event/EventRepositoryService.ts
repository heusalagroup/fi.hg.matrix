// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { LogService } from "../../../../../core/LogService";
import { Observer, ObserverCallback, ObserverDestructor } from "../../../../../core/Observer";
import { RepositoryService } from "../../../../../core/simpleRepository/types/RepositoryService";
import { StoredEventRepositoryItem } from "./StoredEventRepositoryItem";
import { RepositoryServiceEvent } from "../../../../../core/simpleRepository/types/RepositoryServiceEvent";
import { SharedClientService } from "../../../../../core/simpleRepository/types/SharedClientService";
import { Repository } from "../../../../../core/simpleRepository/types/Repository";
import { RepositoryInitializer } from "../../../../../core/simpleRepository/types/RepositoryInitializer";
import { createEventRepositoryItem, EventRepositoryItem, toStoredEventRepositoryItem } from "./EventRepositoryItem";
import { RepositoryEntry } from "../../../../../core/simpleRepository/types/RepositoryEntry";
import {
    map
} from "../../../../../core/modules/lodash";
import { explainEventEntity, isEventEntity } from "./entities/EventEntity";
import { parseJson } from "../../../../../core/Json";

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
            return this._toEventRepositoryItem(item);
        });
    }

    public async getSomeEvents (
        idList : readonly string[]
    ) : Promise<readonly EventRepositoryItem[]> {
        const list : readonly RepositoryEntry<StoredEventRepositoryItem>[] = await this._getSomeEvents(idList);
        return map(list, (item: RepositoryEntry<StoredEventRepositoryItem>) : EventRepositoryItem => {
            return this._toEventRepositoryItem(item);
        });
    }

    public async findEventById (id: string) : Promise<EventRepositoryItem | undefined> {
        await this._sharedClientService.waitForInitialization();
        const foundItem : RepositoryEntry<StoredEventRepositoryItem> | undefined = await this._repository.findById(id);
        if (!foundItem) return undefined;
        return this._toEventRepositoryItem(foundItem);
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

    public async createEvent (
        item : EventRepositoryItem
    ) : Promise<EventRepositoryItem> {
        await this._sharedClientService.waitForInitialization();
        const storedItemTemplate = toStoredEventRepositoryItem(item);
        LOG.debug(`createEvent: Going to create: `, item);
        const createdItem : RepositoryEntry<StoredEventRepositoryItem> = await this._repository.createItem(storedItemTemplate);
        LOG.debug(`createEvent: Created: `, createdItem);
        return this._toEventRepositoryItem(createdItem);
    }

    public async saveEvent (
        item : EventRepositoryItem
    ) : Promise<EventRepositoryItem> {
        await this._sharedClientService.waitForInitialization();
        const foundItem = await this._repository.updateOrCreateItem(toStoredEventRepositoryItem(item));
        return this._toEventRepositoryItem(foundItem);
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

    private _toEventRepositoryItem (storedItem: RepositoryEntry<StoredEventRepositoryItem>) : EventRepositoryItem {
        const id : string = storedItem.id;
        const target : string = storedItem.data.target;
        const data = parseJson(target);
        if ( !isEventEntity(data) ) {
            LOG.debug(`_toEventRepositoryItem: Event "${id}": data = `, data);
            throw new TypeError(`EventRepositoryService: Could not parse repository item "${id}" because ${explainEventEntity(data)}`);
        }
        const item = createEventRepositoryItem(id, data);
        LOG.debug(`Event "${id}" parsed as: `, item);
        return item;
    }

}
