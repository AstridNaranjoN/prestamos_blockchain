import { Injectable } from '@angular/core';
import { HttpServiceBase } from '../../util/app/httpBase.service';
import { Bond } from '../../models/bonds/bond.model';
import { GoogleAuthService } from '../../util/app/googleAuth.service'

@Injectable()
export class AdquirirBonosService {

    constructor(private httpBase: HttpServiceBase, private googleService: GoogleAuthService) {
    }

    adquirirBono(bono: Bond) {
        bono.status = "PUT";
        bono.installments = 1;
        bono.borrowerId = this.googleService.email;
        bono.putDate = new Date();
        bono.interest = 10
        return this.httpBase.put('bonds', bono);
    }
}
