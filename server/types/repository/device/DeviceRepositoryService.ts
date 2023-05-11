// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { LogService } from "../../../../../core/LogService";
import { Observer, ObserverCallback, ObserverDestructor } from "../../../../../core/Observer";
import { SimpleRepositoryService } from "../../../../../core/simpleRepository/types/SimpleRepositoryService";
import { StoredDeviceRepositoryItem } from "./StoredDeviceRepositoryItem";
import { SimpleRepositoryServiceEvent } from "../../../../../core/simpleRepository/types/SimpleRepositoryServiceEvent";
import { SimpleSharedClientService } from "../../../../../core/simpleRepository/types/SimpleSharedClientService";
import { SimpleRepository } from "../../../../../core/simpleRepository/types/SimpleRepository";
import { SimpleRepositoryInitializer } from "../../../../../core/simpleRepository/types/SimpleRepositoryInitializer";
import { DeviceRepositoryItem, parseDeviceRepositoryItem, toStoredDeviceRepositoryItem } from "./DeviceRepositoryItem";
import { SimpleRepositoryEntry } from "../../../../../core/simpleRepository/types/SimpleRepositoryEntry";
import { map } from "../../../../../core/functions/map";

const LOG = LogService.createLogger('DeviceRepositoryService');

export type DeviceRepositoryServiceDestructor = ObserverDestructor;

export class DeviceRepositoryService implements SimpleRepositoryService<StoredDeviceRepositoryItem> {

    public Event = SimpleRepositoryServiceEvent;

    protected readonly _sharedClientService : SimpleSharedClientService;
    protected readonly _observer            : Observer<SimpleRepositoryServiceEvent>;
    protected _repository                   : SimpleRepository<StoredDeviceRepositoryItem>  | undefined;
    protected _repositoryInitializer        : SimpleRepositoryInitializer<StoredDeviceRepositoryItem>  | undefined;

    public constructor (
        sharedClientService   : SimpleSharedClientService,
        repositoryInitializer : SimpleRepositoryInitializer<StoredDeviceRepositoryItem>
    ) {
        this._observer = new Observer<SimpleRepositoryServiceEvent>("DeviceRepositoryService");
        this._sharedClientService = sharedClientService;
        this._repositoryInitializer = repositoryInitializer;
        this._repository = undefined;
    }

    public on (
        name: SimpleRepositoryServiceEvent,
        callback: ObserverCallback<SimpleRepositoryServiceEvent>
    ): DeviceRepositoryServiceDestructor {
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
        if (!client) throw new TypeError(`Client not configured`);
        this._repository = await this._repositoryInitializer.initializeRepository( client );
        LOG.debug(`Initialization finished`);
        if (this._observer.hasCallbacks(SimpleRepositoryServiceEvent.INITIALIZED)) {
            this._observer.triggerEvent(SimpleRepositoryServiceEvent.INITIALIZED);
        }
    }

    public async getAllDevices () : Promise<readonly DeviceRepositoryItem[]> {
        const list : readonly SimpleRepositoryEntry<StoredDeviceRepositoryItem>[] = await this._getAllDevices();
        return map(list, (item: SimpleRepositoryEntry<StoredDeviceRepositoryItem>) : DeviceRepositoryItem => {
            return this._toDeviceRepositoryItem(item);
        });
    }

    public async getSomeDevices (
        idList : readonly string[]
    ) : Promise<readonly DeviceRepositoryItem[]> {
        const list : readonly SimpleRepositoryEntry<StoredDeviceRepositoryItem>[] = await this._getSomeDevices(idList);
        return map(list, (item: SimpleRepositoryEntry<StoredDeviceRepositoryItem>) : DeviceRepositoryItem => {
            return this._toDeviceRepositoryItem(item);
        });
    }

    /**
     * Find by the internal repository device ID
     *
     * @param id
     */
    public async findDeviceById (id: string) : Promise<DeviceRepositoryItem | undefined> {
        await this._sharedClientService.waitForInitialization();
        if (!this._repository) throw new TypeError(`Repository uninitialized`);
        const foundItem : SimpleRepositoryEntry<StoredDeviceRepositoryItem> | undefined = await this._repository.findById(id);
        if (!foundItem) return undefined;
        return this._toDeviceRepositoryItem(foundItem);
    }

    /**
     * Find using the possibly user defined device id
     *
     * @param id
     */
    public async findDeviceByDeviceId (id: string) : Promise<DeviceRepositoryItem | undefined> {
        await this._sharedClientService.waitForInitialization();
        if (!this._repository) throw new TypeError(`Repository uninitialized`);
        const foundItem : SimpleRepositoryEntry<StoredDeviceRepositoryItem> | undefined = await this._repository.findByProperty("deviceId", id);
        if (!foundItem) return undefined;
        return this._toDeviceRepositoryItem(foundItem);
    }

    public async deleteAllDevices () : Promise<void> {
        await this._sharedClientService.waitForInitialization();
        const list : readonly SimpleRepositoryEntry<StoredDeviceRepositoryItem>[] = await this._getAllDevices();
        if (!this._repository) throw new TypeError(`Repository uninitialized`);
        await this._repository.deleteByList(list);
    }

    public async deleteSomeDevices (
        idList : readonly string[]
    ) : Promise<void> {
        await this._sharedClientService.waitForInitialization();
        const list : readonly SimpleRepositoryEntry<StoredDeviceRepositoryItem>[] = await this._getSomeDevices(idList);
        if (!this._repository) throw new TypeError(`Repository uninitialized`);
        await this._repository.deleteByList(list);
    }

    public async saveDevice (
        item : DeviceRepositoryItem
    ) : Promise<DeviceRepositoryItem> {
        await this._sharedClientService.waitForInitialization();
        if (!this._repository) throw new TypeError(`Repository uninitialized`);
        const storedRepositoryItem : StoredDeviceRepositoryItem = toStoredDeviceRepositoryItem(item);
        const foundItem = await this._repository.updateOrCreateItem(storedRepositoryItem);
        return this._toDeviceRepositoryItem(foundItem);
    }

    // PRIVATE METHODS

    private async _getAllDevices () : Promise<readonly SimpleRepositoryEntry<StoredDeviceRepositoryItem>[]> {
        if (!this._repository) throw new TypeError(`Repository uninitialized`);
        return await this._repository.getAll();
    }

    private async _getSomeDevices (
        idList : readonly string[]
    ) : Promise<readonly SimpleRepositoryEntry<StoredDeviceRepositoryItem>[]> {
        if (!this._repository) throw new TypeError(`Repository uninitialized`);
        return await this._repository.getSome(idList);
    }

    private _toDeviceRepositoryItem (storedItem: SimpleRepositoryEntry<StoredDeviceRepositoryItem>) : DeviceRepositoryItem {
        const id = storedItem.id;
        const target = storedItem.data?.target;
        LOG.debug(`Device with id "${id}": `, storedItem, target);
        const item = parseDeviceRepositoryItem(
            id,
            target
        );
        LOG.debug(`Device "${id}" parsed as: `, item);
        if (!item) {
            throw new TypeError(`DeviceRepositoryService: Could not parse "${storedItem.id}" and ${JSON.stringify(target)}`);
        }
        return item;
    }

}
