import { MatrixIdentifierDTO } from "./types/MatrixIdentifierDTO";
import { MatrixType } from "../../core/MatrixType";

export interface MatrixPasswordLoginDTO {

    readonly type       : MatrixType.M_LOGIN_PASSWORD;
    readonly identifier : MatrixIdentifierDTO;
    readonly password   : string;

}
