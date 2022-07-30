// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { SharedMatrixClientService } from "./SharedMatrixClientService";
import { MatrixCrudRepository } from "./MatrixCrudRepository";
import { isRepositoryEntry, RepositoryEntry } from "../core/simpleRepository/types/RepositoryEntry";
import { filter, isArrayOf, TestCallbackNonStandard } from "../core/modules/lodash";
import { Observer } from "../core/Observer";
import { StoredRepositoryItem } from "../core/simpleRepository/types/StoredRepositoryItem";
import { RepositoryServiceEvent } from "./types/repository/RepositoryServiceEvent";

export class MatrixRepositoryService<T extends StoredRepositoryItem, EventT extends RepositoryServiceEvent> {

    protected _sharedClientService : SharedMatrixClientService;
    protected _repository          : MatrixCrudRepository<T>  | undefined;
    protected _roomType            : string;
    protected _observer            : Observer<EventT>;

    protected constructor (
        observer : Observer<EventT>,
        sharedClientService : SharedMatrixClientService,
        repository : MatrixCrudRepository<T> | undefined,
        roomType : string
    ) {
        this._observer = observer;
        this._sharedClientService = sharedClientService;
        this._repository = repository;
        this._roomType = roomType;
    }

    protected _setRoomType (type: string) {
        this._roomType = type;
    }

    protected async _initialize (
        roomType : string | undefined = undefined
    ) {

        const roomTypeArg = roomType ?? this._roomType;
        if (roomTypeArg) {
            this._setRoomType(roomTypeArg);
        }

        const client = this._sharedClientService.getClient();
        if (!client) throw new TypeError(`${this._observer.getName()}.initialize: No client defined`);

        this._repository = new MatrixCrudRepository<T>(
            client,
            roomTypeArg
        );

    }

    /**
     * You should call this method at the start of your public method
     * implementations before any other helper method.
     *
     * @protected
     */
    protected async _waitForInitialization () {
        await this._sharedClientService.waitForInitialization();
    }

    /**
     * Get all records
     *
     * @param isT
     * @protected
     */
    protected async _getAll (
        isT : TestCallbackNonStandard
    ) : Promise<readonly RepositoryEntry<T>[]> {
        const list : readonly RepositoryEntry<T>[] = await this._repository.getAll();
        if (!isArrayOf(
            list,
            (item : RepositoryEntry<T>) : boolean => isRepositoryEntry<T>(
                item,
                isT
            )
        )) {
            throw new TypeError(`${this._observer.getName()}._getAll: Illegal data from database`);
        }
        return list;
    }

    /**
     * Get some records which are part of the `idList`
     *
     * @param idList
     * @param isT
     * @protected
     */
    protected async _getSome (
        idList : readonly string[],
        isT : TestCallbackNonStandard
    ) : Promise<readonly RepositoryEntry<T>[]> {
        const allList : readonly RepositoryEntry<T>[] = await this._repository.getAll();
        const list : RepositoryEntry<T>[] = filter(
            allList,
            (item : RepositoryEntry<T>) : boolean => item?.id && idList.includes(item?.id)
        );
        if (!isArrayOf(
            list,
            (item : RepositoryEntry<T>) : boolean => isRepositoryEntry<T>(
                item,
                isT
            )
        )) {
            throw new TypeError(`${this._observer.getName()}._getAll: Illegal data from database`);
        }
        return list;
    }

    /**
     * Get all records by a property name
     *
     * @param propertyName
     * @param propertyValue
     * @param isT
     * @protected
     */
    protected async _getAllByProperty (
        propertyName : string,
        propertyValue : string,
        isT : TestCallbackNonStandard
    ) : Promise<readonly RepositoryEntry<T>[]> {
        const list : readonly RepositoryEntry<T>[] = await this._repository.getAllByProperty(propertyName, propertyValue);
        if (!isArrayOf(
            list,
            (item : RepositoryEntry<T>) : boolean => isRepositoryEntry<T>(
                item,
                isT
            )
        )) {
            throw new TypeError(`${this._observer.getName()}._getAllByProperty: Illegal data from database`);
        }
        return list;
    }

    /**
     * Find a record by it's ID
     *
     * @param id
     * @protected
     */
    protected async _findById (
        id : string
    ) : Promise<RepositoryEntry<T> | undefined> {
        return await this._repository.findById(id);
    }

    /**
     * Find a record by an ID and update it.
     *
     * @param id
     * @param item
     * @protected
     */
    protected async _findByIdAndUpdate (
        id: string,
        item: T
    ) : Promise<RepositoryEntry<T>> {
        const rItem : RepositoryEntry<T> | undefined = await this._findById(id);
        if (rItem === undefined) throw new TypeError(`${this._observer.getName()}._findByIdAndUpdate: Could not find item for "${id}"`);
        return await this._repository.update(
            rItem.id,
            item
        );
    }

    /**
     * Create a new item
     *
     * @param item
     * @protected
     */
    protected async _createItem (item: T) : Promise<RepositoryEntry<T>> {
        return await this._repository.createItem(item);
    }

    /**
     * Update or create a new item
     *
     * New item is created if the ID is "new" or an item is not found.
     *
     * @param item
     * @protected
     */
    protected async _updateOrCreateItem (item: T) : Promise<RepositoryEntry<T>> {
        const id = item.id;
        const foundItem : RepositoryEntry<T> | undefined = id !== 'new' ? await this._findById(id) : undefined;
        if (foundItem) {
            return await this._repository.update(
                foundItem.id,
                item
            );
        } else {
            return await this._createItem(item);
        }
    }

    /**
     * Delete a record by ID
     *
     * @param id
     * @protected
     */
    protected async _deleteById (id: string) {
        await this._repository.deleteById(id);
    }

    protected async _deleteByList (list: readonly RepositoryEntry<T>[]) {
        let i = 0;
        for (; i < list.length; i += 1) {
            await this._deleteById(list[i].id);
        }
    }

}
