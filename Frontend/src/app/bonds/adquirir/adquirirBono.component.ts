import { Component} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Bond } from '../../models/bonds/bond.model';
import { Labels } from '../../util/app/appLabels.service';
import { App } from '../../util/app/app.service';
import { AdquirirBonosService } from './adquirirBono.service';
import { DatePipe } from '@angular/common'

@Component({
    selector: 'adquirirBono',
    templateUrl: './adquirirBono.component.html',
    providers: [AdquirirBonosService]
})

export class AdquirirBonoComponent{
    private labels = new Labels();
    private bond: Bond = new Bond();

    constructor(private app: App, private service: AdquirirBonosService, private router: Router, private activeRoute: ActivatedRoute) {
        this.bond = this.app.Bond;
    }

    adquirirBono() {
        this.service.adquirirBono(this.bond).subscribe(
            result => {
                alert("Bono Adquirido");
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
        this.router.navigate(['./consultarBonos'], { relativeTo: this.activeRoute.parent });
    }
}