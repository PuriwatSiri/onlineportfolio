import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { User } from './authSlice'

interface State { items: User[] }
const initial: State = { items: [] }

const slice = createSlice({
  name: 'users',
  initialState: initial,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => { state.items.push(action.payload) },
    updateUser: (state, action: PayloadAction<User>) => {
      const i = state.items.findIndex(u => u.id === action.payload.id)
      if (i >= 0) state.items[i] = action.payload
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(u => u.id !== action.payload)
    }
  }
})

export const { addUser, updateUser, removeUser } = slice.actions
export default slice.reducer
