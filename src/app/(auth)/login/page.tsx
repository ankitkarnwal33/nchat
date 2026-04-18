import Login from "@/src/features/components/auth/login";
import { requireUnAuth } from "@/src/lib/auth-utils";

export default async function Page() {
  await requireUnAuth();
  return (
    <div>
      <Login />
    </div>
  );
}
