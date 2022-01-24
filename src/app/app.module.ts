import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatchResultsComponent } from './match-results/match-results.component';

import {HttpClientModule} from "@angular/common/http";
import { HistoryAggregateDataComponent } from './history-aggregate-data/history-aggregate-data.component';
import { LiveMatchesComponent } from './live-matches/live-matches.component';

@NgModule({
  declarations: [
    AppComponent,
    MatchResultsComponent,
    HistoryAggregateDataComponent,
    LiveMatchesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
