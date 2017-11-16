import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Bond } from '../../models/bonds/bond.model';
import { Labels } from '../../util/app/appLabels.service';
import { EmitirBonosService } from './emitirBono.service';
import { DatePipe } from '@angular/common'

@Component({
    selector: 'emitirBono',
    templateUrl: './emitirBono.component.html',
    providers: [EmitirBonosService]
})

export class EmitirBonoComponent {

    private labels = new Labels();
    private bond: Bond = new Bond();

    constructor(private service: EmitirBonosService, private router: Router, private activeRoute: ActivatedRoute) {
        this.bond.creationDate = new Date();
        this.bond.amount =  1000000;
        this.bond.interest = 10;
        this.bond.installments = 1;
    }

    emitirBono() {
        this.service.emitirBono(this.bond).subscribe(
            result => {
                alert("Bono Emitido");
                this.goToBondslist();
            },
            error => console.log(error)
        );
    }

    cancelar() {
        this.bond = new Bond();
        this.goToBondslist();
    }

    goToBondslist(): void {
        this.router.navigate(['./misBonos'], { relativeTo: this.activeRoute.parent });
    }
}