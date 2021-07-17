import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pemasukan } from './pemasukan.model';

@Injectable({ providedIn: 'root' })
export class PemasukanService {
    constructor(private http: HttpClient) {}

    getPemasukan(date: Date) {
        return this.http.get('http://localhost:3003/api/pemasukan', {
            params: new HttpParams().set('date', date.toString()),
        });
    }

    postPemasukan(date: Date, data: Pemasukan[], tunaiPemasukan: number) {
        return this.http.post('http://localhost:3003/api/pemasukan', {
            date,
            data,
            tunaiPemasukan,
        });
    }
}
