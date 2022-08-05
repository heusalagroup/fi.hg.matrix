// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { createHmac } from 'crypto';
import { SynapseRegisterRequestDTO } from "../types/synapse/SynapseRegisterRequestDTO";
import { MatrixRegisterKind } from "../types/request/register/types/MatrixRegisterKind";

export class SynapseUtils {

    public static createRegisterDTO (
        sharedSecret : string,
        nonce        : string,
        username     : string,
        displayName  : string,
        password     : string,
        admin        : boolean,
        userType    ?: MatrixRegisterKind
    ) : SynapseRegisterRequestDTO {

        const mac = this.generateRegisterMAC(sharedSecret, nonce, username, password, admin, userType);

        return {
            nonce,
            username,
            'displayname': displayName,
            password,
            admin,
            mac
        };

    }

    public static generateRegisterMAC (
        sharedSecret : string,
        nonce        : string,
        username     : string,
        password     : string,
        admin        : boolean,
        userType    ?: MatrixRegisterKind
    ) : string {

        let mac = createHmac('sha1', sharedSecret)
            .update(nonce, 'utf8')
            .update('\x00')
            .update(username, 'utf8')
            .update('\x00')
            .update(password, 'utf8')
            .update('\x00')
            .update( admin ? 'admin' : 'notadmin')
        ;

        if (userType) {
            mac = mac.update('\x00').update(userType, 'utf8');
        }

        return mac.digest('hex');

    }

}


