import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from '../../components/user-list/user-list.component';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { UserDetailComponent } from '../../components/user-detail/user-detail.component';
import { CanDeactivateGuard } from '../../guards/can-deactivate.guard';


const routes: Routes = [
  { path: '', component: UserListComponent },
  { path: 'create', component: UserFormComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'edit/:id', component: UserFormComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'detail/:id', component: UserDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
