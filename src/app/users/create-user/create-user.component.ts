import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { combineLatestWith, map } from 'rxjs/operators';
import { FormValidators } from 'src/app/core/validators/form-validators';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {
  form: UntypedFormGroup = this.fb.group(
    {
      username: [
        { value: '', disabled: true },
        FormValidators.usernameValidators(),
      ],
      name: ['', FormValidators.nameValidators()],
      surnames: ['', FormValidators.surnamesValidators()],
      email: ['', FormValidators.emailValidators()],
      password: ['', FormValidators.passwordValidators()],
      repeatPassword: ['', FormValidators.passwordValidators()],
      age: [null, FormValidators.ageValidators()],
    },
    {
      validators: [FormValidators.matchPasswordsValidators()],
      updateOn: 'blur',
    }
  );

  constructor(private fb: UntypedFormBuilder, private usersService: UsersService) {}
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
    console.log(this.form.value, this.form.getRawValue());
    const dto = this.form.getRawValue();
    this.usersService.createUser(dto).subscribe(console.log, console.error);
  }
}
