import { Component, OnDestroy, OnInit } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  combineLatestWith,
  EMPTY,
  iif,
  map,
  mergeMap,
  Observable,
  of,
  Subject,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { UpdateUserDTO } from 'src/app/core/models/update-user.dto';
import { User } from 'src/app/core/models/user';
import { ControlsOf } from 'src/app/core/validators/form-controlsof.type';
import { FormValidators } from 'src/app/core/validators/form-validators';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss'],
})
export class UpdateUserComponent implements OnInit, OnDestroy {
  private readonly subject$ = new Subject<void>();
  // form = this.fb.group<ControlsOf<CreateUserDTO & { repeatPassword: string }>>(
  form = this.fb.group<ControlsOf<UpdateUserDTO>>({
    id: this.fb.control(0),
    username: this.fb.control(
      { value: '', disabled: true },
      FormValidators.usernameValidators()
    ),
    name: this.fb.control('', FormValidators.nameValidators()),
    surnames: this.fb.control('', FormValidators.surnamesValidators()),
    age: this.fb.control(0, FormValidators.ageValidators()),
  });

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
    }),
    tap(({ id, name, surnames, username, age }) => {
      this.form.setValue({
        id,
        name,
        surnames,
        username,
        age,
      });
    })
  );

  constructor(
    private fb: NonNullableFormBuilder,
    private activedRouter: ActivatedRoute,
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const nameValues$: Observable<string> = this.form.get('name')!.valueChanges;
    const surnamesValues$: Observable<string> =
      this.form.get('surnames')!.valueChanges;

    nameValues$
      .pipe(
        takeUntil(this.subject$),
        combineLatestWith(surnamesValues$),
        map(([name, surnames]) => {
          const [firstSurname, secondSurname] = surnames.split(' ');

          return `${name}_${firstSurname[0]}${
            (secondSurname && secondSurname[0]) || ''
          }`;
        })
      )
      .subscribe((username) => this.form.get('username')?.setValue(username));
  }

  ngOnDestroy(): void {
    this.subject$.next();
    this.subject$.complete();
  }

  onSubmit(): void {
    const dto = this.form.getRawValue();
    this.usersService
      .updateUser(dto)
      .subscribe(() => this.router.navigateByUrl('users'));
  }
}
