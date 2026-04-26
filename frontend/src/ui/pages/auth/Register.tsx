import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

type Form = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const { register, handleSubmit, watch } = useForm<Form>()
  const nav = useNavigate()
  
  // Extract password value to compare with confirmPassword
  const password = watch('password');

  const onSubmit = async (data: Form) => {
    try {
      // 🔥 Send data to Backend (Port 5000)
      const response = await fetch('https://onlineportfolio-4i6c.onrender.com/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          password: data.password
          // confirmPassword doesn't need to be sent to Backend
        })
      });

      // เช็คว่าสมัครผ่านไหม
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      // ✅ สมัครสำเร็จ
      alert('Registration successful! Please log in');
      nav('/login'); // เด้งไปหน้า Login

    } catch (error: any) {
      console.error('Register failed:', error);
      // ❌ แจ้งเตือนถ้ามีปัญหา (เช่น อีเมลซ้ำ)
      alert('Error: ' + error.message);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      
      <h1 className="text-5xl font-bold mb-8 text-center">
        Create Account
      </h1>
      
      <div className="max-w-md w-full bg-white p-10 rounded-lg shadow-xl border border-gray-200">
        
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          
          {/* Firstname */}
          <div>
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">
              Firstname <span className="text-red-500">*</span>
            </label>
            <input
              id="firstname"
              className="input input-bordered w-full"
              placeholder="Firstname"
              {...register('firstname', { required: true })}
            />
          </div>

          {/* Lastname */}
          <div>
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
              Lastname <span className="text-red-500">*</span>
            </label>
            <input
              id="lastname"
              className="input input-bordered w-full"
              placeholder="Lastname"
              {...register('lastname', { required: true })}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              className="input input-bordered w-full"
              placeholder="Email"
              {...register('email', { required: true })}
            />
          </div>
          
          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              className="input input-bordered w-full"
              placeholder="Password"
              type="password"
              {...register('password', { required: true })}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              className="input input-bordered w-full"
              placeholder="Confirm Password"
              type="password"
              {...register('confirmPassword', {
                required: true,
                validate: (value) => value === password || 'Passwords do not match'
              })}
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 space-y-3">
            <button className="btn btn-neutral w-full" type="submit">
              Register
            </button>
            
            <Link to="/login" className="btn btn-neutral w-full">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}