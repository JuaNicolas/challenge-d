import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { combineLatestWith, map } from 'rxjs/operators';
import { CreateUserDTO } from 'src/app/core/models/create-user.dto';
import { FormValidators } from 'src/app/core/validators/form-validators';
import { UsersService } from '../users.service';
export type ControlsOf<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Record<any, any>
    ? FormGroup<ControlsOf<T[K]>>
    : FormControl<T[K]>;
};

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {
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
    private fb: NonNullableFormBuilder,
    private usersService: UsersService
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
    this.usersService.createUser(dto).subscribe();
  }
}
