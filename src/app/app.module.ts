import { BrowserModule } from '@angular/platform-browser';
import { NgModule, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FormsModule } from '@angular/forms';
import { ContenteditableDirective } from './contenteditable.directive';
import { TabsComponent } from './tabs/tabs.component';
import { PemasukanComponent } from './pemasukan/pemasukan.component';
import { PengeluaranComponent } from './pengeluaran/pengeluaran.component';
import { StatusComponent } from './status/status.component';
import { ChartComponent } from './chart/chart.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [
        AppComponent,
        ContenteditableDirective,
        TabsComponent,
        PemasukanComponent,
        PengeluaranComponent,
        StatusComponent,
        ChartComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        FormsModule,
        HttpClientModule,
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        {
            provide: DEFAULT_CURRENCY_CODE,
            useValue: 'IDR',
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
