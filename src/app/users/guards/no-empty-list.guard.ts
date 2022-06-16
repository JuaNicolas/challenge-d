import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { iif, mergeMap, Observable, tap } from 'rxjs';
import { UsersService } from '../users.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class NoEmptyListGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router
  ) {}
  canActivate(): Observable<boolean | UrlTree> {
    return this.usersService
      .getUsers()
      .pipe(
        mergeMap((users) =>
          iif(
            () => !!users.length,
            of(true),
            of(this.router.parseUrl('/users/create')).pipe(
              tap(() =>
                this.openSnackBar(
                  'Please create a user in order to display users in the list.'
                )
              )
            )
          )
        )
      );
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 2500,
    });
  }
}
