import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  createRecord(data: any) {
  return this.http.post(
    `${this.apiUrl}/records`,
    data
  );
}

  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  getUsers() {
    return this.http.get(`${this.apiUrl}/users`);
  }

  addUser(user: any) {
    return this.http.post(`${this.apiUrl}/users`, user);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  getUserRecords(username: string) {
    return this.http.get(
      `${this.apiUrl}/records/${username}`
    );
  }

  getAllRecords() {
    return this.http.get(
      `${this.apiUrl}/records`
    );
  }

  

checkUserRole(username: string) {

  return this.http.get(
    `${this.apiUrl}/users/check/${username}`
  );
}
  updateRecord(id: string, data: any) {
    return this.http.put(
      `${this.apiUrl}/records/${id}`,
      data
    );
  }
}