import { Component, OnInit } from '@angular/core';
import { IMatchResult} from "../match-result.model";
import { MatchResultService} from "../services/match-result.service";
import {IRawMatchResultData} from "../raw-match-result-data.model";

@Component({
  selector: 'app-match-results',
  templateUrl: './match-results.component.html',
  styleUrls: ['./match-results.component.css']
})
export class MatchResultsComponent implements OnInit {

  matchResults: IMatchResult[] = [];
  constructor(
    private matchResultService: MatchResultService
  ) { }

  ngOnInit(): void {
    this.getMatchResults();
  }

  getMatchResults(): void { // get results from server
    this.matchResultService.getMatchResults()
      .subscribe(result => this.matchResults = result);
  }

}
