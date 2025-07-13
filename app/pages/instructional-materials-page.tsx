import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";

import { Input } from "~/components/ui/common/input";
import { RootContainer } from "~/components/layouts/root-container";
import DropdownSelect from "~/components/ui/custom/dropdown-select";

export default function InstructionalMaterialsPage() {
  return (
    <RootContainer>
      <h1 className="text-center font-semibold text-lg mb-4">Навчально-методичні комплекси</h1>

      <div className="flex justify-center items-center gap-4 mb-4">
        <p>НМК за</p>
        <Input className="w-18 px-2" type="number" value={2025} />
        <p>- 2026 н.р.</p>
      </div>

      <DropdownSelect
        label="Семестр"
        selectedItem={null}
        classNames="w-full mb-6"
        items={[{ id: 1, name: "all" }]}
        onChange={(selected) => console.log("Selected item:", selected)}
      />

      <DropdownSelect
        label="Дисципліна"
        selectedItem={null}
        classNames="w-full mb-6"
        items={[{ id: 1, name: "all" }]}
        onChange={(selected) => console.log("Selected item:", selected)}
      />
    </RootContainer>
  );
}
