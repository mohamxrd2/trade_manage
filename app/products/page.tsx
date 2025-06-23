
import ProductPage from "@/components/ProductPage";
import { getUser } from "@/lib/auth-session";
import { redirect } from "next/navigation";




export default async function Page() {
  

  const user = await getUser();


if(!user){
  return redirect("/auth/sign-in");
}
  

  return (
   <ProductPage user={user } />
  );
}
