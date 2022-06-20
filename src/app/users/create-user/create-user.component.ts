import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, NonNullableFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { combineLatestWith, map, takeUntil } from 'rxjs/operators';
import { CreateUserDTO } from 'src/app/core/models/create-user.dto';
import { ControlsOf } from 'src/app/core/validators/form-controlsof.type';
import { FormValidators } from 'src/app/core/validators/form-validators';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit, OnDestroy {
  private readonly subject$ = new Subject<void>();
  hidePassword = true;
  hideRPassword = true;
  form = this.fb.group<ControlsOf<CreateUserDTO & { repeatPassword: string }>>(
    {
      username: this.fb.control(
        { value: '', disabled: true },
        {
          validators: FormValidators.usernameValidators(),
        }
      ),
      name: this.fb.control('', FormValidators.nameValidators()),
      surnames: this.fb.control('', FormValidators.surnamesValidators()),
      email: this.fb.control('', FormValidators.emailValidators()),
      password: this.fb.control('', FormValidators.passwordValidators()),
      repeatPassword: this.fb.control('', FormValidators.passwordValidators()),
      age: this.fb.control(0, FormValidators.ageValidators()),
    },
    {
      validators: [FormValidators.matchPasswordsValidators()],
      updateOn: 'blur',
    }
  );

  constructor(
    private readonly fb: NonNullableFormBuilder,
    private readonly usersService: UsersService,
    private readonly router: Router
  ) {}

  public get name(): FormControl<string> {
    return this.form.controls.name;
  }
  public get surnames(): FormControl<string> {
    return this.form.controls.surnames;
  }
  public get email(): FormControl<string> {
    return this.form.controls.email;
  }
  public get password(): FormControl<string> {
    return this.form.controls.password;
  }
  public get repeatPassword(): FormControl<string> {
    return this.form.controls.repeatPassword;
  }
  public get age(): FormControl<number> {
    return this.form.controls.age;
  }

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
      .createUser(dto)
      .subscribe(() => this.router.navigate(['..']));
  }
}
