import { Component, OnInit, Input } from '@angular/core';
import { Observable, of, pipe } from 'rxjs';
import { map, filter, tap, take } from 'rxjs/operators';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Country } from 'src/app/core/models/country.model';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  countries$!: Observable<any[]>;
  countries: any = [];
  chart: any = [];

  public olympics$: Observable<any> = of(null);
  mycountry!: Country;

  constructor(private olympicService: OlympicService) {}

  getData(): void {
    this.countries$ = this.olympicService.getAllCountries();
  }

  getDatas(): void {
    this.olympicService
      .getAllCountries()
      .pipe(take(1))
      .subscribe((res: any) => {
        res.forEach((country: any) => {
          var sum = 0;
          country.participations.forEach((part: any) => {
            sum += part.medalsCount;
          });
          this.countries.push({
            id: country.id,
            country: country.country,
            totalMeds: sum,
          });
        });

        var myChart = new Chart('myChart', {
          type: 'pie',
          data: {
            labels: this.countries.map((x: any) => x.country),
            datasets: [
              {
                label: '# of medals',
                data: this.countries.map((x: any) => x.totalMeds),
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

            onClick(e, x) {
              window.open(
                'http://localhost:4200/details/' + (x[0].index + 1),
                '_self'
              );
            },
          },
        });
      });
  }

  ngOnInit(): void {
    /*   this.olympics$ = this.olympicService.getOlympics();

    this.olympics$.subscribe((val) => {
      this.countries.push(val);
      console.log(this.countries);
    });

    console.log(this.countries2);

    */

    this.getDatas();
    this.getData();
    this.mycountry = new Country(2, 'Italy', []);
  }
}
