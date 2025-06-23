import ProfileCard from "@/components/ProfileCard";
import { getUser } from "@/lib/auth-session";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {
  const user = await getUser();

  if (!user) {
    return redirect("/auth/sign-in");
  }

  return (<ProfileCard user={user} />);
}
