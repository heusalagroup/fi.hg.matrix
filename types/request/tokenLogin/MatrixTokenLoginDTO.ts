import { MatrixType } from "../../core/MatrixType";

export interface MatrixTokenLoginDTO {

    readonly type: MatrixType.M_LOGIN_TOKEN;
    readonly token: string;

}
