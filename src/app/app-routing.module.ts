import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatchResultsComponent } from "./match-results/match-results.component";
import { HistoryAggregateDataComponent} from "./history-aggregate-data/history-aggregate-data.component";

const routes: Routes = [
  { path: '', redirectTo: '/history', pathMatch: 'full'},
  { path: 'history', component: MatchResultsComponent},
  { path: 'player/:name', component: HistoryAggregateDataComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
