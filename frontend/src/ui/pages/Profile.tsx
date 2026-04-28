import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../hooks";
import { updateProfile } from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";

type Form = {
  firstname: string;
  lastname: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

export default function Profile() {
  const u = useAppSelector((s) => s.auth.currentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm<Form>({
    defaultValues: {
      firstname: u?.firstname ?? "",
      lastname: u?.lastname ?? "",
      email: u?.email ?? "",
    },
  });

  const submit = async (d: Form) => {
    if (d.newPassword || d.currentPassword) {
      if (!d.currentPassword) {
        return alert("Please enter your current password.");
      }
      if (d.newPassword !== d.confirmPassword) {
        return alert("New passwords do not match!");
      }
      if (d.newPassword && d.newPassword.length < 6) {
        return alert("Password must be at least 6 characters.");
      }
    }

    try {
      const payload: any = {
        firstname: d.firstname,
        lastname: d.lastname,
        email: d.email,
      };

      if (d.newPassword) {
        payload.password = d.newPassword;
        payload.currentPassword = d.currentPassword;
      }

      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const userId = u?._id || u?.id;

      const res = await fetch(
        `http://localhost:5000/api/users/profile/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (res.ok) {
        alert("Profile and password updated successfully!");

        dispatch(
          updateProfile({
            firstname: d.firstname,
            lastname: d.lastname,
            email: d.email,
          } as any),
        );

        reset({
          ...d,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert("An error occurred while updating profile.");
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-gray-300 transition text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <h1 className="text-3xl font-bold">Profile</h1>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-10">
          <form onSubmit={handleSubmit(submit)} className="space-y-10">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-700">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                <label
                  htmlFor="firstname"
                  className="md:text-right md:pr-6 font-medium text-gray-600"
                >
                  Firstname
                </label>
                <input
                  id="firstname"
                  {...register("firstname")}
                  className="input input-bordered w-full md:col-span-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                <label
                  htmlFor="lastname"
                  className="md:text-right md:pr-6 font-medium text-gray-600"
                >
                  Lastname
                </label>
                <input
                  id="lastname"
                  {...register("lastname")}
                  className="input input-bordered w-full md:col-span-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                <label
                  htmlFor="email"
                  className="md:text-right md:pr-6 font-medium text-gray-600"
                >
                  Email
                </label>
                <input
                  id="email"
                  {...register("email")}
                  className="input input-bordered w-full md:col-span-2"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-700">
                Change Password
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                <label
                  htmlFor="currentPassword"
                  className="md:text-right md:pr-6 font-medium text-gray-600"
                >
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  {...register("currentPassword")}
                  className="input input-bordered w-full md:col-span-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                <label
                  htmlFor="newPassword"
                  className="md:text-right md:pr-6 font-medium text-gray-600"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  {...register("newPassword")}
                  className="input input-bordered w-full md:col-span-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                <label
                  htmlFor="confirmPassword"
                  className="md:text-right md:pr-6 font-medium text-gray-600"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  className="input input-bordered w-full md:col-span-2"
                />
              </div>
            </div>

            <div className="pt-6 flex justify-center">
              <button type="submit" className="btn btn-neutral text-lg px-12">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
