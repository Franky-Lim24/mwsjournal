import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartService } from './chart.service';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit, AfterViewInit {
    dataSub: Subscription;
    multi: { name: string; series: { name: string; value: number }[] }[] =
        fakeData;
    view: [number, number] = [700, 300];

    // options
    legend: boolean = true;
    showLabels: boolean = true;
    animations: boolean = true;
    xAxis: boolean = true;
    yAxis: boolean = true;
    showYAxisLabel: boolean = true;
    showXAxisLabel: boolean = true;
    xAxisLabel: string = new Date().getFullYear().toString();
    yAxisLabel: string = 'Revenue';
    timeline: boolean = true;

    constructor(private chartService: ChartService) {}

    ngOnInit(): void {}

    ngAfterViewInit() {
        this.changeData();
    }

    onSelect(data): void {
        console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    }

    onActivate(data): void {
        console.log('Activate', JSON.parse(JSON.stringify(data)));
    }

    onDeactivate(data): void {
        console.log('Deactivate', JSON.parse(JSON.stringify(data)));
    }

    changeData() {
        this.dataSub = this.chartService.getChart().subscribe(
            (res: []) => {
                let series = [];

                res.map((dataPlot) => {
                    series.push({
                        name: dataPlot['month'],
                        value: dataPlot['profit'],
                    });
                });
                this.multi = [
                    {
                        name: 'Revenue',
                        series: series,
                    },
                ];
                this.dataSub.unsubscribe();
            },
            (err) => console.log(err)
        );
    }
}

const fakeData = [
    {
        name: 'Revenue',
        series: [
            {
                name: 'January',
                value: 123450,
            },
            {
                name: 'February',
                value: 423450,
            },
            {
                name: 'March',
                value: 92350,
            },
            {
                name: 'April',
                value: 223450,
            },
            {
                name: 'May',
                value: 523450,
            },
            {
                name: 'June',
                value: 623450,
            },
        ],
    },
];
