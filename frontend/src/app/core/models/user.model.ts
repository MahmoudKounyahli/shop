export type AddressType = 'shipping' | 'billing';

export interface Address {
  id: string;
  userId: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  country: string;
  type: AddressType;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  registrationDate: string;
  addresses?: Address[];
}
