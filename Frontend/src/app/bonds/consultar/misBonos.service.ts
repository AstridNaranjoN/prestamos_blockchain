import { Injectable } from '@angular/core';
import { HttpServiceBase } from '../../util/app/httpBase.service'

@Injectable()
export class MisBonosService {

    constructor(private httpBase: HttpServiceBase) {
    }

    misBonos(id: string) {
         return this.httpBase.get('bonds/loaner/' + id);
    }
}