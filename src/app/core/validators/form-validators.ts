import { AbstractControl, Validators } from '@angular/forms';

export class FormValidators {
  static usernameValidators() {
    return [Validators.required];
  }

  static nameValidators() {
    return [Validators.required, Validators.minLength(2)];
  }

  static surnamesValidators() {
    return [Validators.required, Validators.minLength(2)];
  }

  static emailValidators() {
    return [Validators.required, Validators.email];
  }

  static matchPasswordsValidators() {
    return (formGroup: AbstractControl) => {
      const passwordControl = formGroup.get('password');
      const repeatPasswordControl = formGroup.get('repeatPassword');

      if (!passwordControl || !repeatPasswordControl) {
        return null;
      }

      return passwordControl.value === repeatPasswordControl.value
        ? null
        : { dismatch: true };
    };
  }

  static passwordValidators() {
    return [
      Validators.required,
      Validators.pattern(
        '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}'
      ),
    ];
  }

  static ageValidators() {
    return [Validators.required, Validators.min(18), Validators.max(65)];
  }
}
