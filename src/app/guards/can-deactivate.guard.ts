import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { UserFormComponent } from '../components/user-form/user-form.component';


@Injectable({
  providedIn: 'root',
})
export class CanDeactivateGuard implements CanDeactivate<UserFormComponent> {
  canDeactivate(
    component: UserFormComponent
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (component.userForm.dirty) {
      return window.confirm('Tienes cambios no guardados. ¿Estás seguro de que quieres salir?');
    }
    return true;
  }
}