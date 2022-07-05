import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { skip } from 'rxjs';
import { AuthGuard } from './core/guards/auth.guard';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';
import { TestErrorComponent } from './core/test-error/test-error.component';
import { HomeComponent } from './home/home.component';

const routes: Routes =
[
  // Home Page
  {path: '', component: HomeComponent, data: {breadcrumb : 'Home'}},
  // Not Found Page
  {path: 'not-found', component: NotFoundComponent, data: {breadcrumb : 'Not Found'}},
  //Internal Sever Error Page
  {path: 'server-error', component: ServerErrorComponent, data: {breadcrumb : 'Server Error'}},
  // Error Testing Page
  {path: 'test-error', component: TestErrorComponent, data: {breadcrumb : 'Test Error'}},
  //Shop Page
  {
    path: 'shop',
    loadChildren: () => import('./shop/shop.module')
      .then(mod => mod.ShopModule),
    data: {breadcrumb : 'Shop'}},
  //  Shopping Cart page
  {
    path: 'basket', loadChildren: () => import('./basket/basket.module').then(mod => mod.BasketModule),
    data: {breadcrumb : 'Shopping Cart'}},
  // Check Out Page, only accessable by logged in users
  {
      path: 'checkout', canActivate: [AuthGuard],
   loadChildren: () => import('./checkout/checkout.module').then(mod => mod.CheckoutModule),
    data: {breadcrumb : 'Checkout'}
  },
  // Orders Page
  {
    path: 'orders', canActivate: [AuthGuard],
    loadChildren: () => import('./orders/orders.module')
      .then(mod => mod.OrdersModule),
    data: {breadcrumb: 'Orders'}
  },
  // Register and Login Account Pages
  {
    path: 'account', loadChildren: () => import('./account/account.module').then(mod => mod.AccountModule),
    data: {breadcrumb : {skip: true}}
  },
  // Re-direct all unknown routes to Not Found Page
  {
    path: '**', redirectTo: 'not-found', pathMatch: 'full',
    data: {breadcrumb : 'Not Found'}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
