import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interfaces';
import { environments } from '../../../environments/environments';

@Injectable({providedIn: 'root'})
export class HeroesService {

   private baseUrl: string = environments.baseUrl;

   constructor(private httpClient: HttpClient) { }

   getHeroes():Observable<Hero[]>{
     return this.httpClient.get<Hero[]>(
      `${ this.baseUrl }/heroes`
     );
   }

   getHeroById( id: string): Observable<Hero|undefined>{
      return this.httpClient.get<Hero>(`${ this.baseUrl }/heroes/${ id }`)
      .pipe(
        // Creo un observable que retorna un undefined, por eso
        // el of
        catchError( error => of(undefined) )
      );
   }

   getSuggestions( query: String ): Observable<Hero[]>{
    return this.httpClient.get<Hero[]>(`${this.baseUrl }/heroes?q=${ query }&_limit=6`);
   }
}
