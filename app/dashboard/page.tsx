
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";


import data from "./data.json";
import Wrapper from "@/components/wrapper";
import { getUser } from "@/lib/auth-session";
import { redirect } from "next/navigation";


export default async function Page() {

  const user = await getUser();


  if(!user){
    return redirect("/auth/sign-in");
  }


  return (
    <Wrapper user={user }>
      <SectionCards user={user } />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </Wrapper>
  );
}
