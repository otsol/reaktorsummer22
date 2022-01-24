import { Injectable } from '@angular/core';
import { IMatchResult } from "../match-result.model";
import { IPlayer} from "../player.model";
import { IRawMatchResultData, IRawGameResult} from "../raw-match-result-data.model";

import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Observable, throwError, combineLatest, lastValueFrom, zip, filter} from "rxjs";
import { map} from "rxjs/operators"
import { catchError, retry} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class MatchResultService {


  constructor(
    private http: HttpClient
  ) { }

    // link to my own http proxy to bypass CORS
    // Optimal solution is app and server under the same domain
    private resultsUrl = 'https://intense-brushlands-97068.herokuapp.com/https://bad-api-assignment.reaktor.com';


  sortedByDate(array: IMatchResult[]): IMatchResult[] {
    return array.sort( (a, b) =>  {
      return b.time - a.time;
      } );
  }


  getCursorAndResults(defaultCursor: string = "/rps/history/" ) {
    let json = this.http.get<IRawMatchResultData>(this.resultsUrl + defaultCursor );
    let matchResults = this.getMatchResults(json);
    let newCursor = json.pipe(map( h => h.cursor));
    return zip(newCursor, matchResults);
  }


  getMatchResults(json: Observable<IRawMatchResultData>): Observable<IMatchResult[]> {
    return json
      .pipe(map(h => h.data.map( match => {
        return this.rawResultToMatch(match);
      }))).pipe(
        catchError(this.handleError)
      );
  }

  
  rawResultToMatch(match: IRawGameResult): IMatchResult {
    const pA: IPlayer = { name: match.playerA.name, played: match.playerA.played };
    const pB: IPlayer = { name: match.playerB.name, played: match.playerB.played };

    let ret: IMatchResult = {
      type: match.type,
      matchId: match.gameId,
      time: match.t,
      playerA: pA,
      playerB: pB,
       // stackoverflow: https://stackoverflow.com/questions/13142635/how-can-i-create-an-object-based-on-an-interface-file-definition-in-typescript
    };
    return ret;
  }


  // helper function for getPlayerData
  hasPlayer(element: IMatchResult, name: string): boolean {
    return element.playerA.name == name || element.playerB.name == name;
  }

  async getPlayerData(name: string): Promise<IMatchResult[]> {
    let results: IMatchResult[][] = [];
    let cursors: string[] = [];

    let first$ = this.getCursorAndResults()
    let first = await lastValueFrom(first$);
    results.push(first[1].filter(match => this.hasPlayer(match, name)));

    for(let i = 0; i < 4; i++) {
      let nextCursor: string = first[0];
      console.log(nextCursor);
      cursors.push(nextCursor);
      first$ = this.getCursorAndResults(nextCursor);
      first = await lastValueFrom(first$);
      results.push(first[1].filter(match => this.hasPlayer(match, name)));
    }
    return results.flat();
  }



  handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  } // https://angular.io/guide/http#handling-request-errors

}

