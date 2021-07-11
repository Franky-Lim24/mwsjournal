import { CurrencyPipe, DatePipe } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Pemasukan } from './pemasukan.model';
import { PemasukanService } from './pemasukan.service';
import * as moment from 'moment';

@Component({
    selector: 'app-pemasukan',
    templateUrl: './pemasukan.component.html',
    styleUrls: ['./pemasukan.component.css'],
})
export class PemasukanComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('tunaiPemasukan') tunaiPemasukan: ElementRef;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[] = ['bank', 'cek', 'tgl', 'nominal'];
    data: Pemasukan[] = dataPemasukan;
    formattedAmount;
    jumlahPemasukan = 0;
    dataSource = new MatTableDataSource(this.data);
    dataSub: Subscription;

    constructor(
        private datePipe: DatePipe,
        private currencyPipe: CurrencyPipe,
        private pemasukanService: PemasukanService
    ) {}

    getToday() {
        let d = new Date();
        d.setDate(d.getDate());
        return this.datePipe.transform(d, 'yyyy-MM-dd');
    }

    transformAmount(element) {
        this.formattedAmount = this.currencyPipe.transform(
            this.formattedAmount,
            'IDR',
            'Rp '
        );

        element.target.value = this.formattedAmount;
    }

    calcPemasukan() {
        let tunai = Number(
            this.tunaiPemasukan.nativeElement.value.replace(/[^0-9.-]+/g, '')
        );
        let cek = document.querySelectorAll('.nominalPemasukan');
        for (let x = 0; x < cek.length; x++) {
            let cekItem = cek[x].innerHTML.split(' ')[2];
            let number = Number(cekItem.replace(/[^0-9.-]+/g, ''));
            tunai += number;
        }
        this.jumlahPemasukan = tunai;
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    ngOnInit(): void {
        this.dataSub = this.pemasukanService
            .getPemasukan(
                new Date(
                    'Sun Jul 11 2021 10:10:18 GMT+0800 (Singapore Standard Time)'
                )
            )
            .subscribe(
                (res) => {
                    console.log(res);
                },
                (err) => {
                    console.log(err);
                }
            );
    }
    ngOnDestroy() {
        if (this.dataSub) {
            this.dataSub.unsubscribe();
        }
    }
}

// const dataPemasukan = [
//     { bank: 'Hydrogen', cek: 'Hydrogen', tgl: 'hi', nominal: 120001 },
//     { bank: 'Hydrogen', cek: 'Helium', tgl: 'hi', nominal: 120003 },
//     { bank: 'Hydrogen', cek: 'Lithium', tgl: 'hi', nominal: 120002 },
//     {
//         bank: 'Hydrogen',
//         cek: 'Beryllium',
//         tgl: 'hi',
//         nominal: 120000,
//     },
//     { bank: 'Hydrogen', cek: 'Boron', tgl: 'hi', nominal: 120000 },
//     { bank: 'Hydrogen', cek: 'Carbon', tgl: 'hi', nominal: 120000 },
//     { bank: 'Hydrogen', cek: 'Nitrogen', tgl: 'hi', nominal: 120000 },
//     { bank: 'Hydrogen', cek: 'Oxygen', tgl: 'hi', nominal: 120000 },
//     { bank: 'Hydrogen', cek: 'Fluorine', tgl: 'hi', nominal: 120000 },
//     { bank: 'Hydrogen', cek: 'Neon', tgl: 'hi', nominal: 120000 },
// ];

const dataPemasukan = [
    {
        bank: 'Hydrogen',
        cek: 'Hydrogen',
        tgl: moment(new Date('2020-12-13')).format('D MMM YYYY'),
        nominal: 120001,
    },
    {
        bank: 'Hydrogen',
        cek: 'Helium',
        tgl: moment(new Date('2020-12-13')).format('D MMM YYYY'),
        nominal: 120003,
    },
    {
        bank: 'Hydrogen',
        cek: 'Lithium',
        tgl: moment(new Date('2020-12-13')).format('D MMM YYYY'),
        nominal: 120002,
    },
    {
        bank: 'Hydrogen',
        cek: 'Beryllium',
        tgl: moment(new Date('2020-12-13')).format('D MMM YYYY'),
        nominal: 120000,
    },
    {
        bank: 'Hydrogen',
        cek: 'Boron',
        tgl: moment(new Date('2020-12-13')).format('D MMM YYYY'),
        nominal: 120000,
    },
    {
        bank: 'Hydrogen',
        cek: 'Carbon',
        tgl: moment(new Date('2020-12-13')).format('D MMM YYYY'),
        nominal: 120000,
    },
    {
        bank: 'Hydrogen',
        cek: 'Nitrogen',
        tgl: moment(new Date('2020-12-13')).format('D MMM YYYY'),
        nominal: 120000,
    },
    {
        bank: 'Hydrogen',
        cek: 'Oxygen',
        tgl: moment(new Date('2020-12-13')).format('D MMM YYYY'),
        nominal: 120000,
    },
    {
        bank: 'Hydrogen',
        cek: 'Fluorine',
        tgl: moment(new Date('2020-12-13')).format('D MMM YYYY'),
        nominal: 120000,
    },
    {
        bank: 'Hydrogen',
        cek: 'Neon',
        tgl: moment(new Date('2020-12-13')).format('D MMM YYYY'),
        nominal: 120000,
    },
];
