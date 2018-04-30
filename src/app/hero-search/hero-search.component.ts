import { Component, OnInit } from '@angular/core';

import { Observable } from "rxjs/observable";
import { Subject } from "rxjs/Subject";
import { of } from "rxjs/observable/of";

import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";

import { Hero } from "../hero";
import { HeroService } from "../hero.service";

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) { }

  // Push a search term into the observable stream.
  search(term: string): void{
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // esperar 300ms antes de considerar qualquer pressionar do teclado
      debounceTime(300),

      //ignorar novo termo se igual ao anterior
      distinctUntilChanged(),

      // mudar para novo observable de pesquisa toda vez que termo mudar
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }

}
