import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDetailComponent } from './user-detail.component';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { User } from '../../models/user.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackBar: jasmine.SpyObj<any>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['getUserById']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      declarations: [UserDetailComponent],
      imports: [MatSnackBarModule, HttpClientTestingModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadUserById on init', () => {
    spyOn(component, 'loadUserById');
    component.ngOnInit();
    expect(component.loadUserById).toHaveBeenCalled();
  });

  it('should load user data and set tree data when user is found', async () => {
    const mockUser: User = {
      id: 1,
      firstName: 'John',
      lastName1: 'Doe',
      lastName2: 'Smith',
      birthDate: '1980-01-01',
      gender: 'Hombre',
      nif: '12345678A',
      nhc: '123456789',
      type: 'Paciente',
      professionalType: 'Administrativo',
      address: {
        city: 'Madrid',
        street: 'Calle Principal',
        door: '1A',
        number: '123',
        postalCode: '28001',
      },
      insurers: {
        name: 'HealthCo',
        cardNumber: 'HC12345',
        insuranceType: 'Salud',
      },
    };

    mockUserService.getUserById.and.returnValue(Promise.resolve(mockUser));

    component.ngOnInit();
    await fixture.whenStable();

    expect(component.user).toEqual(mockUser);
    expect(component.treeDataSource.data.length).toBeGreaterThan(0);
  });

  it('should show an error snack bar and redirect if user not found', async () => {
    mockUserService.getUserById.and.returnValue(Promise.resolve(undefined));
    component.ngOnInit();
    await fixture.whenStable();

    expect(mockSnackBar.open).toHaveBeenCalledWith('No se encontró el usuario', 'Cerrar');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/users']);
  });

  it('should set tree data correctly', () => {
    const mockUser: User = {
      id: 1,
      firstName: 'John',
      lastName1: 'Doe',
      lastName2: 'Smith',
      birthDate: '1980-01-01',
      gender: 'Hombre',
      nif: '12345678A',
      nhc: '123456789',
      type: 'Paciente',
      professionalType: null,
      address: {
        city: 'Madrid',
        street: 'Calle Principal',
        door: '1A',
        number: '123',
        postalCode: '28001',
      },
      insurers: {
        name: 'HealthCo',
        cardNumber: 'HC12345',
        insuranceType: 'Salud',
      },
    };

    component.setTreeInformation(mockUser);

    expect(component.treeDataSource.data.length).toBeGreaterThan(0);
    expect(component.treeDataSource.data[0].name).toBe('Información del Usuario');
  });

  it('should navigate to /users when goToHome is called', () => {
    component.goToHome();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/users']);
  });
});