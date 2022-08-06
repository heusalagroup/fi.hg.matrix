// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

export class MatrixUtils {

    public static getUserId (
        username: string,
        hostname: string
    ) : string {
        return `@${username}:${hostname}`;
    }

}
