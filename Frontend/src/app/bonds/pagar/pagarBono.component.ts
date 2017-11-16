import { Component } from '@angular/core';
import { Bond } from '../../models/bonds/bond.model';
import { Labels } from '../../util/app/appLabels.service';
import { App } from '../../util/app/app.service';
import { PagarBonosService } from './pagarBono.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'pagarBono',
    templateUrl: './pagarBono.component.html',
    providers: [PagarBonosService]
})

export class PagarBonoComponent {
    private labels = new Labels();
    private bond: Bond = new Bond();
    private totalPay: Number = 0;
    private bonusSelected: boolean;

    constructor(private service: PagarBonosService, private app: App, private router: Router, private activeRoute: ActivatedRoute) {
        this.bonusSelected = true;
    }

    ngOnInit(): void {
        this.bond = this.app.Bond;
        if (this.bond != null){
            this.bonusSelected = false;
        }
      
        this.totalPay=((this.bond.amount * 10)/100 + +this.bond.amount);
    }

    pagarBono(): void {
        this.service.pagarBono(this.bond).subscribe(
            result => {alert("Bono Pagado");
            this.goToBondslist();},
            error => console.log(error)
        )

    }

    goToBondslist(): void {
        this.router.navigate(['./consultarBonos'], { relativeTo: this.activeRoute.parent });
    }

}