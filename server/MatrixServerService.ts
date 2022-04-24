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

    public async createAdminRegisterNonce () : Promise<string> {
        // @TODO: Implement https://github.com/heusalagroup/hghs/issues/1
        return 'nonce';
    }

}
