"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLoginMutation } from "@/redux/api/authApi";
import { setError, setUser } from "@/redux/features/auth/authSlice";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
    const [adminLogin, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
    const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await adminLogin(formData).unwrap();
      console.log(response)
      dispatch(setUser(response.data.user));
      Cookies.set('token', response.data.token, { expires: 7 });
      // Redirect to dashboard or home page
      // window.location.href = '/dashboard';
      router.push('/dashboard/admin');
    } catch (error: unknown) {
      console.log(error)
      dispatch(setError('Login failed'));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md bg-primary backdrop-blur-md p-8 shadow-2xl rounded-2xl border border-white/10">
        <h2 className="text-3xl font-bold text-white text-center drop-shadow-md">Welcome Back</h2>
        <p className="text-sm text-white text-center mb-6">Login to continue</p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-white">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 mt-1 bg-white/10 text-white placeholder-gray-300 rounded-lg border border-white/30 focus:ring-2 focus:ring-white focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 mt-1 bg-white/10 text-white placeholder-gray-300 rounded-lg border border-white/30 focus:ring-2 focus:ring-white focus:outline-none"
              placeholder="Enter your password"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-white/90 text-primary hover:bg-secondary transition"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-sm text-gray-200 text-center mt-5">
          Don&apos;t have an account?
          <Link href="/" className="text-white font-medium ml-1 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}