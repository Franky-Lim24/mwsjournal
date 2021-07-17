import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StatusService {
    constructor(private http: HttpClient) {}

    getStatus() {
        return this.http.get('http://localhost:3003/api/status');
    }

    postStatus(date: Date) {
        return this.http.post('http://localhost:3003/api/status', {
            date,
        });
    }

    putStatus(date: Date, status: boolean) {
        return this.http.put('http://localhost:3003/api/status', {
            date,
            status,
        });
    }
}
