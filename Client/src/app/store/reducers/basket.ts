import { createReducer, on } from '@ngrx/store'
import { Basket, IBasket, IBasketTotals, IDeliveryMethod } from '@/types'
import ACTIONS from '../actions/basket'

export interface IBasketState extends IBasketTotals {
  basket: IBasket
  isBasketLoading: boolean
  selectedDeliveryMethod: IDeliveryMethod | null
}

const initialState = (): IBasketState => ({
  basket: new Basket(),
  shipping: 0,
  subtotal: 0,
  total: 0,
  isBasketLoading: false,
  selectedDeliveryMethod: null,
})

export default createReducer<IBasketState>(
  initialState(),
  on(ACTIONS.saveItemToBasket, (state, { item, setQuantity }) => {
    // Increase product quantity if already exists in the basket
    const itemIndex = state.basket.items.findIndex((i) => i.id === item.id)
    if (itemIndex !== -1) {
      const newQuantity = setQuantity
        ? item.quantity
        : state.basket.items[itemIndex].quantity + item.quantity

      const newItems = [...state.basket.items]
      newItems.splice(itemIndex, 1, {
        ...item,
        quantity: newQuantity,
      })
      return {
        ...state,
        basket: {
          ...state.basket,
          items: newItems,
        },
      }
    }

    // Add item
    return {
      ...state,
      basket: {
        ...state.basket,
        items: [item, ...state.basket.items],
      },
    }
  }),

  on(ACTIONS.removeItemFromBasket, (state, { itemId }) => ({
    ...state,
    basket: {
      ...state.basket,
      items: state.basket.items.filter((item) => item.id !== itemId),
    },
  })),

  on(ACTIONS.updateBasket, (state) => ({
    ...state,
    isBasketLoading: true,
  })),

  on(ACTIONS.setDeliveryMethod, (state, { method }) => ({
    ...state,
    shipping: method.price,
    selectedDeliveryMethod: method,
    basket: {
      ...state.basket,
      deliveryMethodId: method.id,
    },
  })),

  on(ACTIONS.calculateTotals, (state) => {
    const subtotal = state.basket.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    )

    const total = subtotal + state.shipping
    return {
      ...state,
      subtotal,
      total,
    }
  }),

  on(ACTIONS.updateBasketSuccess, (state, { basket }) => ({
    ...state,
    basket,
  })),
  on(ACTIONS.updateBasketSuccess, ACTIONS.updateBasketError, (state) => ({
    ...state,
    isBasketLoading: false,
  })),

  on(ACTIONS.deleteBasketSuccess, () => ({ ...initialState() }))
)
