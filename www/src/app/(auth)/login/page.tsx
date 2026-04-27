import { LoginForm } from "@/components/auth/login";
import { authRedirect } from "@/components/shared/auth-redirect";
import { Suspense } from "react";
import { loginMetadata } from "@/lib/metadata";
export const metadata = loginMetadata;
export default async function LoginPage() {
  await authRedirect();
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
