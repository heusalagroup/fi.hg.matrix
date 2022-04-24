// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { MatrixRepositoryService } from "./types/MatrixRepositoryService";

export class MatrixServerService {

    private readonly _repository : MatrixRepositoryService;

    /**
     *
     * @param repository
     */
    public constructor (
        repository: MatrixRepositoryService
    ) {
        this._repository = repository;
    }

    /**
     * Get a nonce for registration
     *
     * @see https://github.com/heusalagroup/hghs/issues/1
     * @TODO
     */
    public async createAdminRegisterNonce () : Promise<string> {
        return 'nonce';
    }

}
