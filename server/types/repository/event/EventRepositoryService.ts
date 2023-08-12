// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { LogService } from "../../../../../core/LogService";
import { Observer, ObserverCallback, ObserverDestructor } from "../../../../../core/Observer";
import { SimpleRepositoryService } from "../../../../../core/simpleRepository/types/SimpleRepositoryService";
import { StoredEventRepositoryItem } from "./StoredEventRepositoryItem";
import { SimpleRepositoryServiceEvent } from "../../../../../core/simpleRepository/types/SimpleRepositoryServiceEvent";
import { SimpleSharedClientService } from "../../../../../core/simpleRepository/types/SimpleSharedClientService";
import { SimpleRepository } from "../../../../../core/simpleRepository/types/SimpleRepository";
import { SimpleRepositoryInitializer } from "../../../../../core/simpleRepository/types/SimpleRepositoryInitializer";
import { createEventRepositoryItem, EventRepositoryItem, toStoredEventRepositoryItem } from "./EventRepositoryItem";
import { SimpleRepositoryEntry } from "../../../../../core/simpleRepository/types/SimpleRepositoryEntry";
import { map } from "../../../../../core/functions/map";
import { explainEventEntity, isEventEntity } from "./entities/EventEntity";
import { parseJson } from "../../../../../core/Json";

const LOG = LogService.createLogger('EventRepositoryService');

export type EventRepositoryServiceDestructor = ObserverDestructor;

export class EventRepositoryService implements SimpleRepositoryService {

    public Event = SimpleRepositoryServiceEvent;

    protected readonly _sharedClientService : SimpleSharedClientService;
    protected readonly _observer            : Observer<SimpleRepositoryServiceEvent>;
    protected _repository                   : SimpleRepository<StoredEventRepositoryItem>  | undefined;
    protected _repositoryInitializer        : SimpleRepositoryInitializer<StoredEventRepositoryItem>;

    public constructor (
        sharedClientService   : SimpleSharedClientService,
        repositoryInitializer : SimpleRepositoryInitializer<StoredEventRepositoryItem>
    ) {
        this._observer = new Observer<SimpleRepositoryServiceEvent>("EventRepositoryService");
        this._sharedClientService = sharedClientService;
        this._repositoryInitializer = repositoryInitializer;
        this._repository = undefined;
    }

    public on (
        name: SimpleRepositoryServiceEvent,
        callback: ObserverCallback<SimpleRepositoryServiceEvent>
    ): EventRepositoryServiceDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public destroy (): void {
        this._observer.destroy();
    }

    public async initialize () : Promise<void> {
        LOG.debug(`Initialization started`);
        await this._sharedClientService.waitForInitialization();
        const client = this._sharedClientService.getClient();
        if (!client) throw new TypeError(`Client not configured`);
        this._repository = await this._repositoryInitializer.initializeRepository( client );
        LOG.debug(`Initialization finished`);
        if (this._observer.hasCallbacks(SimpleRepositoryServiceEvent.INITIALIZED)) {
            this._observer.triggerEvent(SimpleRepositoryServiceEvent.INITIALIZED);
        }
    }

    public async getAllEvents () : Promise<readonly EventRepositoryItem[]> {
        const list : readonly SimpleRepositoryEntry<StoredEventRepositoryItem>[] = await this._getAllEvents();
        return map(list, (item: SimpleRepositoryEntry<StoredEventRepositoryItem>) : EventRepositoryItem => {
            return this._toEventRepositoryItem(item);
        });
    }

    public async getSomeEvents (
        idList : readonly string[]
    ) : Promise<readonly EventRepositoryItem[]> {
        const list : readonly SimpleRepositoryEntry<StoredEventRepositoryItem>[] = await this._getSomeEvents(idList);
        return map(list, (item: SimpleRepositoryEntry<StoredEventRepositoryItem>) : EventRepositoryItem => {
            return this._toEventRepositoryItem(item);
        });
    }

    public async findEventById (id: string) : Promise<EventRepositoryItem | undefined> {
        await this._sharedClientService.waitForInitialization();
        if (!this._repository) throw new TypeError('No this._repository');
        const foundItem : SimpleRepositoryEntry<StoredEventRepositoryItem> | undefined = await this._repository.findById(id);
        if (!foundItem) return undefined;
        return this._toEventRepositoryItem(foundItem);
    }

    public async deleteAllEvents () : Promise<void> {
        await this._sharedClientService.waitForInitialization();
        if (!this._repository) throw new TypeError('No this._repository');
        const list : readonly SimpleRepositoryEntry<StoredEventRepositoryItem>[] = await this._getAllEvents();
        await this._repository.deleteByList(list);
    }

    public async deleteSomeEvents (
        idList : readonly string[]
    ) : Promise<void> {
        await this._sharedClientService.waitForInitialization();
        if (!this._repository) throw new TypeError('No this._repository');
        const list : readonly SimpleRepositoryEntry<StoredEventRepositoryItem>[] = await this._getSomeEvents(idList);
        await this._repository.deleteByList(list);
    }

    public async createEvent (
        item : EventRepositoryItem
    ) : Promise<EventRepositoryItem> {
        await this._sharedClientService.waitForInitialization();
        const storedItemTemplate = toStoredEventRepositoryItem(item);
        LOG.debug(`createEvent: Going to create: `, item);
        if (!this._repository) throw new TypeError('No this._repository');
        const createdItem : SimpleRepositoryEntry<StoredEventRepositoryItem> = await this._repository.createItem(storedItemTemplate);
        LOG.debug(`createEvent: Created: `, createdItem);
        return this._toEventRepositoryItem(createdItem);
    }

    public async saveEvent (
        item : EventRepositoryItem
    ) : Promise<EventRepositoryItem> {
        await this._sharedClientService.waitForInitialization();
        if (!this._repository) throw new TypeError('No this._repository');
        const foundItem = await this._repository.updateOrCreateItem(toStoredEventRepositoryItem(item));
        return this._toEventRepositoryItem(foundItem);
    }

    // PRIVATE METHODS

    private async _getAllEvents () : Promise<readonly SimpleRepositoryEntry<StoredEventRepositoryItem>[]> {
        if (!this._repository) throw new TypeError('No this._repository');
        return await this._repository.getAll();
    }

    private async _getSomeEvents (
        idList : readonly string[]
    ) : Promise<readonly SimpleRepositoryEntry<StoredEventRepositoryItem>[]> {
        if (!this._repository) throw new TypeError('No this._repository');
        return await this._repository.getSome(idList);
    }

    private _toEventRepositoryItem (storedItem: SimpleRepositoryEntry<StoredEventRepositoryItem>) : EventRepositoryItem {
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
