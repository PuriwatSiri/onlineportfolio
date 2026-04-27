import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../hooks";
import { updateProfile } from "@/store/slices/authSlice";

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

  const { register, handleSubmit } = useForm<Form>({
    defaultValues: {
      firstname: u?.firstname ?? "",
      lastname: u?.lastname ?? "",
      email: u?.email ?? "",
    },
  });

  const submit = (d: Form) => {
    dispatch(
      updateProfile({
        firstname: d.firstname,
        lastname: d.lastname,
        email: d.email,
      }),
    );

    if (d.newPassword && d.newPassword === d.confirmPassword) {
      console.log("Password change requested");
    }

    alert("Changes saved successfully");
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-gray-800">Profile</h1>

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
                  placeholder="Firstname"
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
                  placeholder="Lastname"
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
                  placeholder="Email"
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
                  placeholder="Current Password"
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
                  placeholder="New Password"
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
                  placeholder="Confirm New Password"
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
