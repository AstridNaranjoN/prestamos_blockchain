import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/users/user.model';
import { Labels } from '../../util/app/appLabels.service'

@Component({
    selector: 'register',
    templateUrl: './register.component.html'
})

export class RegisterComponent {

    private labels = new Labels();
    private user: User = new User();

    constructor(private router: Router) {
    }

    cancel() {
        this.router.navigate(['/login']);
    }

    save() {
        alert('Guardado!');
        this.router.navigate(['/login']);
    }

}