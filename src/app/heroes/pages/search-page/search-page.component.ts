import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Hero } from '../../interfaces/hero.interfaces';
import { HeroesService } from '../../services/heros.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: [
  ]
})
export class SearchPageComponent {

  public heroes: Hero[] = [];
  public selectedHero?: Hero;
  // Debo importar formularios reactivos para que esto funcione
  public searchInput = new FormControl('');

  constructor( private heroesService: HeroesService ){}

  searchHero():void{
    // se pone el vacio por si llega a ser nulo
    const value: string = this.searchInput.value || '';
    //console.log({value})
    this.heroesService.getSuggestions( value )
      .subscribe( heroes => this.heroes = heroes );
  }

  onSelectedOption(event: MatAutocompleteSelectedEvent):void{
    //console.log(event.option.value)
    if (!event.option.value){
      this.selectedHero = undefined;
      return;
    }

    // Yo se que es un heroe
    const hero: Hero = event.option.value;
    this.searchInput.setValue(hero.superhero);

    this.selectedHero = hero;
  }
}
