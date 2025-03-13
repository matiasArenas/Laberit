import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { User } from '../models/user.model';
import { HttpClientModule } from '@angular/common/http';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let mockUsers: User[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);

    mockUsers = [
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
          city: 'Madrid',
        },
        insurers: {
          name: 'HealthCo',
          insuranceType: 'Salud',
          cardNumber: 'HC12345',
        },
        nhc: '123456789',
        professionalType: null,
        collegeNumber: null,
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName1: 'Smith',
        lastName2: 'Johnson',
        gender: 'Mujer',
        birthDate: '1975-11-15',
        nif: '98765432B',
        type: 'Profesional',
        address: {
          street: 'Calle de la Salud',
          number: '45',
          door: '2B',
          postalCode: '28015',
          city: 'Madrid',
        },
        insurers: null,
        nhc: null,
        professionalType: 'Médico',
        collegeNumber: 'MD12345',
      },
    ];
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch users', async () => {
    service.getUsers().then(users => {
      expect(users.length).toBe(2);
      expect(users[0].firstName).toBe('John');
      expect(users[1].firstName).toBe('Jane');
    });

    const req = httpMock.expectOne('assets/data/users.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should add a new user', async () => {
    const newUser = {
      firstName: 'Maria',
      lastName1: 'Lopez',
      lastName2: 'Gonzalez',
      gender: 'femenino',
      birthDate: '1990-01-10',
      nif: '56789012C',
      type: 'paciente',
      address: {
        street: 'Calle Test',
        number: '5',
        door: '2A',
        postalCode: '08000',
        city: 'Barcelona'
      },
      insurers: {
        name: 'TestInsurer',
        insuranceType: 'salud',
        cardNumber: 'T12345'
      },
      nhc: '112233445',
      professionalType: null,
      collegeNumber: null
    };

    spyOn(service, 'getUsers').and.returnValue(Promise.resolve(mockUsers));
    await service.addUser(newUser);

    expect(service['usersInMemory'].length).toBe(3);
    expect(service['usersInMemory'][2].firstName).toBe('Maria');
  });

  it('should delete a user', async () => {
    spyOn(service, 'getUsers').and.returnValue(Promise.resolve(mockUsers));
  
    await service.getUsers();
    service.deleteUser(2);
  
    expect(service['usersInMemory'].length).toBe(0);
    expect(service['usersInMemory'].find(user => user.id === 2)).toBeUndefined();
  });

  it('should delete all doctors', async () => {
    spyOn(service, 'getUsers').and.returnValue(Promise.resolve(mockUsers));

    service.deleteAllDoctors();

    expect(service['usersInMemory'].length).toBe(0);
    expect(service['usersInMemory'].find(user => user.professionalType === 'Médico')).toBeUndefined();
  });
});
