// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { LogService } from "../../../../../core/LogService";
import { Observer, ObserverCallback, ObserverDestructor } from "../../../../../core/Observer";
import { RepositoryService } from "../../../../../core/simpleRepository/types/RepositoryService";
import { StoredDeviceRepositoryItem } from "./StoredDeviceRepositoryItem";
import { RepositoryServiceEvent } from "../../../../../core/simpleRepository/types/RepositoryServiceEvent";
import { SharedClientService } from "../../../../../core/simpleRepository/types/SharedClientService";
import { Repository } from "../../../../../core/simpleRepository/types/Repository";
import { RepositoryInitializer } from "../../../../../core/simpleRepository/types/RepositoryInitializer";
import { DeviceRepositoryItem, parseDeviceRepositoryItem, toStoredDeviceRepositoryItem } from "./DeviceRepositoryItem";
import { RepositoryEntry } from "../../../../../core/simpleRepository/types/RepositoryEntry";
import { map } from "../../../../../core/modules/lodash";

const LOG = LogService.createLogger('DeviceRepositoryService');

export type DeviceRepositoryServiceDestructor = ObserverDestructor;

export class DeviceRepositoryService implements RepositoryService<StoredDeviceRepositoryItem> {

    public Event = RepositoryServiceEvent;

    protected readonly _sharedClientService : SharedClientService;
    protected readonly _observer            : Observer<RepositoryServiceEvent>;
    protected _repository                   : Repository<StoredDeviceRepositoryItem>  | undefined;
    protected _repositoryInitializer        : RepositoryInitializer<StoredDeviceRepositoryItem>  | undefined;

    public constructor (
        sharedClientService   : SharedClientService,
        repositoryInitializer : RepositoryInitializer<StoredDeviceRepositoryItem>
    ) {
        this._observer = new Observer<RepositoryServiceEvent>("DeviceRepositoryService");
        this._sharedClientService = sharedClientService;
        this._repositoryInitializer = repositoryInitializer;
        this._repository = undefined;
    }

    public on (
        name: RepositoryServiceEvent,
        callback: ObserverCallback<RepositoryServiceEvent>
    ): DeviceRepositoryServiceDestructor {
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

    public async getAllDevices () : Promise<readonly DeviceRepositoryItem[]> {
        const list : readonly RepositoryEntry<StoredDeviceRepositoryItem>[] = await this._getAllDevices();
        return map(list, (item: RepositoryEntry<StoredDeviceRepositoryItem>) : DeviceRepositoryItem => {
            return parseDeviceRepositoryItem(
                item.id,
                item.data
            );
        });
    }

    public async getSomeDevices (
        idList : readonly string[]
    ) : Promise<readonly DeviceRepositoryItem[]> {
        const list : readonly RepositoryEntry<StoredDeviceRepositoryItem>[] = await this._getSomeDevices(idList);
        return map(list, (item: RepositoryEntry<StoredDeviceRepositoryItem>) : DeviceRepositoryItem => {
            return parseDeviceRepositoryItem(
                item.id,
                item.data
            );
        });
    }

    public async getDeviceById (id: string) : Promise<DeviceRepositoryItem | undefined> {
        await this._sharedClientService.waitForInitialization();
        const foundItem : RepositoryEntry<StoredDeviceRepositoryItem> | undefined = await this._repository.findById(id);
        if (!foundItem) return undefined;
        return parseDeviceRepositoryItem(
            foundItem.id,
            foundItem.data
        );
    }

    public async deleteAllDevices () : Promise<void> {
        await this._sharedClientService.waitForInitialization();
        const list : readonly RepositoryEntry<StoredDeviceRepositoryItem>[] = await this._getAllDevices();
        await this._repository.deleteByList(list);
    }

    public async deleteSomeDevices (
        idList : readonly string[]
    ) : Promise<void> {
        await this._sharedClientService.waitForInitialization();
        const list : readonly RepositoryEntry<StoredDeviceRepositoryItem>[] = await this._getSomeDevices(idList);
        await this._repository.deleteByList(list);
    }

    public async saveDevice (
        item : DeviceRepositoryItem
    ) : Promise<DeviceRepositoryItem> {
        await this._sharedClientService.waitForInitialization();
        const foundItem = await this._repository.updateOrCreateItem(toStoredDeviceRepositoryItem(item));
        return parseDeviceRepositoryItem(foundItem.id, foundItem.data);
    }

    // PRIVATE METHODS

    private async _getAllDevices () : Promise<readonly RepositoryEntry<StoredDeviceRepositoryItem>[]> {
        return await this._repository.getAll();
    }

    private async _getSomeDevices (
        idList : readonly string[]
    ) : Promise<readonly RepositoryEntry<StoredDeviceRepositoryItem>[]> {
        return await this._repository.getSome(idList);
    }

}
