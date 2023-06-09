import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { combineLatest, of } from 'rxjs'
import { map, mergeMap, catchError, take } from 'rxjs/operators'

import ACTIONS from '../actions/orders'
import { OrdersService } from '@/services'
import { IAppState, selectors } from '@/store'
import { ICreateOrder } from '@/types'

@Injectable()
export class OrdersEffects {
  placeOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACTIONS.placeOrder),
      mergeMap(() =>
        combineLatest({
          user: this.store$.select(selectors.selectLoggedInUser).pipe(take(1)),
          deliveryMethod: this.store$.select(selectors.selectDeliveryMethod).pipe(take(1)),
          basket: this.store$.select(selectors.selectBasket).pipe(take(1)),
        }).pipe(
          map(({ user, basket, deliveryMethod }) => {
            const orderToSend: ICreateOrder = {
              buyerEmail: user!.email,
              address: user!.address!,
              basketId: basket.id!,
              deliveryMethodId: deliveryMethod!.id!,
            }

            return orderToSend
          }),
          mergeMap((orderFields) =>
            this.ordersService.placeOrder(orderFields).pipe(
              map((order) => ACTIONS.placeOrderSuccess({ order })),
              catchError((err) => of(ACTIONS.placeOrderFailed(err)))
            )
          )
        )
      )
    )
  )

  loadUserOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACTIONS.loadUserOrders),
      mergeMap(() =>
        this.ordersService.getUserOrders().pipe(
          map((orders) => ACTIONS.loadUserOrdersSuccess({ orders })),
          catchError((err) => of(ACTIONS.loadUserOrdersFailed(err)))
        )
      )
    )
  )

  loadDeliveryMethods$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACTIONS.loadDeliveryMethods),
      mergeMap(() =>
        this.ordersService.getDeliveryMethods().pipe(
          map((methods) => ACTIONS.loadDeliveryMethodsSuccess({ methods })),
          catchError((err) => of(ACTIONS.loadDeliveryMethodsFalied(err)))
        )
      )
    )
  )

  constructor(
    private actions$: Actions,
    private ordersService: OrdersService,
    private store$: Store<IAppState>
  ) {}
}
