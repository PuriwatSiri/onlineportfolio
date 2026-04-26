import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom' // Must have this for Back button

type Form = { email: string }

export default function Forgot() {
  const { register, handleSubmit } = useForm<Form>()
  const [loading, setLoading] = useState(false) // เพิ่ม state เพื่อดูสถานะการส่ง

  const submit = async (d: Form) => {
    setLoading(true)
    try {
      // 🔥 ยิง API ไปที่ Backend (Port 5000)
      const res = await fetch('http://localhost:5000/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: d.email })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      // ✅ สำเร็จ: แจ้งลิงก์ให้ user รู้ (ใน Dev Mode เราโชว์ลิงก์เลยจะได้ไม่ต้องเปิดเมลจริง)
      alert(`Success! \nReset link sent to: ${d.email}\n\n(Dev Link): ${data.link}`)

    } catch (error: any) {
      // ❌ ผิดพลาด: แจ้งเตือน
      alert('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    // 1. Layout หลัก
    <div className="flex items-center justify-center min-h-screen bg-white">
      
      {/* 2. การ์ดสีขาว */}
      <div className="max-w-lg w-full bg-white p-10 rounded-lg shadow-xl border border-gray-200">
        
        {/* 3. Title */}
        <h1 className="text-3xl font-bold mb-4 text-center">
          Forgot Password
        </h1>
        
        {/* 4. ข้อความอธิบาย */}
        <p className="text-center text-gray-600 mb-6">
          Please enter the email you used to register and wait to receive
          an email for setting a new password from us.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit(submit)}>
          
          {/* 5. Field: Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input input-bordered w-full"
              placeholder="Email"
              {...register('email', { required: true })}
            />
          </div>

          {/* 6. ปุ่ม Submit (เพิ่ม Loading State) */}
          <div className="pt-2">
            <button 
              className="btn btn-neutral w-full" 
              type="submit"
              disabled={loading} // ปิดปุ่มขณะส่งข้อมูล
            >
              {loading ? 'Sending...' : 'Submit'}
            </button>
          </div>

          {/* 7. ปุ่ม Back to Login (เพิ่มใหม่) */}
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