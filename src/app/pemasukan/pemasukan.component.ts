import { CurrencyPipe, DatePipe } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Pemasukan } from './pemasukan.model';
import { PemasukanService } from './pemasukan.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { PengeluaranService } from '../pengeluaran/pengeluaran.service';
import { StatusService } from '../status/status.service';
import { ChartService } from '../chart/chart.service';

@Component({
    selector: 'app-pemasukan',
    templateUrl: './pemasukan.component.html',
    styleUrls: ['./pemasukan.component.css'],
})
export class PemasukanComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('tunaiPemasukan') tunaiPemasukan: ElementRef;
    @ViewChild('tanggalInput') tanggalInput: ElementRef;
    @ViewChild('rowSync') rowSync: ElementRef;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[] = ['bank', 'cek', 'tgl', 'nominal'];
    data: Pemasukan[];
    formattedAmount;
    jumlahPemasukan = 0;
    dataSub: Subscription;
    dataSource: any = new MatTableDataSource();
    editMode: boolean;
    postSub: Subscription;
    timer = null;
    pengeluaranSub: Subscription;
    statusSub: Subscription;
    chartSub: Subscription;
    tempJumlah: number = 0;

    constructor(
        private datePipe: DatePipe,
        private currencyPipe: CurrencyPipe,
        private pemasukanService: PemasukanService,
        public dialog: MatDialog,
        private pengeluaranService: PengeluaranService,
        private statusService: StatusService,
        private chartService: ChartService
    ) {}

    getToday() {
        let d = new Date();
        d.setDate(d.getDate());
        return this.datePipe.transform(d, 'yyyy-MM-dd');
    }

    transformAmount(element) {
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

    transformElement(element) {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.timer = setTimeout(() => {
            let amount = element.target.innerText;
            if (typeof amount === 'string') {
                let checker = amount.includes('.00');
                amount = amount.replace(/\D/g, '');
                if (checker) {
                    amount = amount / 100;
                }
            }
            amount = this.currencyPipe.transform(amount, 'IDR', 'Rp ');
            element.target.innerText = amount;
            this.syncData();
        }, 1000);
    }

    calcPemasukan() {
        let tunai = !!this.tunaiPemasukan.nativeElement.value
            ? Number(
                  this.tunaiPemasukan.nativeElement.value.replace(
                      /[^0-9.-]+/g,
                      ''
                  )
              )
            : 0;
        let cek = this.dataSource.filteredData;
        for (let x = 0; x < cek.length; x++) {
            tunai += cek[x]['nominal'];
        }
        this.jumlahPemasukan = tunai;
    }

    syncData() {
        let rows = this.rowSync.nativeElement.children[0].children[1].children;
        this.data = [];
        for (let x = 0; x < rows.length; x++) {
            this.data.push({
                bank: rows[x].children[0].innerText,
                cek: rows[x].children[1].innerText,
                tgl: rows[x].children[2].innerText,
                nominal: rows[x].children[3].innerText.replace(/\D/g, '') / 100,
            });
        }
        this.dataSource.data = this.data;
        this.calcPemasukan();
    }

    ngAfterViewInit() {
        this.changeData();
    }

    saveData() {
        this.syncData();
        this.dataSource.data = this.dataSource.filteredData.filter(
            (item) => item.bank !== ''
        );
        let date = this.tanggalInput.nativeElement.value;
        date = date.split('/');
        date = date[1] + '/' + date[0] + '/' + date[2];
        let tunai = !!this.tunaiPemasukan
            ? Number(
                  this.tunaiPemasukan.nativeElement.value.replace(
                      /[^0-9.-]+/g,
                      ''
                  )
              )
            : 0;
        this.postSub = this.pemasukanService
            .postPemasukan(new Date(date), this.dataSource.filteredData, tunai)
            .subscribe(
                (res) => {
                    this.postSub.unsubscribe();
                },
                (err) => {
                    console.log(err);
                    this.openDialog('Error!');
                }
            );
        let filteredData = this.dataSource.filteredData.slice();
        for (let x = 0; x < filteredData.length; x++) {
            let pengeluaranData = filteredData[x];
            this.pengeluaranSub = this.pengeluaranService
                .postPengeluaran(pengeluaranData)
                .subscribe(
                    (res) => {
                        this.pengeluaranSub.unsubscribe();
                    },
                    (err) => console.log(err)
                );
            this.statusSub = this.statusService
                .postStatus(pengeluaranData['tgl'])
                .subscribe(
                    (res) => this.statusSub.unsubscribe(),
                    (err) => console.log(err)
                );
        }
        this.chartSub = this.chartService
            .putChart(this.jumlahPemasukan - this.tempJumlah)
            .subscribe(
                (res) => this.chartSub.unsubscribe(),
                (err) => console.log(err)
            );
        this.tempJumlah = this.jumlahPemasukan;
        this.openDialog('Saved!');
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

    changeData() {
        let date = this.tanggalInput.nativeElement.value;
        date = date.split('/');
        date = date[1] + '/' + date[0] + '/' + date[2];
        this.dataSub = this.pemasukanService
            .getPemasukan(new Date(date))
            .subscribe(
                (res: [Pemasukan[], { tunai: number }]) => {
                    this.data = res[0];
                    this.dataSource.data = this.data;
                    this.dataSource.sort = this.sort;
                    this.formattedAmount = res[1]['tunai'];
                    let blur = new MouseEvent('blur');
                    this.tunaiPemasukan.nativeElement.dispatchEvent(blur);
                    this.editMode = false;
                    this.dataSub.unsubscribe();
                    this.calcPemasukan();
                    this.tempJumlah = this.jumlahPemasukan;
                },
                (err) => {
                    console.log(err);
                }
            );
    }

    addRow() {
        this.data = this.dataSource.data.slice();
        this.data.push({
            bank: '',
            cek: '',
            tgl: '',
            nominal: 0,
        });
        this.dataSource.data = this.data;
    }

    ngOnInit(): void {
        //this.changeData();
    }

    ngOnDestroy() {
        if (this.dataSub) {
            this.dataSub.unsubscribe();
        }
        if (this.postSub) {
            this.postSub.unsubscribe();
        }
    }
}
