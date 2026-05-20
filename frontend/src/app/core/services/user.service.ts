import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Address, AddressType, User } from '../models/user.model';
import { env } from '../config/env';

// ── Backend DTO shapes ────────────────────────────────────────────────────────

interface AddressDto { id: number; street: string; houseNumber: string; postalCode: string; city: string; country: string; type: string; }
interface UserDto { id: string; firstName: string; lastName: string; email: string; registrationDate: string; addresses: AddressDto[]; }

// ── Mapper ────────────────────────────────────────────────────────────────────

function toAddress(dto: AddressDto, userId: string): Address {
  return { id: String(dto.id), userId, street: dto.street, houseNumber: dto.houseNumber, postalCode: dto.postalCode, city: dto.city, country: dto.country, type: dto.type as AddressType };
}

function toUser(dto: UserDto): User {
  return { id: dto.id, firstName: dto.firstName, lastName: dto.lastName, email: dto.email, registrationDate: dto.registrationDate, addresses: dto.addresses.map(a => toAddress(a, dto.id)) };
}

// ── Service ───────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  getProfile(): Observable<User> {
    return this.http.get<UserDto>(`${env.apiUrl}/users/me`).pipe(map(toUser));
  }

  getAddresses(): Observable<Address[]> {
    return this.http.get<AddressDto[]>(`${env.apiUrl}/users/me/addresses`).pipe(
      map(dtos => dtos.map(a => toAddress(a, ''))),
    );
  }

  addAddress(address: Omit<Address, 'id' | 'userId'>): Observable<Address> {
    return this.http.post<AddressDto>(`${env.apiUrl}/users/me/addresses`, {
      street: address.street,
      houseNumber: address.houseNumber,
      postalCode: address.postalCode,
      city: address.city,
      country: address.country,
      type: address.type,
    }).pipe(map(dto => toAddress(dto, '')));
  }

  updateProfile(data: Partial<Pick<User, 'firstName' | 'lastName' | 'email'>>): Observable<User> {
    return this.http.put<UserDto>(`${env.apiUrl}/users/me`, data).pipe(map(toUser));
  }
}
