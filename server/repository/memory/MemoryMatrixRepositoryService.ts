// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { MatrixRepositoryService } from "../../types/MatrixRepositoryService";

export class MemoryMatrixRepositoryService implements MatrixRepositoryService {

    public constructor () {

    }

}

export function isMemoryMatrixServerRepositoryService (value: any): value is MemoryMatrixRepositoryService {
    return value instanceof MemoryMatrixRepositoryService;
}
