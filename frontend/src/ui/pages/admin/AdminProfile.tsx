import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks";
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

export default function AdminProfile() {
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
    if (!d.firstname.trim() || !d.lastname.trim() || !d.email.trim()) {
      return alert("Firstname, Lastname, and Email cannot be empty.");
    }

    const isProfileChanged =
      d.firstname !== u?.firstname ||
      d.lastname !== u?.lastname ||
      d.email !== u?.email;

    const isChangingPassword =
      d.currentPassword || d.newPassword || d.confirmPassword;

    if (!isProfileChanged && !isChangingPassword) {
      return alert("No changes were made to your profile.");
    }

    if (isChangingPassword) {
      if (!d.currentPassword) {
        return alert("Please enter your current password.");
      }
      if (!d.newPassword) {
        return alert("Please enter a new password.");
      }
      if (d.newPassword.length < 6) {
        return alert("New password must be at least 6 characters.");
      }
      if (d.newPassword !== d.confirmPassword) {
        return alert("New passwords do not match!");
      }
    }

    try {
      const payload: any = {
        firstname: d.firstname,
        lastname: d.lastname,
        email: d.email,
      };

      if (isChangingPassword) {
        payload.password = d.newPassword;
        payload.currentPassword = d.currentPassword;
      }

      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const userId = u?._id || u?.id;

      const res = await fetch(
        `https://onlineportfolio-4i6c.onrender.com/api/users/profile/${userId}`,
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
        if (isChangingPassword) {
          alert("Admin profile and password updated successfully!");
        } else {
          alert("Admin profile updated successfully!");
        }

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
      alert("An error occurred while updating admin profile.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-10">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-circle mr-4"
          aria-label="Go Back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      <div className="max-w-xl mx-auto p-6">
        <form onSubmit={handleSubmit(submit)} className="space-y-8">
          <h2 className="text-xl font-bold mb-4 text-center">
            Personal Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="text-sm font-semibold w-32 text-right mr-4">
                Firstname
              </label>
              <input
                {...register("firstname")}
                className="input input-bordered flex-grow"

              />
            </div>
            <div className="flex items-center">
              <label className="text-sm font-semibold w-32 text-right mr-4">
                Lastname
              </label>
              <input
                {...register("lastname")}
                className="input input-bordered flex-grow"

              />
            </div>
            <div className="flex items-center">
              <label className="text-sm font-semibold w-32 text-right mr-4">
                Email
              </label>
              <input
                {...register("email")}
                className="input input-bordered flex-grow"

              />
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4 text-center pt-8">
            Change Password
          </h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="text-sm w-32 font-semibold text-right mr-4">
                Current Password
              </label>
              <input
                type="password"
                {...register("currentPassword")}
                className="input input-bordered flex-grow"
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm w-32 font-semibold text-right mr-4">
                New Password
              </label>
              <input
                type="password"
                {...register("newPassword")}
                className="input input-bordered flex-grow"
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm w-32 font-semibold text-right mr-4">
                Confirm Password
              </label>
              <input
                type="password"
                {...register("confirmPassword")}
                className="input input-bordered flex-grow"
              />
            </div>
          </div>

          <div className="pt-6 flex justify-center">
            <button
              type="submit"
              className="btn btn-lg bg-black text-white hover:bg-gray-800 border-none w-1/2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
