import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from 'src/environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {

  private baseUrl = environments.baseUrl;
  private user?: User;

  constructor(private httpClient: HttpClient) { }

  get currentUser():User|undefined{
    if(!this.user) return undefined;
    //return {...this.user}; // Se puede usar el operador spread para no pasar el usuario
                            // Por referencia

    //No obstante, se va a usar el structuredClone para salvaguardar al usuario
    // Se puede usar desde la version 17
    // Se hara un clone de la propiedad y no se devuelve la propiedad en si
    return structuredClone( this.user );
  }

  login(email: string, password: string): Observable<User>{

    // En el mundo real la autenticacion se haria con un post
    //this.httpClient.post('url',{email. password})

    return this.httpClient.get<User>(`${this.baseUrl}/users/1`)
      .pipe(
        tap(user => this.user = user), // Cada paso solo debe hacer una cosa. Pero se podria hacer en un solo tap
        tap(user => localStorage.setItem('token','ADsdfsdaf.ASFsfsd.ADGFSDG')) // Esto se deberia hacer en cookies
      );

  }

  checkAuth(): Observable<boolean>{

    if(!localStorage.getItem('token')) return of(false);

    const token = localStorage.getItem('token');

    return this.httpClient.get<User>(`${ this.baseUrl }/users/1`)
      .pipe(
        tap(user => this.user = user),
        map(user => !!user ), //si el usuario tiene algun valor retorna verdadero
        catchError(err => of(false))
      );

  }

  logout(){
    this.user = undefined;
    localStorage.removeItem('token');
    //localStorage.clear() // esto elimina todo, tambien sirve
  }
}
