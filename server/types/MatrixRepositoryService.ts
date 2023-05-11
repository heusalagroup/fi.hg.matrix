// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { LogService } from "../../../core/LogService";
import { Observer, ObserverCallback, ObserverDestructor } from "../../../core/Observer";
import { SimpleRepositoryService } from "../../../core/simpleRepository/types/SimpleRepositoryService";
import { SimpleRepositoryServiceEvent } from "../../../core/simpleRepository/types/SimpleRepositoryServiceEvent";
import { SimpleSharedClientService } from "../../../core/simpleRepository/types/SimpleSharedClientService";
import { SimpleRepository } from "../../../core/simpleRepository/types/SimpleRepository";
import { SimpleRepositoryInitializer } from "../../../core/simpleRepository/types/SimpleRepositoryInitializer";
import { SimpleRepositoryEntry } from "../../../core/simpleRepository/types/SimpleRepositoryEntry";
import { StoredDeviceRepositoryItem } from "./repository/device/StoredDeviceRepositoryItem";
import { createDeviceRepositoryItem, DeviceRepositoryItem, parseDeviceRepositoryItem, toStoredDeviceRepositoryItem } from "./repository/device/DeviceRepositoryItem";
import { map } from "../../../core/functions/map";
import { parseJson } from "../../../core/Json";
import { isDevice } from "./repository/device/Device";

const LOG = LogService.createLogger('HgHsDeviceRepositoryService');

export type HgHsDeviceRepositoryServiceDestructor = ObserverDestructor;

export class HgHsDeviceRepositoryService implements SimpleRepositoryService<StoredDeviceRepositoryItem> {

    public Event = SimpleRepositoryServiceEvent;

    protected readonly _sharedClientService : SimpleSharedClientService;
    protected readonly _observer            : Observer<SimpleRepositoryServiceEvent>;
    protected _repository                   : SimpleRepository<StoredDeviceRepositoryItem>  | undefined;
    protected _repositoryInitializer        : SimpleRepositoryInitializer<StoredDeviceRepositoryItem>  | undefined;

    public constructor (
        sharedClientService   : SimpleSharedClientService,
        repositoryInitializer : SimpleRepositoryInitializer<StoredDeviceRepositoryItem>
    ) {
        this._observer = new Observer<SimpleRepositoryServiceEvent>("HgHsDeviceRepositoryService");
        this._sharedClientService = sharedClientService;
        this._repositoryInitializer = repositoryInitializer;
        this._repository = undefined;
    }

    public on (
        name: SimpleRepositoryServiceEvent,
        callback: ObserverCallback<SimpleRepositoryServiceEvent>
    ): HgHsDeviceRepositoryServiceDestructor {
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

    public async getAllDevices () : Promise<readonly DeviceRepositoryItem[]> {
        const list : readonly SimpleRepositoryEntry<StoredDeviceRepositoryItem>[] = await this._getAllDevices();
        return map(list, (item: SimpleRepositoryEntry<StoredDeviceRepositoryItem>) : DeviceRepositoryItem => {
            const data = parseJson(item.data);
            if (!isDevice(data)) throw new TypeError(`MatrixRepositoryService: Could not parse data: ${item.data}`);
            return createDeviceRepositoryItem(
                item.id,
                data
            );
        });
    }

    public async getSomeDevices (
        idList : readonly string[]
    ) : Promise<readonly DeviceRepositoryItem[]> {
        const list : readonly SimpleRepositoryEntry<StoredDeviceRepositoryItem>[] = await this._getSomeDevices(idList);
        return map(list, (item: SimpleRepositoryEntry<StoredDeviceRepositoryItem>) : DeviceRepositoryItem => {
            const data = parseJson(item.data);
            if (!isDevice(data)) throw new TypeError(`MatrixRepositoryService: Could not parse data: ${item.data}`);
            const parsedItem = parseDeviceRepositoryItem(item.id, data);
            if (!parsedItem) throw new TypeError(`MatrixRepositoryService: Could not parse data: ${item.data}`);
            return parsedItem;
        });
    }

    public async getDeviceById (id: string) : Promise<DeviceRepositoryItem | undefined> {
        await this._sharedClientService.waitForInitialization();
        if (!this._repository) throw new TypeError(`Repository uninitialized`);
        const foundItem : SimpleRepositoryEntry<StoredDeviceRepositoryItem> | undefined = await this._repository.findById(id);
        if (!foundItem) return undefined;
        return parseDeviceRepositoryItem(
            foundItem.id,
            foundItem.data
        );
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
        const foundItem = await this._repository.updateOrCreateItem(toStoredDeviceRepositoryItem(item));
        const parsedItem = parseDeviceRepositoryItem(foundItem.id, foundItem.data);
        if (!parsedItem) throw new TypeError(`Could not parse item`);
        return parsedItem;
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

}
