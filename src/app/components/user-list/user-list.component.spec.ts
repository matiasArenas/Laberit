import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { User } from '../../models/user.model';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers', 'deleteUser', 'deleteAllDoctors']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [UserListComponent, ConfirmationDialogComponent],
      imports: [MatPaginatorModule, MatTableModule, MatProgressBarModule, MatIconModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should load users on init', async () => {
    const mockUsers: User[] = [
      {
        id: 1,
        firstName: 'John',
        lastName1: 'Doe',
        lastName2: 'Smith',
        gender: 'Hombre',
        birthDate: '1980-04-25',
        nif: '12345678A',
        type: 'Paciente',
        address: {
          street: 'Calle Principal',
          number: '123',
          door: '1A',
          postalCode: '28001',
          city: 'Madrid'
        },
        insurers: {
          name: 'HealthCo',
          insuranceType: 'Salud',
          cardNumber: 'HC12345'
        },
        nhc: '123456789',
        professionalType: null,
        collegeNumber: null
      }
    ];
  
    userService.getUsers.and.returnValue(Promise.resolve(mockUsers));
  
    await component.setUserData();
  
    expect(component.dataSource.data).toEqual(mockUsers);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading users', async () => {
    userService.getUsers.and.returnValue(Promise.reject('Error'));

    await component.setUserData();

    expect(component.error).toBe('Error al cargar los usuarios');
    expect(component.loading).toBeFalse();
  });

  it('should navigate to add user page', () => {
    component.goToAddUser();
    expect(router.navigate).toHaveBeenCalledWith(['/create']);
  });

  it('should navigate to edit user page', () => {
    component.goToEditUser(1);
    expect(router.navigate).toHaveBeenCalledWith(['/edit', 1]);
  });

  it('should navigate to user details page', () => {
    component.goToInfoUser(1);
    expect(router.navigate).toHaveBeenCalledWith(['/detail', 1]);
  });

  it('should open confirmation dialog and delete user when confirmed', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialog.open.and.returnValue(dialogRefSpy);
    dialogRefSpy.afterClosed.and.returnValue(of(true));

    userService.deleteUser.and.stub();

    component.deleteUser(1);

    expect(dialog.open).toHaveBeenCalled();
    expect(userService.deleteUser).toHaveBeenCalledWith(1);
  });

  it('should not delete user when cancelled in confirmation dialog', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialog.open.and.returnValue(dialogRefSpy);
    dialogRefSpy.afterClosed.and.returnValue(of(false));

    userService.deleteUser.and.stub();

    component.deleteUser(1);

    expect(dialog.open).toHaveBeenCalled();
    expect(userService.deleteUser).not.toHaveBeenCalled();
  });

  it('should open confirmation dialog and delete all doctors when confirmed', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialog.open.and.returnValue(dialogRefSpy);
    dialogRefSpy.afterClosed.and.returnValue(of(true));

    userService.deleteAllDoctors.and.stub();

    component.deleteAllDoctors();

    expect(dialog.open).toHaveBeenCalled();
    expect(userService.deleteAllDoctors).toHaveBeenCalled();
  });

  it('should not delete doctors when cancelled in confirmation dialog', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialog.open.and.returnValue(dialogRefSpy);
    dialogRefSpy.afterClosed.and.returnValue(of(false));

    userService.deleteAllDoctors.and.stub();

    component.deleteAllDoctors();

    expect(dialog.open).toHaveBeenCalled();
    expect(userService.deleteAllDoctors).not.toHaveBeenCalled();
  });
});
