// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { MatrixRoomAlias } from "./types/core/MatrixRoomAlias";
import { MatrixUserId } from "./types/core/MatrixUserId";
import { MatrixRoomId } from "./types/core/MatrixRoomId";

export class MatrixUtils {

    public static getUserId (
        username: string,
        hostname: string
    ) : MatrixUserId {
        return `@${username}:${hostname}`;
    }

    public static getRoomAlias (
        alias: string,
        hostname: string
    ) : MatrixRoomAlias {
        return `#${alias}:${hostname}`;
    }

    public static getRoomId (
        id: string,
        hostname: string
    ) : MatrixRoomId {
        return `!${id}:${hostname}`;
    }

}
