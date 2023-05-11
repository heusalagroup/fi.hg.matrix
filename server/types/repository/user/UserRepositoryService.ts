// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { LogService } from "../../../../../core/LogService";
import { Observer, ObserverCallback, ObserverDestructor } from "../../../../../core/Observer";
import { SimpleRepositoryService } from "../../../../../core/simpleRepository/types/SimpleRepositoryService";
import { StoredUserRepositoryItem } from "./StoredUserRepositoryItem";
import { SimpleRepositoryServiceEvent } from "../../../../../core/simpleRepository/types/SimpleRepositoryServiceEvent";
import { SimpleSharedClientService } from "../../../../../core/simpleRepository/types/SimpleSharedClientService";
import { SimpleRepository } from "../../../../../core/simpleRepository/types/SimpleRepository";
import { SimpleRepositoryInitializer } from "../../../../../core/simpleRepository/types/SimpleRepositoryInitializer";
import { UserRepositoryItem, parseUserRepositoryItem, toStoredUserRepositoryItem } from "./UserRepositoryItem";
import { SimpleRepositoryEntry } from "../../../../../core/simpleRepository/types/SimpleRepositoryEntry";
import { map } from "../../../../../core/functions/map";
import { toLower } from "../../../../../core/functions/toLower";

const LOG = LogService.createLogger('UserRepositoryService');

export type UserRepositoryServiceDestructor = ObserverDestructor;

export class UserRepositoryService implements SimpleRepositoryService<StoredUserRepositoryItem> {

    public Event = SimpleRepositoryServiceEvent;

    protected readonly _sharedClientService : SimpleSharedClientService;
    protected readonly _observer            : Observer<SimpleRepositoryServiceEvent>;
    protected _repository                   : SimpleRepository<StoredUserRepositoryItem>  | undefined;
    protected _repositoryInitializer        : SimpleRepositoryInitializer<StoredUserRepositoryItem>;

    public constructor (
        sharedClientService   : SimpleSharedClientService,
        repositoryInitializer : SimpleRepositoryInitializer<StoredUserRepositoryItem>
    ) {
        this._observer = new Observer<SimpleRepositoryServiceEvent>("UserRepositoryService");
        this._sharedClientService = sharedClientService;
        this._repositoryInitializer = repositoryInitializer;
        this._repository = undefined;
    }

    public on (
        name: SimpleRepositoryServiceEvent,
        callback: ObserverCallback<SimpleRepositoryServiceEvent>
    ): UserRepositoryServiceDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public destroy (): void {
        this._observer.destroy();
    }

    public async initialize () : Promise<void> {
        LOG.debug(`Initialization started`);
        await this._sharedClientService.waitForInitialization();
        const client = this._sharedClientService.getClient();
        if (!client) throw new TypeError(`No client configured`);
        this._repository = await this._repositoryInitializer.initializeRepository( client );
        LOG.debug(`Initialization finished`);
        if (this._observer.hasCallbacks(SimpleRepositoryServiceEvent.INITIALIZED)) {
            this._observer.triggerEvent(SimpleRepositoryServiceEvent.INITIALIZED);
        }
    }

    public async getAllUsers () : Promise<readonly UserRepositoryItem[]> {
        const list : readonly SimpleRepositoryEntry<StoredUserRepositoryItem>[] = await this._getAllUsers();
        return map(list, (item: SimpleRepositoryEntry<StoredUserRepositoryItem>) : UserRepositoryItem => {
            return this._toUserRepositoryItem(item);
        });
    }

    public async getSomeUsers (
        idList : readonly string[]
    ) : Promise<readonly UserRepositoryItem[]> {
        const list : readonly SimpleRepositoryEntry<StoredUserRepositoryItem>[] = await this._getSomeUsers(idList);
        return map(list, (item: SimpleRepositoryEntry<StoredUserRepositoryItem>) : UserRepositoryItem => {
            return this._toUserRepositoryItem(item);
        });
    }

    public async findUserById (id: string) : Promise<UserRepositoryItem | undefined> {
        await this._sharedClientService.waitForInitialization();
        if (!this._repository) throw new TypeError('No this._repository');
        const foundItem : SimpleRepositoryEntry<StoredUserRepositoryItem> | undefined = await this._repository.findById(id);
        if (!foundItem) return undefined;
        return this._toUserRepositoryItem(foundItem);
    }

    public async findByUsername (username: string) : Promise<UserRepositoryItem | undefined> {
        await this._sharedClientService.waitForInitialization();
        if (!this._repository) throw new TypeError('No this._repository');
        const foundItem : SimpleRepositoryEntry<StoredUserRepositoryItem> | undefined = await this._repository.findByProperty("username", toLower(username));
        if (!foundItem) return undefined;
        return this._toUserRepositoryItem(foundItem);
    }

    public async deleteAllUsers () : Promise<void> {
        await this._sharedClientService.waitForInitialization();
        if (!this._repository) throw new TypeError('No this._repository');
        const list : readonly SimpleRepositoryEntry<StoredUserRepositoryItem>[] = await this._getAllUsers();
        await this._repository.deleteByList(list);
    }

    public async deleteSomeUsers (
        idList : readonly string[]
    ) : Promise<void> {
        await this._sharedClientService.waitForInitialization();
        if (!this._repository) throw new TypeError('No this._repository');
        const list : readonly SimpleRepositoryEntry<StoredUserRepositoryItem>[] = await this._getSomeUsers(idList);
        await this._repository.deleteByList(list);
    }

    public async createUser (
        item : UserRepositoryItem
    ) : Promise<UserRepositoryItem> {
        await this._sharedClientService.waitForInitialization();
        if (!this._repository) throw new TypeError('No this._repository');
        LOG.debug(`Creating user using: `, item);
        const createdStoredItem : SimpleRepositoryEntry<StoredUserRepositoryItem> = await this._repository.createItem(toStoredUserRepositoryItem(item));
        return this._toUserRepositoryItem(createdStoredItem);
    }

    public async saveUser (
        item : UserRepositoryItem
    ) : Promise<UserRepositoryItem> {
        await this._sharedClientService.waitForInitialization();
        if (!this._repository) throw new TypeError('No this._repository');
        const foundItem = await this._repository.updateOrCreateItem(toStoredUserRepositoryItem(item));
        return this._toUserRepositoryItem(foundItem);
    }

    // PRIVATE METHODS

    private async _getAllUsers () : Promise<readonly SimpleRepositoryEntry<StoredUserRepositoryItem>[]> {
        if (!this._repository) throw new TypeError('No this._repository');
        return await this._repository.getAll();
    }

    private async _getSomeUsers (
        idList : readonly string[]
    ) : Promise<readonly SimpleRepositoryEntry<StoredUserRepositoryItem>[]> {
        if (!this._repository) throw new TypeError('No this._repository');
        return await this._repository.getSome(idList);
    }

    private _toUserRepositoryItem (storedItem: SimpleRepositoryEntry<StoredUserRepositoryItem>) : UserRepositoryItem {
        const id = storedItem.id;
        const target = storedItem.data?.target;
        LOG.debug(`User with id "${id}": `, storedItem, target);
        const item = parseUserRepositoryItem(
            id,
            target
        );
        LOG.debug(`User "${id}" as: `, item);
        if (!item) {
            throw new TypeError(`UserRepositoryService: Could not parse "${storedItem.id}" and ${JSON.stringify(target)}`);
        }
        return item;
    }

}
