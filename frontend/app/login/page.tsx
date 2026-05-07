"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useText } from "@/lib/useText";
import { useLang } from "@/context/language";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<LoginForm>();

  const t = useText("login");
  const { lang, setLang } = useLang();

  const mutation = useMutation({
    mutationFn: (data: LoginForm) =>
      api.post("/auth/login", data, {
        withCredentials: true, 
      }),

    onSuccess: (res) => {
      const { user } = res.data.data;


      if (user.role === "admin") router.push("/admin");
      else if (user.role === "dokter") router.push("/dokter");
      else router.push("/dashboard");
    },

    onError: (err: any) => {
      alert(err.response?.data?.message || "Login gagal");
    },
  });

  const onSubmit = (data: LoginForm) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 p-4">

      <div className="w-full max-w-5xl min-h-[600px] bg-white rounded-3xl flex flex-col md:flex-row shadow-2xl overflow-hidden">

        {/* LEFT */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-200 via-white to-blue-100 p-10 md:p-16 flex flex-col justify-center">

          <Image src="/nuha.png" alt="logo" width={100} height={100} />

          <h1 className="text-3xl md:text-5xl font-serif mt-8 text-black leading-tight">
            {t.title}
          </h1>

          <p className="mt-6 text-gray-700">
            {t.noAccount}{" "}
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="text-blue-600 underline cursor-pointer hover:text-blue-800"
            >
              {t.register}
            </button>
          </p>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-100 to-white p-10 md:p-16 flex flex-col justify-center">

          {/* LANGUAGE */}
          <div className="flex justify-end mb-6">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as any)}
              className="bg-white border px-3 py-1 rounded-lg text-sm shadow"
            >
              <option value="id">🇮🇩 Indonesia</option>
              <option value="en">🇺🇸 English</option>
              <option value="jp">🇯🇵 日本語</option>
            </select>
          </div>

          <h2 className="text-xl md:text-2xl font-semibold text-center mb-6">
            {t.welcome}
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 flex flex-col items-center"
          >

            <input
              {...register("email")}
              placeholder={t.email}
              className="w-full max-w-sm p-3 bg-gray-100 rounded-xl outline-none"
            />

            <input
              type="password"
              {...register("password")}
              placeholder={t.password}
              className="w-full max-w-sm p-3 bg-gray-100 rounded-xl outline-none"
            />

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full max-w-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl shadow-lg hover:opacity-90 transition"
            >
              {mutation.isPending ? "Loading..." : t.login}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}