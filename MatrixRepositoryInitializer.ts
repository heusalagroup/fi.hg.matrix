// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { SimpleStoredRepositoryItem, StoredRepositoryItemExplainCallback, StoredRepositoryItemTestCallback } from "../core/simpleRepository/types/SimpleStoredRepositoryItem";
import { SimpleRepository } from "../core/simpleRepository/types/SimpleRepository";
import { SimpleRepositoryInitializer } from "../core/simpleRepository/types/SimpleRepositoryInitializer";
import { SimpleRepositoryClient } from "../core/simpleRepository/types/SimpleRepositoryClient";
import { MatrixCrudRepository } from "./MatrixCrudRepository";
import { SimpleMatrixClient } from "./SimpleMatrixClient";
import { explainNot, explainOk } from "../core/types/explain";

export class MatrixRepositoryInitializer<T extends SimpleStoredRepositoryItem> implements SimpleRepositoryInitializer<T> {

    private readonly _roomType : string;
    private readonly _isT      : StoredRepositoryItemTestCallback;
    private readonly _explainT : StoredRepositoryItemExplainCallback;
    private readonly _tName    : string;

    public constructor (
        roomType            : string,
        isT                 : StoredRepositoryItemTestCallback,
        tName               : string                              | undefined = undefined,
        explainT            : StoredRepositoryItemExplainCallback | undefined = undefined
    ) {
        this._roomType = roomType;
        this._isT = isT;
        this._tName    = tName ?? 'T';
        this._explainT = explainT ?? ( (value: any) : string => isT(value) ? explainOk() : explainNot(this._tName) );
    }

    public async initializeRepository ( client : SimpleRepositoryClient ) : Promise<SimpleRepository<T>> {
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
            this._isT,
            this._tName,
            this._explainT
        );
    }

}
