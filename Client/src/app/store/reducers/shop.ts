import { createReducer, on } from '@ngrx/store'
import {
  IProduct,
  IProductBrand,
  IProductType,
  IShopFilterByParams,
} from '@/types'
import ACTIONS from '../actions/shop'

export interface IShopState {
  totalProducts: number
  products: IProduct[]
  categories: IProductType[]
  brands: IProductBrand[]
  isLoading: boolean
  filterBy: IShopFilterByParams
}

const initialState: IShopState = {
  products: [],
  categories: [],
  brands: [],
  totalProducts: 0,
  isLoading: false,
  filterBy: {
    brandId: 0,
    typeId: 0,
    sort: 'name',
    pageNumber: 1,
    pageSize: 6,
    search: '',
  },
}

export default createReducer<IShopState>(
  initialState,
  on(ACTIONS.loadShopSuccessResponse, (state, results) => ({
    ...state,
    brands: results.brands,
    categories: results.categories,
  })),

  on(ACTIONS.setFilterBy, (state, { filterBy }) => ({
    ...state,
    filterBy,
    isLoading: true,
  })),

  on(ACTIONS.loadProducts, ACTIONS.loadShop, (state) => ({
    ...state,
    isLoading: true,
  })),

  on(ACTIONS.loadProductsSuccessResponse, (state, results) => ({
    ...state,
    products: results.data,
    totalProducts: results.count,
  })),

  on(
    ACTIONS.loadProductsSuccessResponse,
    ACTIONS.loadProductsErrorResponse,
    ACTIONS.loadShopSuccessResponse,
    ACTIONS.loadShopErrorResponse,
    (state) => ({
      ...state,
      isLoading: false,
    })
  )
)