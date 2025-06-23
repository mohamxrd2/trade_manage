
import HeroSection from "@/components/hero-section";
import { getUser } from "@/lib/auth-session";




export default async function Home() {

  const user = await getUser();

 


  return (
    <div className="">
     <HeroSection user={user}  />
    </div>
  );
}
