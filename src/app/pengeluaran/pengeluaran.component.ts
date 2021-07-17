import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ModalComponent } from '../modal/modal.component';
import { StatusService } from '../status/status.service';
import { Pengeluaran } from './pengeluaran.model';
import { PengeluaranService } from './pengeluaran.service';

@Component({
    selector: 'app-pengeluaran',
    templateUrl: './pengeluaran.component.html',
    styleUrls: ['./pengeluaran.component.css'],
})
export class PengeluaranComponent implements OnInit {
    @ViewChild('tunaiPengeluaran') tunaiPengeluaran: ElementRef;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('tanggalInput') tanggalInput: ElementRef;
    @ViewChild('rowSync') rowSync: ElementRef;

    formattedAmount;
    jumlahPengeluaran = 0;
    dataSource: any = new MatTableDataSource();
    displayedColumns: string[] = ['bank', 'cek', 'nominal', 'gudang', 'status'];
    dataSub: Subscription;
    data: Pengeluaran[];
    editMode = false;
    putSub: Subscription;
    pengeluaranSub: Subscription;
    statusSub: Subscription;

    constructor(
        private datePipe: DatePipe,
        private currencyPipe: CurrencyPipe,
        private pengeluaranService: PengeluaranService,
        public dialog: MatDialog,
        private statusService: StatusService
    ) {}

    getTomorrow() {
        let d = new Date();
        d.setDate(d.getDate() + 1);
        return this.datePipe.transform(d, 'yyyy-MM-dd');
    }

    transformAmount2(element) {
        if (typeof this.formattedAmount === 'string') {
            let checker = this.formattedAmount.includes('.00');
            this.formattedAmount = this.formattedAmount.replace(/\D/g, '');
            if (checker) {
                this.formattedAmount = this.formattedAmount / 100;
            }
        }
        this.formattedAmount = this.currencyPipe.transform(
            this.formattedAmount,
            'IDR',
            'Rp '
        );

        element.target.value = this.formattedAmount;
    }

    calcPengeluaran() {
        let tunai = !!this.tunaiPengeluaran.nativeElement.value
            ? Number(
                  this.tunaiPengeluaran.nativeElement.value.replace(
                      /[^0-9.-]+/g,
                      ''
                  )
              )
            : 0;
        let cek = this.dataSource.filteredData;
        for (let x = 0; x < cek.length; x++) {
            tunai += cek[x]['nominal'];
        }
        this.jumlahPengeluaran = tunai;
    }

    ngOnInit(): void {}

    ngAfterViewInit() {
        this.changeData();
    }

    changeData() {
        this.dataSource.sort = this.sort;
        let date = this.tanggalInput.nativeElement.value;
        date = date.split('/');
        date = date[1] + '/' + date[0] + '/' + date[2];
        this.dataSub = this.pengeluaranService
            .getPengeluaran(new Date(date))
            .subscribe((res) => {
                this.data = res[0];
                this.dataSource.data = this.data;
                this.dataSource.sort = this.sort;
                this.formattedAmount = res[1]['tunai'];
                let blur = new MouseEvent('blur');
                this.tunaiPengeluaran.nativeElement.dispatchEvent(blur);
                this.editMode = false;
                this.dataSub.unsubscribe();
                this.calcPengeluaran();
            });
    }

    syncData() {
        let rows = this.rowSync.nativeElement.children[0].children[1].children;
        this.data = [];
        for (let x = 0; x < rows.length; x++) {
            this.data.push({
                bank: rows[x].children[0].innerText,
                cek: rows[x].children[1].innerText,
                nominal: rows[x].children[2].innerText.replace(/\D/g, '') / 100,
                gudang: rows[
                    x
                ].children[3].firstElementChild.classList.contains(
                    'mat-checkbox-checked'
                ),
                status: rows[
                    x
                ].children[4].firstElementChild.classList.contains(
                    'mat-checkbox-checked'
                ),
            });
        }
        this.dataSource.data = this.data;
        this.calcPengeluaran();
    }

    saveData() {
        this.syncData();
        let date = this.tanggalInput.nativeElement.value;
        date = date.split('/');
        date = date[1] + '/' + date[0] + '/' + date[2];
        let tunai = !!this.tunaiPengeluaran
            ? Number(
                  this.tunaiPengeluaran.nativeElement.value.replace(
                      /[^0-9.-]+/g,
                      ''
                  )
              )
            : 0;
        this.putSub = this.pengeluaranService
            .putPengeluaran(new Date(date), this.dataSource.filteredData, tunai)
            .subscribe(
                (res) => {
                    this.putSub.unsubscribe();
                    this.openDialog('Saved!');
                },
                (err) => {
                    console.log(err);
                    this.openDialog('Error!');
                }
            );
        let status =
            this.dataSource.filteredData.filter(
                (item) => item['status'] === false
            ).length > 0;
        this.statusSub = this.statusService.putStatus(date, !status).subscribe(
            (res) => this.statusSub.unsubscribe(),
            (err) => console.log(err)
        );
    }

    openDialog(message: string): void {
        const dialogRef = this.dialog.open(ModalComponent, {
            width: '300px',
            data: {
                message: message,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {});
    }
}
