import { redirect } from "next/navigation";

export default function AdminProfessionalsRedirect() {
  redirect("/admin?tab=professionals");
}
