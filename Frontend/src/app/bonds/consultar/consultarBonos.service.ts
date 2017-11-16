import { Injectable } from '@angular/core';
import { HttpServiceBase } from '../../util/app/httpBase.service'

@Injectable()
export class ConsultarBonosService {

    constructor(private httpBase: HttpServiceBase) {
    }

    consultarBonos(id: string) {
        return this.httpBase.get('bonds/available/' + id);
    }

    consultarBonosAdquiridos(id: string) {
        return this.httpBase.get('bonds/borrower/' + id);
    }
}

