import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../hooks";
import { createPaymentAsync } from "@/store/slices/paymentsSlice";
import qrCodeImage from "@/assets/Qr.png";

type Form = {
  firstname: string;
  lastname: string;
  amount: number;
  transferTime: string;
};

export default function Checkout() {
  const loc = useLocation();
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  const packageId = loc.state?.packageId;

  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const packages = useAppSelector((s) => s.packages.items);
  const selectedPackage = packages.find((p) => (p.id || p._id) === packageId);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Form>({
    defaultValues: {
      firstname: currentUser?.firstname || "",
      lastname: currentUser?.lastname || "",
      amount: selectedPackage?.price || 0,
    },
  });

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
      alert("Please upload a bank transfer receipt");
      return;
    }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", selectedFile);
      const response = await fetch(
        "https://onlineportfolio-4i6c.onrender.com/api/upload",
        {
          method: "POST",
          body: formData,
        },
      );
      if (!response.ok) {
        throw new Error("Upload failed");
      }
      const data = await response.json();
      const imageUrl = data.url;
      const created: any = await dispatch(
        createPaymentAsync({
          amount: Number(d.amount),
          transfer_time: d.transferTime,
          package_id: packageId,
          payment_slip: imageUrl,
        }),
      ).unwrap();
      alert("Payment reported successfully!");
      nav("/packages", { state: { payment: created } });
    } catch (error) {
      console.error(error);
      alert("Error sending data: " + error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800">
      <div className="bg-white px-8 py-6 shadow flex items-center gap-4">
        <button
          onClick={() => nav(-1)}
          className="btn btn-ghost btn-circle -ml-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Payment</h1>
      </div>

      <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="flex flex-col items-center justify-center bg-white/5 p-8 rounded-xl border border-white/10">
          {selectedPackage && (
            <div className="w-full max-w-sm mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex justify-between items-center shadow-sm">
              <div>
                <p className="text-[10px] font-semibold text-indigo-900 tracking-wider">
                  Packages
                </p>
                <h2 className="text-lg font-bold text-indigo-900">
                  {selectedPackage.package_name}
                </h2>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold text-indigo-900 tracking-wider">
                  Amount (Baht)
                </p>
                <p className="text-lg font-bold text-indigo-900">
                  {selectedPackage.price} THB
                </p>
              </div>
            </div>
          )}

          <div className="bg-white p-4 rounded-lg shadow-lg">
            <img
              src={qrCodeImage}
              alt="Payment QR Code"
              className="w-80 h-80 object-contain"
            />
          </div>
        </div>

        <div>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Firstname
              </label>
              <input
                className="input input-bordered w-full bg-gray-300 text-gray-600 cursor-not-allowed"
                readOnly
                {...register("firstname")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Lastname
              </label>
              <input
                className="input input-bordered w-full bg-gray-300 text-gray-600 cursor-not-allowed"
                readOnly
                {...register("lastname")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Datetime <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                max={getCurrentDateTime()}
                className="input input-bordered w-full bg-white text-black"
                {...register("transferTime", {
                  required: true,
                  onChange: (e) => {
                    const selectedTime = new Date(e.target.value).getTime();
                    const now = new Date().getTime();
                    if (selectedTime > now) {
                      const currentTimeStr = getCurrentDateTime();
                      e.target.value = currentTimeStr;
                      setValue("transferTime", currentTimeStr);
                      alert("Future time not allowed.");
                    }
                  },
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Amount (Baht)
              </label>
              <input
                className="input input-bordered w-full bg-gray-300 text-gray-600 cursor-not-allowed"
                type="number"
                step="0.01"
                readOnly
                {...register("amount")}
              />
            </div>

            <div>
              <label className="label text-white">
                Transfer Receipt (Slip) <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full text-black bg-white"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full mt-6"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Confirm Payment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
