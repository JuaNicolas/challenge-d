import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { CreateUserDTO } from '../core/models/create-user.dto';
import { DeleteUserDTO } from '../core/models/delete-user.dto';
import { DesactivateUserDTO } from '../core/models/desactivate-user.dto';
import { UpdateUserDTO } from '../core/models/update-user.dto';
import { User } from '../core/models/user';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly URL = ' http://localhost:3000/users';

  constructor(
    private readonly httpCLient: HttpClient,
    private readonly snackBar: MatSnackBar
  ) {}

  getUser(id: number): Observable<User> {
    return this.httpCLient.get<User>(`${this.URL}/${id}`).pipe(
      catchError(() => {
        this.openSnackBar(`User with id ${id} not found.`);
        return throwError(() => ({
          message: `User with id ${id} not found.`,
        }));
      })
    );
  }

  getUsers(): Observable<User[]> {
    return this.httpCLient.get<User[]>(this.URL);
  }

  createUser({
    username,
    name,
    surnames,
    email,
    password,
    age,
  }: CreateUserDTO): Observable<User> {
    const user: User = {
      id: Date.now(),
      username,
      name,
      surnames,
      email,
      password,
      age,
      active: true,
      lastLogging: Date.now(),
      creationDate: Date.now(),
    };
    return this.httpCLient.post<User>(this.URL, user);
  }

  updateUser({ id, ...body }: UpdateUserDTO): Observable<User> {
    return this.httpCLient
      .patch<User>(`${this.URL}/${id}`, {
        ...body,
      })
      .pipe(catchError(() => this.getUser(id)));
  }

  desactivateUser({ id }: DesactivateUserDTO): Observable<User> {
    return this.httpCLient
      .patch<User>(`${this.URL}/${id}`, {
        active: false,
      })
      .pipe(catchError(() => this.getUser(id)));
  }

  deleteUser({ id }: DeleteUserDTO): Observable<boolean> {
    return this.httpCLient.delete<boolean>(`${this.URL}/${id}`).pipe(
      catchError(() => this.getUser(id)),
      map(() => true)
    );
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 2000,
    });
  }
}
