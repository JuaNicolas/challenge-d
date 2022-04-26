import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  combineLatestWith,
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
import { FormValidators } from 'src/app/core/validators/form-validators';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss'],
})
export class UpdateUserComponent implements OnInit {
  form: FormGroup = this.fb.group({
    id: this.activedRouter.snapshot.paramMap.get('id'),
    username: [
      { value: '', disabled: true },
      FormValidators.usernameValidators(),
    ],
    name: ['', FormValidators.nameValidators()],
    surnames: ['', FormValidators.surnamesValidators()],
    age: ['', FormValidators.ageValidators()],
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
    private fb: FormBuilder,
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

  onSubmit(): void {
    const dto = this.form.getRawValue();
    this.usersService
      .updateUser(dto)
      .subscribe(() => this.router.navigateByUrl('users'));
  }
}
