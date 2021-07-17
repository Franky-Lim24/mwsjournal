import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ChartService {
    constructor(private http: HttpClient) {}

    getChart() {
        return this.http.get('http://localhost:3003/api/chart');
    }

    putChart(profit: number) {
        return this.http.put('http://localhost:3003/api/chart', {
            data: profit,
        });
    }
}
