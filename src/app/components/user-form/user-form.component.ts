import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-form',
  standalone: false,
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  title: string = '';
  buttonSubmitLabel: string = '';
  userId: number | null = null;
  userForm!: FormGroup;
  isEdit: boolean = false;
  private _snackBar = inject(MatSnackBar);
  constructor(private route: ActivatedRoute, private router:Router, private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.setEditMode();
    this.initForm();
  }

  initForm() {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName1: ['', Validators.required],
      lastName2: [''],
      birthDate: [''],
      gender: [''],
      nif: ['', [Validators.pattern('[0-9A-Za-z]{8}[A-Za-z]{1}')]],
      nhc: ['', Validators.required],
      professionalType: ['Paciente'],
      type: ['paciente'],
      collegeNumber: [''],
      address: this.fb.group({
        city: [''],
        street: [''],
        door: [''],
        number: [''],
        postalCode: ['']
      }),
      insurers: this.fb.group({
        name: [''],
        cardNumber: [''],
        insuranceType: ['']
      })
    });
  }

  setEditMode() {
    const path = this.route.snapshot.routeConfig?.path;
    if (path?.includes('create')) {
      this.title = 'Alta de Usuario';
      this.buttonSubmitLabel = 'Guardar usuario';
      this.isEdit = false;
    } else {
      this.title = 'Editar Usuario';
      this.buttonSubmitLabel = 'Actualizar usuario';
      this.isEdit = true;
      const getId = this.route.snapshot.paramMap.get('id');
      this.userId = getId ? +getId : null;
      this.loadUserData(this.userId);
    }
  }

  async loadUserData(id:number | null) {
    try {
      const user = await this.userService.getUserById(id);
      if (user) {
        this.userForm.patchValue({
          firstName: user.firstName,
          lastName1: user.lastName1,
          lastName2: user.lastName2,
          birthDate: user.birthDate,
          gender: user.gender,
          nif: user.nif,
          nhc: user.nhc,
          professionalType: user.professionalType,
          type: user.type,
          collegeNumber: user.collegeNumber,
          address: {
            city: user.address.city,
            street: user.address.street,
            door: user.address.door,
            number: user.address.number,
            postalCode: user.address.postalCode,
          },
          insurers: {
            name: user.insurers?.name,
            cardNumber: user.insurers?.cardNumber,
            insuranceType: user.insurers?.insuranceType,
          }
        });
      } else {
        this.showSnackBar('No se encontró el usuario', 'Cerrar');
        this.goToHome();
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    }
  }

  async onSubmit(): Promise<void> {
    try {
      if (this.isEdit) {
        const updatedUser = { id: Number(this.userId), ...this.userForm.value };
        await this.userService.updateUser(Number(this.userId), updatedUser);
      } else {
        await this.userService.addUser(this.userForm.value);
      }
      this.userForm.reset();
      this.goToHome();
    } catch (error) {
      console.error('Error al agregar el usuario:', error);
    }
  }

  onUserTypeChange(event: any) {
    const selectedType = event.value;
    const nhc = this.userForm.get('nhc');
    const collegeNumber = this.userForm.get('collegeNumber');
    const professionalType = this.userForm.get('professionalType');

    if (selectedType === 'paciente') {
      nhc?.setValue('');
      collegeNumber?.clearValidators();
      collegeNumber?.setValue('');
      professionalType?.setValue('');
      nhc?.setValidators([Validators.required]);
    } else {
      nhc?.clearValidators();
      nhc?.setValue('');
      collegeNumber?.setValue('');
      collegeNumber?.setValidators([Validators.required]);
    }
    nhc?.updateValueAndValidity();
    collegeNumber?.updateValueAndValidity();
    professionalType?.updateValueAndValidity();
  }

  isProfessional() {
    return this.userForm.get('type')?.value === 'profesional';
  }

  goToHome(){
    this.router.navigate(['/users']);
  }

  showSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
