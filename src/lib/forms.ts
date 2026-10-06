import { FORM_ENDPOINT } from "../config";

/** Envia um formulário para o FormSubmit. Devolve true se foi aceite. */
export async function submitToFormSubmit(data: FormData): Promise<boolean> {
  try {
    const res = await fetch(FORM_ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: data });
    const json = (await res.json()) as { success?: unknown };
    return String(json.success) === "true";
  } catch {
    return false;
  }
}
