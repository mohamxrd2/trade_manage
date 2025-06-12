
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";


import data from "./data.json";
import Wrapper from "@/components/wrapper";

export default function Page() {
  return (
    <Wrapper>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </Wrapper>
  );
}
