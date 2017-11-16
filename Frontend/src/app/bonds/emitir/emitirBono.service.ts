import { Injectable } from '@angular/core';
import { HttpServiceBase } from '../../util/app/httpBase.service';
import { Bond } from '../../models/bonds/bond.model';
import { GoogleAuthService } from '../../util/app/googleAuth.service';

@Injectable()
export class EmitirBonosService {

    constructor(private httpBase: HttpServiceBase, private googleService: GoogleAuthService) {
    }

    emitirBono(bond: Bond) {
        bond.moneyLenderId = this.googleService.email;
        bond.creationDate = new Date(bond.creationDate);
        bond.status = "CREATED"
        return this.httpBase.post('bonds', bond);
        //return this.httpBase.get('/app/bonds/consultar/bonos.json');
    }
}
