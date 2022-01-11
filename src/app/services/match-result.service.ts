import { Injectable } from '@angular/core';
import { IMatchResult } from "../match-result.model";
import { IPlayer} from "../player.model";
import { IRawMatchResultData, IRawGameResult} from "../raw-match-result-data.model";

import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {map, Observable, throwError } from "rxjs";
import { catchError, retry} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class MatchResultService {


  constructor(
    private http: HttpClient
  ) { }

    private resultsUrl = 'https://bad-api-assignment.reaktor.com/rps/history';

  // getMatchResults(): Observable<IMatchResult[]> { // ehka kuuluu olla private
  //   return this.http.get<IRawMatchResultData>(this.resultsUrl)
  //     .pipe(map(h => h.data)).pipe(map<IRawGameResult, IMatchResult>( match => {
  //       const ret: IMatchResult = {
  //         matchId: match.gameId,
  //         time: match.t,
  //         playerA: match.playerA[0],
  //         playerB: match.playerB[0],
  //         playedA: match.playerA[1],
  //         playedB: match.playerB[1]
  //       };
  //       return ret;  // stackoverflow: https://stackoverflow.com/questions/13142635/how-can-i-create-an-object-based-on-an-interface-file-definition-in-typescript
  //     }))
  //
  // }

    getMatchResults(): Observable<IMatchResult[]> {
      return this.http.get<IRawMatchResultData>(this.resultsUrl)
        .pipe(map(h => h.data.map( match => {
          const ret: IMatchResult = {
            matchId: match.gameId,
            time: match.t,
            playerA: match.playerA[0],
            playerB: match.playerB[0],
            playedA: match.playerA[1],
            playedB: match.playerB[1]
          };
          return ret;  // stackoverflow: https://stackoverflow.com/questions/13142635/how-can-i-create-an-object-based-on-an-interface-file-definition-in-typescript
        }))).pipe(
          catchError(this.handleError)
        );
    }

  private handleError(error: HttpErrorResponse) {
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
    return throwError(
      'Something bad happened; please try again later.');
  } // https://angular.io/guide/http#handling-request-errors

}

