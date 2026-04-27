import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

type Form = { email: string };

export default function Forgot() {
  const { register, handleSubmit } = useForm<Form>();
  const [loading, setLoading] = useState(false);

  const submit = async (d: Form) => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://onlineportfolio-4i6c.onrender.com/api/users/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: d.email }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert(
        `Success! \nA password reset link has been sent to: ${d.email} \nPlease check your email.`,
      );
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="max-w-lg w-full bg-white p-10 rounded-lg shadow-xl border border-gray-200">
        <h1 className="text-3xl font-bold mb-4 text-center">Forgot Password</h1>

        <p className="text-center text-gray-600 mb-6">
          Please enter the email you used to register and wait to receive an
          email for setting a new password from us.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit(submit)}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input input-bordered w-full"
              placeholder="Email"
              {...register("email", { required: true })}
            />
          </div>

          <div className="pt-2">
            <button
              className="btn btn-neutral w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? "Sending..." : "Submit"}
            </button>
          </div>

          <div className="text-center mt-4">
            <Link
              to="/login"
              className="text-sm text-gray-500 hover:text-gray-800 hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
