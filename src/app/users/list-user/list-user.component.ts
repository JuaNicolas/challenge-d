import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss'],
})
export class ListUserComponent implements OnInit {
  users$ = this.usersService.getUsers();
  constructor(private usersService: UsersService) {}

  ngOnInit(): void {}
}
