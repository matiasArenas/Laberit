import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User } from '../models/user.model';
import { mapToUser, mapFormToJson } from '../mappers/user.mapper';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'assets/data/users.json';
  private usersInMemory: User[] = [];
  constructor(private http: HttpClient) { }

  async getUsers(): Promise<User[]> {
    if (this.usersInMemory.length === 0) {
      const data: User[] = await firstValueFrom(this.http.get<User[]>(this.apiUrl));
      this.usersInMemory = data.map(mapToUser);
    }
    return this.usersInMemory;
  }

  async getUserById(id: number | null): Promise<User | undefined> {
    const users = await this.getUsers();
    return users.find(user => user.id === id);
  }

  async addUser(userFormValue: any): Promise<void> {
    try {
      const users = await this.getUsers();
      const lastId = users[users.length - 1]?.id || 0;
      const newUser = mapFormToJson(userFormValue, lastId + 1);
      users.push(newUser);
      this.usersInMemory = users;
      this.downloadUsersFile();
    } catch (error) {
      console.error('Error al agregar usuario:', error);
    }
  }

  async updateUser(id: number, updatedUser: User): Promise<void> {
    try {
      const users = await this.getUsers();
      const index = users.findIndex(user => user.id === id); console.log(index)
      if (index !== -1) {
        users[index] = updatedUser;
        this.usersInMemory = users;
        this.downloadUsersFile();
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  }

  deleteUser(id: number): void {
    console.log('service', id)
    const index = this.usersInMemory.findIndex(user => user.id === id); console.log(index)
    if (index !== -1) {
      this.usersInMemory.splice(index, 1);
      this.downloadUsersFile();
    }
  }

  deleteAllDoctors(): void {
    this.usersInMemory = this.usersInMemory.filter(user => user.professionalType !== 'Médico');
    this.downloadUsersFile();
  }

  private downloadUsersFile(): void {
    const usersJson = JSON.stringify(this.usersInMemory, null, 2);
    const blob = new Blob([usersJson], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'usuarios_actualizados.txt';
    link.click();
  }

}
