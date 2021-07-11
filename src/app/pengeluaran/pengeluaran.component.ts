import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-pengeluaran',
    templateUrl: './pengeluaran.component.html',
    styleUrls: ['./pengeluaran.component.css'],
})
export class PengeluaranComponent implements OnInit {
    @ViewChild('tunaiPengeluaran') tunaiPengeluaran: ElementRef;
    @ViewChild(MatSort) sort: MatSort;

    formattedAmount;
    jumlahPengeluaran = 0;
    dataSource = new MatTableDataSource(dataPengeluaran);
    displayedColumns: string[] = ['cek', 'nominal', 'status'];

    constructor(
        private datePipe: DatePipe,
        private currencyPipe: CurrencyPipe
    ) {}

    getTomorrow() {
        let d = new Date();
        d.setDate(d.getDate() + 1);
        return this.datePipe.transform(d, 'yyyy-MM-dd');
    }

    transformAmount2(element) {
        this.formattedAmount = this.currencyPipe.transform(
            this.formattedAmount,
            'IDR',
            'Rp '
        );

        element.target.value = this.formattedAmount;
    }

    calcPengeluaran() {
        let tunai = Number(
            this.tunaiPengeluaran.nativeElement.value.replace(/[^0-9.-]+/g, '')
        );
        let cek = document.querySelectorAll('.nominalPengeluaran');
        for (let x = 0; x < cek.length; x++) {
            let cekItem = cek[x].innerHTML.split(' ')[2];
            let number = Number(cekItem.replace(/[^0-9.-]+/g, ''));
            tunai += number;
        }
        this.jumlahPengeluaran = tunai;
    }

    ngOnInit(): void {}

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }
}

export interface DataPengeluaran {
    bank: string;
    cek: string;
    nominal: number;
    status: boolean;
}

const dataPengeluaran: DataPengeluaran[] = [
    { nominal: 1, status: true, cek: 'H', bank: 'Hydrogen' },
    { nominal: 2, status: false, cek: 'He', bank: 'Hydrogen' },
    { nominal: 3, status: false, cek: 'Li', bank: 'Hydrogen' },
    { nominal: 4, status: false, cek: 'Be', bank: 'Hydrogen' },
    { nominal: 5, status: true, cek: 'B', bank: 'Hydrogen' },
    { nominal: 6, status: false, cek: 'C', bank: 'Hydrogen' },
    { nominal: 7, status: false, cek: 'N', bank: 'Hydrogen' },
    { nominal: 8, status: false, cek: 'O', bank: 'Hydrogen' },
    { nominal: 9, status: false, cek: 'F', bank: 'Hydrogen' },
    { nominal: 10, status: false, cek: 'Ne', bank: 'Hydrogen' },
];
