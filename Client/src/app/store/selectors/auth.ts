import { createFeatureSelector, createSelector } from '@ngrx/store'
import { IAuthState } from '../reducers/auth'

const selectAuthState = createFeatureSelector<IAuthState>('authState')

const selectLoggedInUser = createSelector(
  selectAuthState,
  (state) => state.loggedInUser
)

const selectUserAddress = createSelector(
  selectLoggedInUser,
  (state) => state?.address
)

const selectIsSubmitting = createSelector(
  selectAuthState,
  (state) => state.isSubmitting
)

const selectIsLoggingOut = createSelector(
  selectAuthState,
  (state) => state.isLoggingOut
)

export default {
  selectLoggedInUser,
  selectUserAddress,
  selectIsSubmitting,
  selectIsLoggingOut,
}
