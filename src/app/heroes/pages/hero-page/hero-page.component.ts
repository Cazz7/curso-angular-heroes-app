import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heros.service';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, switchMap } from 'rxjs';
import { Hero } from '../../interfaces/hero.interfaces';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styles: [
  ]
})
export class HeroPageComponent implements OnInit {

public hero?: Hero;

  constructor(
    private heroesService: HeroesService,
    private activatedRounte: ActivatedRoute,
    private router: Router ){}

  ngOnInit(): void {
    // Para extraer los parametros
    // Esto lo miro de la ruta
    this.activatedRounte.params
    .pipe(
      switchMap( ({id}) => this.heroesService.getHeroById( id ) )
    ).subscribe( hero => {
      // si no se encuentra nada se retorna a la pantalla anterior
      if( !hero ) return this.router.navigate([ '/heroes/list' ])
      this.hero = hero;
      return;
    });
  }

  public goBack():void{
    this.router.navigateByUrl('heroes/list')
  }
}
