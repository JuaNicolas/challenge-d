import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  EMPTY,
  iif,
  map,
  mergeMap,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { User } from 'src/app/core/models/user';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss'],
})
export class DeleteUserComponent implements OnInit {
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
    private activedRouter: ActivatedRoute,
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  deleteUser({ id }: User): void {
    this.usersService.deleteUser({ id }).subscribe();
  }
}
