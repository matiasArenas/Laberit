import { User } from '../models/user.model';
import { Address } from '../models/address.model';
import { Insurer } from '../models/insurer.model';


export function mapToUser(json: any): User {
    return {
      id: json.id,
      firstName: json.firstName,
      lastName1: json.lastName1,
      lastName2: json.lastName2 || '',
      gender: json.gender as 'Hombre' | 'Mujer' | 'Otro',
      birthDate: json.birthDate,
      nif: json.nif,
      type: json.type as 'Paciente' | 'Profesional',
      address: mapToAddress(json.address),
      insurers: json.insurers ? mapToInsurer(json.insurers) : null,
      professionalType: json.professionalType as 'Médico' | 'Enfermera' | 'Administrativo' | undefined,
      nhc: json.nhc || undefined,
      collegeNumber: json.collegeNumber || undefined,
    };
  }
  
  export function mapToAddress(json: any): Address {
    return {
      street: json.street,
      number: json.number,
      door: json.door,
      postalCode: json.postalCode,
      city: json.city,
    };
  }
  
  export function mapToInsurer(json: any): Insurer {
    return {
      name: json.name,
      insuranceType: json.insuranceType as 'Salud' | 'Familiar' | 'Dental' | null,
      cardNumber: json.cardNumber,
    };
  }

  export function mapFormToJson(formValue: any, newId: number): any {
    return {
      id: newId,
      firstName: formValue.firstName,
      lastName1: formValue.lastName1,
      lastName2: formValue.lastName2 || '',
      gender: formValue.gender || '',
      birthDate: formValue.birthDate || '',
      nif: formValue.nif,
      type: formValue.type || 'paciente',
      nhc: formValue.nhc || '',
      professionalType: formValue.professionalType || null,
      collegeNumber: formValue.collegeNumber || null,
      address: {
        street: formValue.address?.street || '',
        number: formValue.address?.number || '',
        door: formValue.address?.door || '',
        postalCode: formValue.address?.postalCode || '',
        city: formValue.address?.city || '',
      },
      insurers: {
        name: formValue.insurers?.name || null,
        cardNumber: formValue.insurers?.cardNumber || null,
        insuranceType: formValue.insurers?.insuranceType || null,
      },
    };
  }