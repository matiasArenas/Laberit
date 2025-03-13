import { Address } from "./address.model";
import { Insurer } from "./insurer.model";

export interface User {
    id: number;
    firstName: string;
    lastName1: string;
    lastName2?: string;
    gender: 'Hombre' | 'Mujer' | 'Otro';
    birthDate: string;
    nif: string | null;
    type: 'Paciente' | 'Profesional';
    address: Address;
    insurers?: Insurer | null;
    professionalType?: 'Médico' | 'Enfermera' | 'Administrativo' | null;
    nhc?: string | null;
    collegeNumber?: string | null;
  }