import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Bond } from '../../models/bonds/bond.model';
import { Labels } from '../../util/app/appLabels.service';
import { MisBonosService } from './misBonos.service';
import { App } from '../../util/app/app.service';
import { DatePipe } from '@angular/common';
import { GoogleAuthService } from '../../util/app/googleAuth.service';

@Component({
    selector: 'misBonos',
    templateUrl: './misBonos.component.html',
    providers: [MisBonosService]
})

export class misBonosComponent implements OnInit {
    
    private bonds: Bond[] = [];
    private labels = new Labels();
    private currentLabels = this.labels.emitirBono;
        
    constructor(private service: MisBonosService, private app: App, private router: Router, private activeRoute: ActivatedRoute, private googleService: GoogleAuthService) {
    }
    
    ngOnInit(): void {
        setTimeout(function(component: misBonosComponent) {
            component.service.misBonos(component.googleService.email).subscribe(
                result => component.bonds = result,
                error => console.log(error)
            );
        }, 1000, this);
    }

    }