import React from "react";
import { FullPlanTable } from "~/components/features/pages/full-plan/full-plan-table";
import { RootContainer } from "~/components/layouts/root-container";

const FullPlanPage = () => {
  return (
    <RootContainer>
      <div>Search and Filters</div>

      <FullPlanTable />
    </RootContainer>
  );
};

export default FullPlanPage;
