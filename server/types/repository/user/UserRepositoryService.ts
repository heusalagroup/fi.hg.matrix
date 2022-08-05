// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { LogService } from "../../../../../core/LogService";
import { Observer, ObserverCallback, ObserverDestructor } from "../../../../../core/Observer";
import { RepositoryService } from "../../../../../core/simpleRepository/types/RepositoryService";
import { StoredUserRepositoryItem } from "./StoredUserRepositoryItem";
import { RepositoryServiceEvent } from "../../../../../core/simpleRepository/types/RepositoryServiceEvent";
import { SharedClientService } from "../../../../../core/simpleRepository/types/SharedClientService";
import { Repository } from "../../../../../core/simpleRepository/types/Repository";
import { RepositoryInitializer } from "../../../../../core/simpleRepository/types/RepositoryInitializer";
import { UserRepositoryItem, parseUserRepositoryItem, toStoredUserRepositoryItem } from "./UserRepositoryItem";
import { RepositoryEntry } from "../../../../../core/simpleRepository/types/RepositoryEntry";
import { map, toLower } from "../../../../../core/modules/lodash";

const LOG = LogService.createLogger('UserRepositoryService');

export type UserRepositoryServiceDestructor = ObserverDestructor;

export class UserRepositoryService implements RepositoryService<StoredUserRepositoryItem> {

    public Event = RepositoryServiceEvent;

    protected readonly _sharedClientService : SharedClientService;
    protected readonly _observer            : Observer<RepositoryServiceEvent>;
    protected _repository                   : Repository<StoredUserRepositoryItem>  | undefined;
    protected _repositoryInitializer        : RepositoryInitializer<StoredUserRepositoryItem>  | undefined;

    public constructor (
        sharedClientService   : SharedClientService,
        repositoryInitializer : RepositoryInitializer<StoredUserRepositoryItem>
    ) {
        this._observer = new Observer<RepositoryServiceEvent>("UserRepositoryService");
        this._sharedClientService = sharedClientService;
        this._repositoryInitializer = repositoryInitializer;
        this._repository = undefined;
    }

    public on (
        name: RepositoryServiceEvent,
        callback: ObserverCallback<RepositoryServiceEvent>
    ): UserRepositoryServiceDestructor {
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

    public async getAllUsers () : Promise<readonly UserRepositoryItem[]> {
        const list : readonly RepositoryEntry<StoredUserRepositoryItem>[] = await this._getAllUsers();
        return map(list, (item: RepositoryEntry<StoredUserRepositoryItem>) : UserRepositoryItem => {
            return this._toUserRepositoryItem(item);
        });
    }

    public async getSomeUsers (
        idList : readonly string[]
    ) : Promise<readonly UserRepositoryItem[]> {
        const list : readonly RepositoryEntry<StoredUserRepositoryItem>[] = await this._getSomeUsers(idList);
        return map(list, (item: RepositoryEntry<StoredUserRepositoryItem>) : UserRepositoryItem => {
            return this._toUserRepositoryItem(item);
        });
    }

    public async findById (id: string) : Promise<UserRepositoryItem | undefined> {
        await this._sharedClientService.waitForInitialization();
        const foundItem : RepositoryEntry<StoredUserRepositoryItem> | undefined = await this._repository.findById(id);
        if (!foundItem) return undefined;
        return this._toUserRepositoryItem(foundItem);
    }

    public async findByUsername (username: string) : Promise<UserRepositoryItem | undefined> {
        await this._sharedClientService.waitForInitialization();
        const foundItem : RepositoryEntry<StoredUserRepositoryItem> | undefined = await this._repository.findByProperty("username", toLower(username));
        if (!foundItem) return undefined;
        return this._toUserRepositoryItem(foundItem);
    }

    public async deleteAllUsers () : Promise<void> {
        await this._sharedClientService.waitForInitialization();
        const list : readonly RepositoryEntry<StoredUserRepositoryItem>[] = await this._getAllUsers();
        await this._repository.deleteByList(list);
    }

    public async deleteSomeUsers (
        idList : readonly string[]
    ) : Promise<void> {
        await this._sharedClientService.waitForInitialization();
        const list : readonly RepositoryEntry<StoredUserRepositoryItem>[] = await this._getSomeUsers(idList);
        await this._repository.deleteByList(list);
    }

    public async createUser (
        item : UserRepositoryItem
    ) : Promise<UserRepositoryItem> {
        await this._sharedClientService.waitForInitialization();
        LOG.debug(`Creating user using: `, item);
        const createdStoredItem : RepositoryEntry<StoredUserRepositoryItem> = await this._repository.createItem(toStoredUserRepositoryItem(item));
        return this._toUserRepositoryItem(createdStoredItem);
    }

    public async saveUser (
        item : UserRepositoryItem
    ) : Promise<UserRepositoryItem> {
        await this._sharedClientService.waitForInitialization();
        const foundItem = await this._repository.updateOrCreateItem(toStoredUserRepositoryItem(item));
        return this._toUserRepositoryItem(foundItem);
    }

    // PRIVATE METHODS

    private async _getAllUsers () : Promise<readonly RepositoryEntry<StoredUserRepositoryItem>[]> {
        return await this._repository.getAll();
    }

    private async _getSomeUsers (
        idList : readonly string[]
    ) : Promise<readonly RepositoryEntry<StoredUserRepositoryItem>[]> {
        return await this._repository.getSome(idList);
    }

    private _toUserRepositoryItem (storedItem: RepositoryEntry<StoredUserRepositoryItem>) : UserRepositoryItem {
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
