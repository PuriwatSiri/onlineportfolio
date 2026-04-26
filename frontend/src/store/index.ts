import { configureStore } from '@reduxjs/toolkit'
import auth from './slices/authSlice'
import templates from './slices/templatesSlice'
import portfolios from './slices/portfoliosSlice'
import issues from './slices/issuesSlice'
import packages from './slices/packagesSlice'
import payments from './slices/paymentsSlice'
import users from './slices/usersSlice'

export const store = configureStore({
  reducer: { auth, templates, portfolios, issues, packages, payments, users }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
