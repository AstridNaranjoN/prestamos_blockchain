import { Injectable } from '@angular/core';
import { HttpServiceBase } from '../../util/app/httpBase.service';
import { Bond } from '../../models/bonds/bond.model'

@Injectable()
export class PagarBonosService {

    constructor(private httpBase: HttpServiceBase) {
    }

    pagarBono(bono: Bond) {
        bono.status = "PAYMENT";
        bono.paymentDate = new Date();
        bono.amount = ((bono.amount * 10)/100 + +bono.amount)
        return this.httpBase.put('bonds/', bono);
    }
}
