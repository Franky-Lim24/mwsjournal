import { CurrencyPipe, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';

@Component({
    selector: 'app-status',
    templateUrl: './status.component.html',
    styleUrls: ['./status.component.css'],
})
export class StatusComponent implements AfterViewInit, OnInit {
    @ViewChild(MatSort) sort: MatSort;

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }
    displayedColumns: string[] = ['tanggal', 'status'];
    dataSource = new MatTableDataSource(dataStatus);
    formattedAmount;

    constructor(private currencyPipe: CurrencyPipe) {}

    transformEle(element) {
        console.log(element);
        this.formattedAmount = this.currencyPipe.transform(
            this.formattedAmount,
            'IDR',
            'Rp '
        );
        element.target.value = this.formattedAmount;
    }

    ngOnInit(): void {}
}

export interface Status {
    tanggal: string;
    status: string;
}

const dataStatus: Status[] = [
    {
        tanggal: moment(new Date('2020-12-13')).format('D MMM YYYY'),
        status: 'Tidak Lengkap',
    },
    {
        tanggal: moment(new Date('2020-12-13')).format('D MMM YYYY'),
        status: 'Tidak Lengkap',
    },
    {
        tanggal: moment(new Date('2020-12-13')).format('D MMM YYYY'),
        status: 'Tidak Lengkap',
    },
    {
        tanggal: moment(new Date('2020-12-13')).format('D MMM YYYY'),
        status: 'Tidak Lengkap',
    },
    {
        tanggal: moment(new Date('2020-12-13')).format('D MMM YYYY'),
        status: 'Tidak Lengkap',
    },
    {
        tanggal: moment(new Date('2020-12-13')).format('D MMM YYYY'),
        status: 'Tidak Lengkap',
    },
    {
        tanggal: moment(new Date('2020-12-13')).format('D MMM YYYY'),
        status: 'Tidak Lengkap',
    },
];
