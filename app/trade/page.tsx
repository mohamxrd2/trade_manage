import TradePage from "@/components/TradePage";
import { getUser } from "@/lib/auth-session";
import { redirect,  } from "next/navigation";


export default async function Page() {

  const user = await getUser();

  if(!user){
    return redirect("/auth/sign-in");
  }
 
  return (
    <TradePage user={user} />
  );
}
