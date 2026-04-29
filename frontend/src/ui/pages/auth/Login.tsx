import { useForm } from "react-hook-form";
import { useAppDispatch } from "../../hooks";
import { login } from "@/store/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";

type Form = { email: string; password: string };

export default function Login() {
  const { register, handleSubmit } = useForm<Form>();
  const nav = useNavigate();
  const dispatch = useAppDispatch();

  const onSubmit = async (data: Form) => {
    try {
      const response = await fetch(
        "https://onlineportfolio-4i6c.onrender.com/api/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      const { user, token } = result;
      console.log("Check this data:", result);

      if (token) localStorage.setItem("token", token);

      if (user) localStorage.setItem("user", JSON.stringify(user));

      dispatch(login(user));

      alert("Login successful!");

      if (user?.role === "admin") nav("/admin");
      else nav("/");
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-5xl font-bold mb-8 text-center">Login</h1>

      <div className="max-w-md w-full bg-white p-10 rounded-lg shadow-xl border border-gray-200">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
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
              {...register("email", { required: true })}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input input-bordered w-full"
              {...register("password", { required: true })}
            />
          </div>

          <div className="pt-2 space-y-3">
            <button className="btn btn-neutral w-full" type="submit">
              Login
            </button>
            <Link to="/register" className="btn btn-neutral w-full">
              Register
            </Link>
          </div>
        </form>

        <div className="mt-5 text-right">
          <Link
            to="/forgot"
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Forgot Your Password
          </Link>
        </div>
      </div>
    </div>
  );
}
