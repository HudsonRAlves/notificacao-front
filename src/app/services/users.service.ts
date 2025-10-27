import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import UserOutDTO from '../models/UserOutDTO';
import UserInDTO from '../models/UserInDTO';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
    private apiUrl = '/api/users';

    constructor(private http: HttpClient) {}

    getAll(): Observable<UserOutDTO[]> {
      return this.http.get<UserOutDTO[]>(this.apiUrl);
    }

    getById(id: number): Observable<UserOutDTO> {
      return this.http.get<UserOutDTO>(`${this.apiUrl}/${id}`);
    }

    create(user: UserInDTO): Observable<UserOutDTO> {
      return this.http.post<UserOutDTO>(this.apiUrl, user);
    }

    update(id: number, user: UserInDTO): Observable<UserOutDTO> {
      return this.http.put<UserOutDTO>(`${this.apiUrl}/${id}`, user);
    }

    delete(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}
