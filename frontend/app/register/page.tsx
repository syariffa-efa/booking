"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { handleRegister } from "@/lib/service/register.handler";
import { useLang } from "@/context/language";
import { useText } from "@/lib/useText";

type RegisterForm = {
  nama: string;
  email: string;
  password: string;
  confirm: string;
  phone: string;
  code: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<RegisterForm>();

  const { lang, setLang } = useLang();
  const t = useText("register");

  const mutation = useMutation({
    mutationFn: handleRegister,
    onSuccess: () => {
      alert("Register berhasil");
      router.push("/login");
    },
    onError: (err: any) => {
      alert(err.message || "Register gagal");
    },
  });

  const onSubmit = (data: RegisterForm) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
      <div className="w-[1000px] h-[600px] bg-white rounded-3xl flex shadow-2xl overflow-hidden">

        {/* LEFT */}
        <div className="w-1/2 bg-gradient-to-br from-blue-200 via-white to-blue-100 p-16 flex flex-col justify-center">
          <Image src="/nuha.png" alt="logo" width={120} height={120} />

          <h1 className="text-5xl font-serif mt-10 text-black leading-tight">
            {t.title}
          </h1>

          <p
            onClick={() => router.push("/login")}
            className="mt-6 text-blue-600 underline cursor-pointer"
          >
            {t.login}
          </p>
        </div>

        {/* RIGHT */}
        <div className="w-1/2 bg-gradient-to-br from-blue-100 to-white p-16 flex flex-col justify-center">

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

          <h2 className="text-2xl font-semibold text-center mb-6">
            {t.welcome}
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 flex flex-col items-center"
          >
            <input
              {...register("nama")}
              placeholder={t.name}
              className="w-96 p-4 bg-gray-100 rounded-xl outline-none"
            />

            <input
              {...register("email")}
              placeholder={t.email}
              className="w-96 p-4 bg-gray-100 rounded-xl outline-none"
            />

            <input
              type="password"
              {...register("password")}
              placeholder={t.password}
              className="w-96 p-4 bg-gray-100 rounded-xl outline-none"
            />

            <input
              type="password"
              {...register("confirm")}
              placeholder={t.confirm}
              className="w-96 p-4 bg-gray-100 rounded-xl outline-none"
            />

            {/* PHONE */}
            <div className="flex gap-2 w-96">
              <select
                {...register("code")}
                className="p-4 bg-gray-100 rounded-xl"
              >
                <option value="+62">🇮🇩 +62</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+81">🇯🇵 +81</option>
              </select>

              <input
                {...register("phone")}
                placeholder={t.phone}
                className="flex-1 p-4 bg-gray-100 rounded-xl outline-none"
              />
            </div>

            <button
              disabled={mutation.isPending}
              className="w-96 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl shadow-lg hover:opacity-90 transition"
            >
              {mutation.isPending ? "Loading..." : t.register}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}