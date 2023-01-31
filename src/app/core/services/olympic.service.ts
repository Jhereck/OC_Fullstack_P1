import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap, map, reduce, scan, concatWith } from 'rxjs/operators';
import { Country } from 'src/app/core/models/country.model';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<any>(undefined);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<any[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(null);
        return caught;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  getAllCountries(): Observable<any> {
    return this.http.get<any>('./assets/mock/olympic.json');
  }

  getCountry(id: number): Observable<any> {
    return this.getAllCountries().pipe(
      map((countries: any) =>
        countries.find((country: any) => country.id == id)
      )
    );
  }

  getMedalsPerCountry(id: number): Observable<number> {
    return this.getCountry(id).pipe(
      map((country: any) =>
        country.participations
          .map((y: any) => y.medalsCount * 1)
          .reduce((a: number, b: number) => a + b, 0)
      )
    );
  }

  getAthletesPerCountry(id: number): Observable<number> {
    return this.getCountry(id).pipe(
      map((country: any) =>
        country.participations
          .map((y: any) => y.athleteCount * 1)
          .reduce((a: number, b: number) => a + b, 0)
      )
    );
  }

  getTotalNumberOfJO(id: number): Observable<number> {
    return this.getCountry(id).pipe(
      map((country: any) => country.participations.length)
    );
  }
}
