import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './services/toast.service';
import { GeoInfoService } from './services/geo-info.service';
@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [ToastService, GeoInfoService]
})
export class SharedModule { }
