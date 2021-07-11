import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PemasukanService {
    constructor(private http: HttpClient) {}

    getPemasukan(date: Date) {
        return this.http.get('http://localhost:3003/api/pemasukan', {
            params: new HttpParams().set('date', date.toString()),
        });
    }
}
