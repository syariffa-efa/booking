import { TEXTS } from "./texts";
import { useLang } from "@/context/language";

type Lang = "id" | "en" | "jp";

type RegisterText = typeof TEXTS.id.register;
type LoginText = typeof TEXTS.id.login;

export function useText(page: "register"): RegisterText;
export function useText(page: "login"): LoginText;
export function useText(page: "register" | "login") {
  const { lang } = useLang();

  return TEXTS[lang][page];
}