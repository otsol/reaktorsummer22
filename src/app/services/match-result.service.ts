import { Injectable } from '@angular/core';
import { IMatchResult } from "../match-result.model";
import { IPlayer} from "../player.model";
import { IRawMatchResultData, IRawGameResult} from "../raw-match-result-data.model";

import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Observable, throwError, combineLatest, lastValueFrom, zip, filter} from "rxjs";
import { mergeAll , map} from "rxjs/operators"
import { catchError, retry} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class MatchResultService {


  constructor(
    private http: HttpClient
  ) { }

    private resultsUrl = 'https://intense-brushlands-97068.herokuapp.com/https://bad-api-assignment.reaktor.com';

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

    getResults(defaultCursor: string = "/rps/history/" )/*: [Observable<string>, Observable<IMatchResult[]>]*/ {
      let json = this.http.get<IRawMatchResultData>(this.resultsUrl + defaultCursor )
      let match = json.pipe(map(h => h.data.map( match => {

          const pA: IPlayer = { name: match.playerA.name };
          const pB: IPlayer = { name: match.playerB.name };

          const ret: IMatchResult = {
            matchId: match.gameId,
            time: match.t,
            playerA: pA,
            playerB: pB,
            playedA: match.playerA.played,
            playedB: match.playerB.played
          };
          return ret;  // stackoverflow: https://stackoverflow.com/questions/13142635/how-can-i-create-an-object-based-on-an-interface-file-definition-in-typescript
        }))).pipe(
          catchError(this.handleError)
        );
      let newCursor = json.pipe(map( h => h.cursor))
      // return [newCursor, match];
      return zip(newCursor, match);
    }

    getMatchResults(cursor: string = "/rps/history/" ): Observable<IMatchResult[]> {
      return this.http.get<IRawMatchResultData>(this.resultsUrl + cursor )
        .pipe(map(h => h.data.map( match => {

          const pA: IPlayer = { name: match.playerA.name };
          const pB: IPlayer = { name: match.playerB.name };

          const ret: IMatchResult = {
            matchId: match.gameId,
            time: match.t,
            playerA: pA,
            playerB: pB,
            playedA: match.playerA.played,
            playedB: match.playerB.played
          };
          return ret;  // stackoverflow: https://stackoverflow.com/questions/13142635/how-can-i-create-an-object-based-on-an-interface-file-definition-in-typescript
        }))).pipe(
          catchError(this.handleError)
        );
    }
    hasPlayer(element: IMatchResult, name: string): boolean {
      return element.playerA.name == name || element.playerB.name == name;
    }

    async getPlayerData(name: string): Promise<IMatchResult[]> {
      let results: IMatchResult[][] = [];
      let cursors: string[] = [];

      let first$ = this.getResults()
      let first = await lastValueFrom(first$);
      results.push(first[1].filter(match => this.hasPlayer(match, name)));

      for(let i = 0; i < 4; i++) {
        // let nextCursor: string;
        // first[0].subscribe(h => nextCursor = h);
        let nextCursor: string = first[0];
        cursors.push(nextCursor);
        first$ = this.getResults(nextCursor);
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

