import { Component, OnInit } from '@angular/core';
import { map, filter, tap, take, toArray, reduce } from 'rxjs/operators';
import { Observable, of, pipe } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.component.html',
  styleUrls: ['./country-details.component.scss'],
})
export class CountryDetailsComponent implements OnInit {
  chart: any = [];
  datas: any = [];
  tot$: Observable<any> = of(null);
  country$: Observable<any> = of(null);

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute
  ) {}

  sumss() {
    return this.country$.pipe(
      map((country: any) =>
        country.participations.medalsCount.reduce(
          (a: number, b: number) => a + b,
          0
        )
      )
    );
  }

  sums() {
    return this.country$.pipe(take(1)).subscribe({
      next: (v) => {
        var tot = v.participations
          .map((x: any) => x.medalsCount)
          .reduce((a: number, b: number) => a + b, 0);
        console.log(tot);
      },
      error: (e) => console.log(e),
      complete: () => console.info('ok'),
    });
  }

  getData() {
    this.country$.pipe(take(1)).subscribe({
      next: (val) => {
        console.log(val);
        console.log(val.participations.map((x: any) => x.id));
        var myChart = new Chart('myChart', {
          type: 'line',
          data: {
            labels: val.participations.map((x: any) => x.year),
            datasets: [
              {
                label: '# of medals',
                data: val.participations.map((x: any) => x.medalsCount),
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      },
      error: (e) => console.error(e),
      complete: () => console.info('complete'),
    });
  }

  ngOnInit(): void {
    const countryId = +this.route.snapshot.params['id'];
    this.country$ = this.olympicService.getCountry(countryId);
    this.getData();
    console.log(this.sums());
    this.tot$ = this.olympicService.getMedalsPerCountry(countryId);
    this.tot$.pipe(take(1)).subscribe((x) => console.log(x));
  }
}
