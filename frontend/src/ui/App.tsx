import { Outlet } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from './hooks'
import { useEffect } from 'react'
import { getCurrentUser } from '@/store/slices/authSlice'

export default function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(getCurrentUser())
    }
  }, [dispatch])

  return <Outlet /> 
}