import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { HomeComponent } from './core/home/home.component'
import { E404Component } from './core/e404/e404.component'
import { RequireAuthGuard } from './core/guards/require-auth.guard'

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'shop',
    loadChildren: () =>
      import('./features/shop/shop.module').then((_) => _.ShopModule),
  },
  {
    path: 'basket',
    loadChildren: () =>
      import('./features/basket/basket.module').then((_) => _.BasketModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then((_) => _.AuthModule),
  },
  {
    path: 'checkout',
    canActivate: [RequireAuthGuard],
    loadChildren: () =>
      import('./features/checkout/checkout.module').then(
        (_) => _.CheckoutModule
      ),
  },
  {
    path: 'orders',
    canActivate: [RequireAuthGuard],
    loadChildren: () =>
      import('./features/orders/orders.module').then((_) => _.OrdersModule),
  },
  {
    path: '**',
    component: E404Component,
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
