import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserFormComponent } from './user-form.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { UserService } from '../../services/user.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { User } from '../../models/user.model';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['getUserById', 'addUser', 'updateUser']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      declarations: [UserFormComponent],
      imports: [ReactiveFormsModule, MatSnackBarModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' }, routeConfig: { path: 'edit' } } } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    component.ngOnInit();
    expect(component.userForm).toBeDefined();
    expect(component.userForm.controls['firstName']).toBeTruthy();
  });

  it('should set edit mode and load user data on init if the route is edit', async () => {
const mockUsers: User =
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
      };

    mockUserService.getUserById.and.returnValue(Promise.resolve(mockUsers));

    component.ngOnInit();
    await fixture.whenStable();

    expect(component.title).toBe('Editar Usuario');
    expect(component.userForm.value.firstName).toBe('John');
    expect(component.userForm.value.address.city).toBe('Madrid');
  });

  it('should show an error snack bar if user not found in edit mode', async () => {
    mockUserService.getUserById.and.returnValue(Promise.resolve(undefined));
    component.ngOnInit();
    await fixture.whenStable();

    expect(mockSnackBar.open).toHaveBeenCalledWith('No se encontró el usuario', 'Cerrar');
  });
});
