"use client";
import { useActionState } from "react";
import { Loader2, LockKeyhole } from "lucide-react";
import { login } from "../actions";
import { buttonClass } from "@/components/ui/Button";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="mt-7 space-y-4">
      <input type="hidden" name="next" value={next ?? "/admin"} />
      <div>
        <label className="label" htmlFor="pw">Password</label>
        <input id="pw" name="password" type="password" required autoFocus className="input" placeholder="••••••••" />
      </div>
      {state?.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}
      <button disabled={pending} className={buttonClass("primary", "lg", "w-full")}>
        {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <LockKeyhole className="h-5 w-5" />} Log in
      </button>
    </form>
  );
}
