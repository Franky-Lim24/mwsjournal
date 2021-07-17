import { CurrencyPipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { StatusService } from './status.service';
import * as moment from 'moment';
import { Status } from './status.model';

@Component({
    selector: 'app-status',
    templateUrl: './status.component.html',
    styleUrls: ['./status.component.css'],
})
export class StatusComponent implements AfterViewInit, OnInit {
    @ViewChild(MatSort) sort: MatSort;

    ngAfterViewInit() {
        this.changeData();
    }

    displayedColumns: string[] = ['tanggal', 'status'];
    dataSource = new MatTableDataSource();
    data: Status[];
    formattedAmount;
    dataSub: Subscription;
    constructor(
        private currencyPipe: CurrencyPipe,
        private statusService: StatusService
    ) {}

    transformEle(element) {
        this.formattedAmount = this.currencyPipe.transform(
            this.formattedAmount,
            'IDR',
            'Rp '
        );
        element.target.value = this.formattedAmount;
    }

    changeData() {
        this.dataSub = this.statusService.getStatus().subscribe(
            (res: Status[]) => {
                this.data = res.filter((item) => {
                    return moment(item['date']).toDate() <= new Date();
                });
                this.dataSource.data = this.data;
                this.dataSource.sort = this.sort;
                this.dataSub.unsubscribe();
            },
            (err) => console.log(err)
        );
    }

    ngOnInit(): void {}
}
