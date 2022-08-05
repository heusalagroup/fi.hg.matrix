// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { StoredRepositoryItem, StoredRepositoryItemTestCallback } from "../core/simpleRepository/types/StoredRepositoryItem";
import { Repository } from "../core/simpleRepository/types/Repository";
import { RepositoryInitializer } from "../core/simpleRepository/types/RepositoryInitializer";
import { RepositoryClient } from "../core/simpleRepository/types/RepositoryClient";
import { MatrixCrudRepository } from "./MatrixCrudRepository";
import { SimpleMatrixClient } from "./SimpleMatrixClient";

export class MatrixRepositoryInitializer<T extends StoredRepositoryItem> implements RepositoryInitializer<T> {

    private readonly _roomType : string;
    private readonly _isT      : StoredRepositoryItemTestCallback;

    public constructor (
        roomType            : string,
        isT                 : StoredRepositoryItemTestCallback
    ) {
        this._roomType = roomType;
        this._isT = isT;
    }

    public async initializeRepository ( client : RepositoryClient ) : Promise<Repository<T>> {
        if (!(client instanceof SimpleMatrixClient)) throw new TypeError(`MatrixRepositoryInitializer.initializeRepository: Shared client not defined or not SimpleMatrixClient`);
        return new MatrixCrudRepository<T>(
            client,
            this._roomType,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            this._isT
        );
    }

}
