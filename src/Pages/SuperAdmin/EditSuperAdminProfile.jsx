// // src/Pages/SuperAdmin/EditSuperAdminProfile.jsx
// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   useEditSuperAdminProfileMutation,
//   useChangeSuperAdminProfileImageMutation,
// } from "../../redux/services/adminApi";
// import { setCredentials } from "../../redux/slice/authSlice";

// export default function EditSuperAdminProfile() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const authUser = useSelector((s) => s.auth.user) || {};
//   // in some places user object lives at state.auth.user - using that

//   const [editProfile, { isLoading: saving }] = useEditSuperAdminProfileMutation();
//   const [changeImage, { isLoading: uploading }] = useChangeSuperAdminProfileImageMutation();

//   // Prefill state from auth user (safe defaults)
//   const [form, setForm] = useState({
//     name: authUser?.name || "",
//     phoneNo: authUser?.phoneNo || "",
//     address: authUser?.address || "",
//     dob: authUser?.dob ? (new Date(authUser.dob)).toISOString().slice(0, 10) : "",
//     gender: authUser?.gender || "",
//   });

//   const [file, setFile] = useState(null);
//   const [status, setStatus] = useState(null); // { type: 'success'|'error', msg: '' }

//   useEffect(() => {
//     // Keep form in sync if authUser changes (e.g. after refresh)
//     setForm({
//       name: authUser?.name || "",
//       phoneNo: authUser?.phoneNo || "",
//       address: authUser?.address || "",
//       dob: authUser?.dob ? (new Date(authUser.dob)).toISOString().slice(0, 10) : "",
//       gender: authUser?.gender || "",
//     });
//   }, [authUser?.name, authUser?.phoneNo, authUser?.address, authUser?.dob, authUser?.gender]);

//   const handleChange = (key) => (e) => {
//     setForm((p) => ({ ...p, [key]: e.target.value }));
//   };

//   const handleFile = (e) => {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     setFile(f);
//   };

//   const buildFormData = (onlyImage = false) => {
//     const fd = new FormData();
//     if (!onlyImage) {
//       // append all editable fields
//       if (form.name) fd.append("name", form.name);
//       if (form.phoneNo) fd.append("phoneNo", form.phoneNo);
//       if (form.address) fd.append("address", form.address);
//       if (form.dob) fd.append("dob", form.dob);
//       if (form.gender) fd.append("gender", form.gender);
//     }
//     if (file) fd.append("profilePic", file);
//     return fd;
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setStatus(null);
//     try {
//       const fd = buildFormData(false);
//       const res = await editProfile(fd).unwrap();
//       // res expected shape: { success: true, message: "...", data: { ...updatedUser } }
//       const updated = res?.data || res;
//       if (updated) {
//         // update redux + localStorage (preserve token if present)
//         // current auth slice likely stores token separate; we only set user
//         dispatch(setCredentials({ user: updated }));
//         const rawAuth = localStorage.getItem("auth");
//         if (rawAuth) {
//           try {
//             const parsed = JSON.parse(rawAuth);
//             parsed.user = updated;
//             localStorage.setItem("auth", JSON.stringify(parsed));
//           } catch {
//             // fallback: replace only user
//             localStorage.setItem("auth", JSON.stringify({ user: updated }));
//           }
//         } else {
//           localStorage.setItem("auth", JSON.stringify({ user: updated }));
//         }
//       }

//       setStatus({ type: "success", msg: res?.message || "Profile updated" });
//       // navigate back after short delay
//       setTimeout(() => navigate("/superadmin/dashboard"), 1100);
//     } catch (err) {
//       const msg = err?.data?.message || err?.error || "Update failed";
//       setStatus({ type: "error", msg });
//     }
//   };

//   const onChangeImageOnly = async () => {
//     if (!file) {
//       setStatus({ type: "error", msg: "Please choose an image first." });
//       return;
//     }
//     setStatus(null);
//     try {
//       const fd = buildFormData(true);
//       const res = await changeImage(fd).unwrap();
//       const updated = res?.data || res;
//       if (updated) {
//         dispatch(setCredentials({ user: updated }));
//         const rawAuth = localStorage.getItem("auth");
//         if (rawAuth) {
//           try {
//             const parsed = JSON.parse(rawAuth);
//             parsed.user = updated;
//             localStorage.setItem("auth", JSON.stringify(parsed));
//           } catch {
//             localStorage.setItem("auth", JSON.stringify({ user: updated }));
//           }
//         } else {
//           localStorage.setItem("auth", JSON.stringify({ user: updated }));
//         }
//       }
//       setStatus({ type: "success", msg: res?.message || "Image updated" });
//       setTimeout(() => navigate("/superadmin/dashboard"), 900);
//     } catch (err) {
//       const msg = err?.data?.message || err?.error || "Image upload failed";
//       setStatus({ type: "error", msg });
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
//       <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Edit Profile</h2>

//       <form onSubmit={onSubmit} className="space-y-4">
//         <label className="block">
//           <span className="text-sm text-gray-600 dark:text-gray-300">Full name</span>
//           <input
//             type="text"
//             value={form.name}
//             onChange={handleChange("name")}
//             className="mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
//             placeholder="Full name"
//           />
//         </label>

//         <label className="block">
//           <span className="text-sm text-gray-600 dark:text-gray-300">Phone</span>
//           <input
//             type="tel"
//             value={form.phoneNo}
//             onChange={handleChange("phoneNo")}
//             className="mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
//             placeholder="+91 1234 567890"
//           />
//         </label>

//         <label className="block">
//           <span className="text-sm text-gray-600 dark:text-gray-300">Address</span>
//           <input
//             type="text"
//             value={form.address}
//             onChange={handleChange("address")}
//             className="mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
//             placeholder="City, Country"
//           />
//         </label>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <label className="block">
//             <span className="text-sm text-gray-600 dark:text-gray-300">Date of birth</span>
//             <input
//               type="date"
//               value={form.dob}
//               onChange={handleChange("dob")}
//               className="mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
//             />
//           </label>

//           <label className="block">
//             <span className="text-sm text-gray-600 dark:text-gray-300">Gender</span>
//             <select
//               value={form.gender}
//               onChange={handleChange("gender")}
//               className="mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
//             >
//               <option value="">Select</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="other">Other</option>
//             </select>
//           </label>
//         </div>

//         <label className="block">
//           <span className="text-sm text-gray-600 dark:text-gray-300">Profile picture (optional)</span>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFile}
//             className="mt-1 block w-full"
//           />
//         </label>

//         <div className="flex gap-3">
//           <button
//             type="submit"
//             disabled={saving}
//             className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
//           >
//             {saving ? "Saving..." : "Save changes"}
//           </button>

//           <button
//             type="button"
//             onClick={onChangeImageOnly}
//             disabled={uploading}
//             className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 disabled:opacity-60"
//           >
//             {uploading ? "Uploading..." : "Change only image"}
//           </button>

//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="px-4 py-2 rounded border"
//           >
//             Cancel
//           </button>
//         </div>

//         {status && (
//           <p className={`mt-3 ${status.type === "error" ? "text-red-600" : "text-green-600"}`}>
//             {status.msg}
//           </p>
//         )}
//       </form>
//     </div>
//   );
// }
