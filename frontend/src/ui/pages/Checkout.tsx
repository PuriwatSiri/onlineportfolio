import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAppDispatch } from '../hooks'
import { createPaymentAsync } from '@/store/slices/paymentsSlice'
import qrCodeImage from '@/assets/Qr.png';

type Form = { firstname: string; lastname: string; amount: number; transferTime: string }

export default function Checkout() {
  const loc = useLocation()
  const nav = useNavigate()
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Form>()
  const dispatch = useAppDispatch()
  
  const packageId = loc.state?.packageId;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]); 
    }
  };

  const onSubmit = async (d: Form) => {
    if (!selectedFile) {
      alert('Please upload a bank transfer receipt');
      return;
    }

    try {
      setUploading(true); 
      const formData = new FormData();
      formData.append('image', selectedFile);

  
      const response = await fetch('https://onlineportfolio-4i6c.onrender.com/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // 3. Receive image URL back from Backend
      const data = await response.json();
      const imageUrl = data.url;

      

 
      const created: any = await dispatch(createPaymentAsync({
        amount: Number(d.amount),
        transfer_time: d.transferTime,
        package_id: packageId,
        payment_slip: imageUrl 
      })).unwrap();

      alert('Payment reported successfully!');
      nav('/packages', { state: { payment: created } }); 

    } catch (error) {
      console.error(error);
      alert('Error sending data: ' + error);
    } finally {
      setUploading(false); // End loading
    }
  };



  return (
    <div className="min-h-screen bg-gray-800">
      
      <div className="bg-white px-8 py-6 shadow flex items-center gap-4">
        <button onClick={() => nav(-1)} className="btn btn-ghost btn-circle -ml-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Payment</h1>
      </div>

      <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-16">
        
        {/* Section displaying QR Code */}
        <div className="flex flex-col items-center justify-center bg-white/5 p-8 rounded-xl border border-white/10">
          <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
            <img 
              src={qrCodeImage} 
              alt="Payment QR Code" 
              className="w-96 h-96 object-contain" 
            />
          </div>
        </div>

        <div>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Input personal information */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">Firstname <span className="text-red-500">*</span></label>
              <input className="input input-bordered w-full bg-white text-black" {...register('firstname', { required: true })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Lastname <span className="text-red-500">*</span></label>
              <input className="input input-bordered w-full bg-white text-black" {...register('lastname', { required: true })} />
            </div>

            {/* Datetime */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">Datetime <span className="text-red-500">*</span></label>
              <input type="datetime-local" max={getCurrentDateTime()} className="input input-bordered w-full bg-white text-black" {...register('transferTime', { 
                  required: true,
                  onChange: (e) => {
                    const selectedTime = new Date(e.target.value).getTime();
                    const now = new Date().getTime();

                    if (selectedTime > now) {
                      const currentTimeStr = getCurrentDateTime();
                      e.target.value = currentTimeStr;
                      setValue('transferTime', currentTimeStr);
                      alert("Future time not allowed.");
                    }
                  }
                })} 
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">Amount (Baht) <span className="text-red-500">*</span></label>
              <input className="input input-bordered w-full bg-white text-black"type="number" step="0.01" {...register('amount', { required: true })} />
            </div>

            {/* UPLOAD PHOTO */}
            <div>
                <label className="label text-white">Transfer Receipt (Slip)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="file-input file-input-bordered w-full text-black"
                  onChange={handleFileChange} 
                  disabled={uploading} 
                />
            </div>

            {/* Submit button */}
            <button 
                type="submit" 
                className="btn btn-primary w-full mt-6"
                disabled={uploading}
            >
                {uploading ? 'Uploading...' : 'Confirm Payment'}
            </button>
            
          </form>
        </div>
      </div>
    </div>
  )
}