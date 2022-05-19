// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { MatrixRepositoryService } from "./types/MatrixRepositoryService";
import { randomBytes, scryptSync, createHmac } from "crypto";
import * as jwt from 'jsonwebtoken';

export class MatrixServerService {

    private readonly _repository: MatrixRepositoryService;

    /**
     *
     * @param repository
     */
    public constructor(
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
    public async createAdminRegisterNonce(): Promise<string> {
        const nonce = randomBytes(16).toString('hex'); // base64 ?
        return nonce;
    }

    /**
     * Get a salt for registration password
     *
     * @see 
     * @TODO
     */
    public async createSalt(): Promise<string> {

        const salt = randomBytes(16).toString('hex'); // paljonko pitäs olla
        return salt;
    }

    /**
     * Get a crypted password
     *
     * @param password
     * @param salt
     * @param hash
     *  
     */
    public async createCryptoPassword(secret: any, salt: any, hash: any): Promise<string> {

        const resolve = salt + ":" + scryptSync(secret, salt, hash).toString('hex');

        return resolve;
    }

    /**
    * @param password (login password), 
    * @param secret (user crypted password), 
    * @param hashed (keylen 64))
    * Compare login password and crypted password
    * return true or false
    * @TODO
    */
    public async isValidPassword(password: any, secret: any, hashed: any): Promise<boolean> {
        const [salt, hash] = secret.split(':');
        const hashToCheckBuffer = await this.createCryptoPassword(password, salt.toString(), hashed);
        const hashToCheck = hashToCheckBuffer.toString();

        const [salted, hashedpw] = hashToCheck.split(':');

        return hashedpw === hash;
    }


    /**
        * TARPEETON KUN CLIENT TOIMII
      * @param nonce:string, user_id:string, password: string, admin:boolean, user_type:string
      * Generate Mac
      * return shared secret
      * @TODO
      */
    public async generateMac(sharedSecret: string, nonce: string, username: string, password: string, admin: string, userType: string): Promise<string> {

        let mac = createHmac('sha1', sharedSecret)
            .update(nonce, 'utf8')
            .update('\x00')
            .update(username, 'utf8')
            .update('\x00')
            .update(password, 'utf8')
            .update('\x00')
            .update(admin ? 'admin' : 'notadmin')
            ;

        if (userType) {
            mac = mac.update('\x00').update(userType, 'utf8');
        }

        return mac.digest('hex');

    }

    /**
     * @param user_id (matrixId), 
     * @param shared_secret, 
     * Create token
     * return token
     * @TODO
     */
    public async createToken(user_id: string, shared_secret: string): Promise<string> {

        let token: string = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: user_id
        }, shared_secret)

        return token;
    }




}
