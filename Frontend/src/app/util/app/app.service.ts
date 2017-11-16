import { Injectable } from '@angular/core';
import { User } from '../../models/users/user.model';
import { Bond } from '../../models/bonds/bond.model';

@Injectable()
export class App {


    private _isLoggedIn: boolean = false;
    public get isLoggedIn(): boolean {
        return this._isLoggedIn;
    }
    public set isLoggedIn(value: boolean) {
        this._isLoggedIn = value;
    }

    
    private _bond : Bond;
    public get Bond() : Bond {
        return this._bond;
    }
    public set Bond(value : Bond) {
        this._bond = value;
    }
    


    private _user: User = new User();
    public get User(): User {
        return this._user;
    }
    public set User(user: User) {
        this._user = user;
    }
}