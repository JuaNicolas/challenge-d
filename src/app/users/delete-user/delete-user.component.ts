import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  EMPTY,
  filter,
  iif,
  map,
  mergeMap,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { User } from 'src/app/core/models/user';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss'],
})
export class DeleteUserComponent {
  @ViewChild('deleteModal', { static: false })
  deleteModal!: TemplateRef<unknown>;
  vm$: Observable<User> = this.activedRouter.paramMap.pipe(
    map((params) => params.get('id')),
    mergeMap((id) =>
      iif(
        () => !!Number(id),
        of(Number(id)),
        throwError(() => {})
      )
    ),
    mergeMap((id) => this.usersService.getUser(id)),
    catchError(() => {
      this.router.navigateByUrl('users');
      return EMPTY;
    })
  );
  constructor(
    private readonly activedRouter: ActivatedRoute,
    private readonly usersService: UsersService,
    private readonly router: Router,
    private readonly dialog: MatDialog
  ) {}

  deleteUser(): void {
    this.dialog
      .open<unknown, null, User>(this.deleteModal)
      .afterClosed()
      .pipe(
        filter(Boolean),
        mergeMap((user) =>
          iif(
            () => Boolean(user),
            this.usersService.deleteUser({ id: user.id }),
            EMPTY
          )
        ),
        tap(() => this.router.navigate(['..']))
      )
      .subscribe();
  }
}
