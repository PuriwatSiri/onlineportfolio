import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'

type Form = { 
  password: string;
  confirmPassword: string;
}

export default function Reset() {
  // 🔥 Added formState: { errors } to pull errors for display
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Form>()
  const [loading, setLoading] = useState(false)
  
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const token = searchParams.get('token')
  const id = searchParams.get('id')

  const password = watch('password')

  const submit = async (d: Form) => {
    if (!token || !id) {
      return alert('Error: Invalid Link (Missing token or ID)')
    }

    setLoading(true)
    try {
      const res = await fetch('https://onlineportfolio-4i6c.onrender.com/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: id,
          token: token,
          newPassword: d.password
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Reset failed')
      }

      alert('Password has been reset successfully! Please login with your new password.')
      navigate('/login')

    } catch (error: any) {
      alert('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!token || !id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-red-600 font-bold">
        Invalid Reset Link (Missing Token)
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="max-w-lg w-full bg-white p-10 rounded-lg shadow-xl border border-gray-200">
        
        <h1 className="text-3xl font-bold mb-6 text-center">
          Reset Password
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit(submit)}>
          
          {/* 4. Field: New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              // 🔥 Added Logic to check errors and change border color
              className={`input input-bordered w-full ${errors.password ? 'input-error border-red-500' : ''}`}
              placeholder="New Password"
              {...register('password', { 
                required: 'Password is required', 
                minLength: { value: 6, message: 'Password must be at least 6 characters' } 
              })}
            />
            {/* 🔥 Display error message in red */}
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* 5. Field: Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              className={`input input-bordered w-full ${errors.confirmPassword ? 'input-error border-red-500' : ''}`}
              placeholder="Confirm New Password"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: (val) => val === password || 'Passwords do not match'
              })}
            />
            {/* 🔥 Display error message in red */}
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* 6. Save button */}
          <div className="pt-4">
            <button 
              className="btn btn-neutral w-full" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Reset Password'}
            </button>
          </div>

          {/* 7. Back button */}
          <div className="text-center mt-4">
             <Link to="/login" className="text-sm text-gray-500 hover:text-gray-800 hover:underline">
               Back to Login
             </Link>
          </div>

        </form>
      </div>
    </div>
  )
}