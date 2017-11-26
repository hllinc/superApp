import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderDetailPage } from './order-detail';
// 组件
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    OrderDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderDetailPage),
      ComponentsModule
  ],
})
export class OrderDetailModule {

}
