
import HeroSection from "@/components/hero-section";
import { getUser } from "@/lib/auth-session";
import { redirect } from "next/navigation";




export default async function Home() {

  const user = await getUser();

  if (!user) {
    return redirect("/"); 
  }
 


  return (
    <div>
     <HeroSection user={user}  />
    </div>
  );
}
