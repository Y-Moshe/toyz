import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { ProductDetailsComponent } from './product-details/product-details.component'
import { ShopComponent } from './shop.component'
import { ProductResolver } from './product.resolver'

const routes: Routes = [
  {
    path: '',
    component: ShopComponent,
    pathMatch: 'full',
    title: 'Shop',
  },
  {
    path: ':id',
    component: ProductDetailsComponent,
    data: {
      breadcrumb: {
        alias: 'productName',
      },
    },
    resolve: {
      product: ProductResolver,
    },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopRoutingModule {}
