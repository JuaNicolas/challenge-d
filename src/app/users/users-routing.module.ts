import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateUserComponent } from './create-user/create-user.component';
import { DeleteUserComponent } from './delete-user/delete-user.component';
import { NoEmptyListGuard } from './guards/no-empty-list.guard';
import { ListUserComponent } from './list-user/list-user.component';
import { UpdateUserComponent } from './update-user/update-user.component';

const routes: Routes = [
  {
    path: 'list',
    canActivate: [NoEmptyListGuard],
    component: ListUserComponent,
    title: 'User List',
  },
  {
    path: 'create',
    component: CreateUserComponent,
    title: 'Create User',
  },
  {
    path: 'update/:id',
    component: UpdateUserComponent,
    title: 'Update User',
  },
  {
    path: 'delete/:id',
    component: DeleteUserComponent,
    title: 'Delete User',
  },
  {
    path: '**',
    redirectTo: 'list',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
