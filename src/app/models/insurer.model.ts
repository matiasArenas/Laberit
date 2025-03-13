export interface Insurer {
    name: string;
    insuranceType: 'Salud' | 'Familiar' | 'Dental' | null;
    cardNumber: string;
  }