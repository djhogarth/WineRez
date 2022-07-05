import { UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOrder } from 'src/app/shared/models/order';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  order: IOrder;

  constructor(private ordersService: OrdersService,
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute)
    {
      this.breadcrumbService.set('@OrderDetails', ' ');
    }

  ngOnInit()
  {
    this.getOrderDetails();
  }

  getOrderDetails()
  {
    this.ordersService.getOrderDetails(+this.route.snapshot.paramMap.get('id'))
    .subscribe((returnedOrder: IOrder) =>
    {
      this.order = returnedOrder;
      console.log("" + returnedOrder.orderItems[0].price)
      this.breadcrumbService.set('@OrderDetails', `Order #${this.order.id} - Status: ${this.order.status}`);
    }, error =>
    {
      console.log(error);
    });
  }

}
