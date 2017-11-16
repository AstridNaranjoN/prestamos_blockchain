import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuthService } from '../util/app/googleAuth.service';

@Component({
    selector: 'intermediate',
    template: '<img style="position: absolute;left: 40%;top: 30%;" src="../Spinner.gif">',
})

export class IntermediateComponent {

    constructor(private router: Router, private googleService: GoogleAuthService) {
        setTimeout(function (router: Router) {
            router["router"].navigate(['/home']);
        }, 2000, { router });
    }
}