import { SignupForm } from "@/components/auth/signup";
import { signupMetadata } from "@/lib/metadata";
export const metadata = signupMetadata;
export default function SignupPage() {
  return <SignupForm />;
}
