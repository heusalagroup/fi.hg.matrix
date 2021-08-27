import { MatrixType } from "../../../core/MatrixType";

export interface MatrixIdentifierDTO {
    readonly type: MatrixType.M_ID_USER,
    readonly user: string
}
