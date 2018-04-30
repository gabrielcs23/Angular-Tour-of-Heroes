import { Component, OnInit } from '@angular/core';

import { GridOptions, RowNode } from "ag-grid";
import { GridApi } from "ag-grid";

import { HeroesComponent } from "../heroes/heroes.component";
import { Hero } from "../hero";
import { HeroService } from '../hero.service';

import { Router } from "@angular/router";

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent{

  private gridOptions: GridOptions;
  private heroes: Hero[];

  constructor(private heroService: HeroService, private router: Router) {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.columnDefs = [{
      headerName: "ID", field: "id", width: 80, suppressFilter: true, suppressSizeToFit: true,
      checkboxSelection: true
      },
      {headerName: "Name", field: "name", suppressSorting: true}
    ];
    this.gridOptions.rowSelection = 'simple';
    this.gridOptions.rowModelType = 'infinite';
    this.gridOptions.paginationPageSize = 5;
    this.gridOptions.cacheBlockSize = 50;
    this.gridOptions.cacheOverflowSize = 5;
    this.gridOptions.maxConcurrentDatasourceRequests = 2;
    this.gridOptions.maxBlocksInCache = 2;
    this.gridOptions.components = {
      loadingCellRenderer: function(params) {
        if(params.value !== undefined) {
          return params.value;
        }
        else return '<img src="https://raw.githubusercontent.com/ag-grid/ag-grid-docs/master/src/images/loading.gif">';
      }
    }
   }

  add(name: string): void{
    name = name.trim();
    if (!name) return;
    this.heroService.addHero( {name} as Hero).subscribe(
      hero => {
        this.heroes.push(hero);
        this.gridOptions.api.updateRowData({add: [{id: hero.id, name: hero.name}]});
      }
    );
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
    let data = [];
    for (let hero of this.heroes){
      data.push({id: hero.id, name: hero.name});
    }
    this.gridOptions.api.setRowData(data);
  }

  onRowSelected(event){
    this.router.navigateByUrl(`/detail/${event.node.data.id}`);
  }

  onGridReady(params) {
    this.heroService.getHeroes().subscribe(heroes => {
      this.heroes = heroes;
      let data = [];
      for (let hero of this.heroes){
        data.push({id: hero.id, name: hero.name});
      }
     // this.gridOptions.api.setRowData(data);
      ///**
      var dataSource = {
        rowCount: null,
        getRows: function(params) {
          console.log("asking for " + params.startRow + " to " + params.endRow);
          setTimeout(function() {
            var rowsThisPage = data.slice(params.startRow, params.endRow);
            var lastRow = -1;
            if (data.length <= params.endRow) {
              lastRow = data.length;
            }
            params.successCallback(rowsThisPage, lastRow);
          });
        }
      };
      this.gridOptions.api.setDatasource(dataSource);
     // */
    });
    this.gridOptions.api.sizeColumnsToFit();
  }
}
