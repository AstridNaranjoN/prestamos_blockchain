import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Bond } from '../../models/bonds/bond.model';
import { Labels } from '../../util/app/appLabels.service';
import { ConsultarBonosService } from './consultarBonos.service';
import { App } from '../../util/app/app.service';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { GoogleAuthService } from '../../util/app/googleAuth.service';


@Component({
    selector: 'consultarBonos',
    templateUrl: './consultarBonos.component.html',
    providers: [ConsultarBonosService]
})

export class ConsultarBonosComponent implements OnInit {
    
    private option: string = 'adquiridos';
    private labels = new Labels();
    private currentLabels = this.labels.adquirirBono;
    private bonds: Bond[] = [];
    private bondsTemp: Bond[] = [];
    private functions: {} = { emitidos: this.labelsBonosEmitidos, adquiridos: this.labelsBonosAdquiridos };

    constructor(private service: ConsultarBonosService, private app: App, private router: Router, private activeRoute: ActivatedRoute, private googleService: GoogleAuthService) {
    }

    ngOnInit(): void {
        setTimeout(function(component: ConsultarBonosComponent) {
            component.consultarBonosAdquiridos();
        }, 1000, this);
    }

    consultarBonosEmitidos(): any {
        this.service.consultarBonos(this.googleService.email).subscribe(
            result => {
                this.bondsTemp = result
                this.bonds = Object.assign([], this.bondsTemp).filter(
                    item => item.status.toUpperCase() == "CREATED"
                )
            },
            error => console.log(error)
        );
    }

    consultarBonosAdquiridos(): any {
        this.service.consultarBonosAdquiridos(this.googleService.email).subscribe(
            result => {
                this.bonds = result;
            },
            error => console.log(error)
        );
    }

    labelsBonosEmitidos(labels: Labels) {
        return labels.emitirBono;
    }

    labelsBonosAdquiridos(labels: Labels) {
        return labels.adquirirBono;
    }

    find(value: string) {
        this.option = value;
        this.currentLabels = this.functions[value](this.labels);
        this.bonds = [];
        if (value === "adquiridos") {
            this.consultarBonosAdquiridos();
            return;
        }
        this.consultarBonosEmitidos();
    }

    irAdquirir(bond: Bond) {
        this.app.Bond = bond;
        this.router.navigate(['./adquirirBono'], { relativeTo: this.activeRoute.parent });
    }

    irPagar(bond: Bond) {
        this.app.Bond = bond;
        this.router.navigate(['./pagarBonos'], { relativeTo: this.activeRoute.parent });
    }


}