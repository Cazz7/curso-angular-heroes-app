import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interfaces';
import { HeroesService } from '../../services/heros.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit{

  public heroForm = new FormGroup({
    id:               new FormControl<string>(''),
    superhero:        new FormControl<string>('', { nonNullable: true }),// Esto indica que nunca puede ser nulo
    publisher:        new FormControl<Publisher>(Publisher.DCComics),//Se inicializa
    alter_ego:        new FormControl<string>(''),
    first_appearance: new FormControl<string>(''),
    characters:       new FormControl<string>(''),
    alt_img:          new FormControl<string>('')
  });

  public publishers = [
    {id: 'DC Comics', desc:'DC - Comics'},
    {id: 'Marvel Comics', desc:'Marvel - Comics'}
  ]

  constructor(
      private heroesService: HeroesService,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private snackbar: MatSnackBar,
      private dialog: MatDialog
       ){}

  ngOnInit(): void {
    // Verifico si estoy editando o creando
    if( !this.router.url.includes('edit') ) return;

    this.activatedRoute.params
      .pipe(
        switchMap( ({id}) => this.heroesService.getHeroById(id) )
      ).subscribe( hero => {
        if(!hero) return this.router.navigateByUrl('/'); //Si no existe voy a home
        //this.heroForm.setValue();// Con esto debo indicar campo por campo
        this.heroForm.reset( hero ); // Con este no tengo que poner campo por campo
        return;
      })
  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;

    return hero;
  }

  onSubmit():void{

    if( this.heroForm.invalid  ) return;

    // Inicialmente no son compatibles completamente
    //this.heroesService.updateHero( this.heroForm.value )

    // Por eso se usa el getter
    // Modificar
    if( this.currentHero.id ){
      // Recordar que es un observable que no se dispara hasta que me suscriba
      this.heroesService.updateHero( this.currentHero )
      .subscribe( hero => {
        // TODO: Mostrar snackbar
        this.showSnackbar(`${hero.superhero} updated!`);
      });
    }else{
      // Crear
      // Recordar que es un observable que no se dispara hasta que me suscriba
      // El id se pone solito
      this.heroesService.addHero( this.currentHero )
      .subscribe( hero => {
        // TODO: Mostrar snackbar y navegar a /heroes/edit/hero.id
        this.showSnackbar(`${hero.superhero} created!`);
        this.router.navigate(['/heroes/edit', hero.id]); // Recordar que es otra forma de hacerlo
      });
    }

  }

  showSnackbar( message: string):void{
    this.snackbar.open( message, 'Done', {
      duration: 2500
    } )
  }

  onDeleteHero(){
    if( !this.currentHero.id ) throw Error('Hero id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });
    // Forma mas elegante de hacerlo
    dialogRef.afterClosed()
    .pipe(
      filter( (result: boolean) => result ), // solo deja pasar al siguiente paso si la condicion se cumple
      switchMap(() => this.heroesService.deleteHeroById(this.currentHero.id)) ,
      //tap( wasDeleted => console.log({wasDeleted}) ), // Es opcional, solo para mirar
      filter( (wasDeleted: boolean) => wasDeleted ),
    )
    .subscribe(() => { // Aqui el resultado no me interesa porque se que en este punto es true
      this.router.navigate(['/heroes']);
    });

    // Esta es una forma de hacerlo pero es fea porque hay un
    //subscribe dentro de otro subscribe
    // dialogRef.afterClosed().subscribe(result => {
    //   if(!result) return;
    //   // Recordar que hay que suscribirse para que funciones
    //   this.heroesService.deleteHeroById( this.currentHero.id )
    //     .subscribe( wasDeleted => {
    //       if( wasDeleted )
    //       this.router.navigate(['/heroes']);
    //     });
    // });
  }
}
