import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pengeluaran } from './pengeluaran.model';

@Injectable({ providedIn: 'root' })
export class PengeluaranService {
    constructor(private http: HttpClient) {}

    postPengeluaran(data: Pengeluaran) {
        return this.http.post('http://localhost:3003/api/pengeluaran', data);
    }

    getPengeluaran(date: Date) {
        return this.http.get('http://localhost:3003/api/pengeluaran', {
            params: new HttpParams().set('date', date.toString()),
        });
    }

    putPengeluaran(date: Date, data: Pengeluaran[], tunai: number) {
        return this.http.put('http://localhost:3003/api/pengeluaran', {
            date,
            data,
            tunai,
        });
    }
}
