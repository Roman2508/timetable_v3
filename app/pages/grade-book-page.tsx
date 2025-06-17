import { Button } from "~/components/ui/common/button";
import { WideContainer } from "~/components/layouts/wide-container";
import { ListFilter, NotebookPen, Printer, UnfoldVertical } from "lucide-react";
import { GradeBookTable } from "~/components/features/pages/grade-book/grade-book-table";

export default function PlansPage() {
  return (
    <WideContainer>
      <div className="flex justify-between mb-6">
        <div className="flex gap-5">
          <div className="pr-5 border-r">
            <p className="text-xs">Дисципліна</p>
            <h3 className="text-sm font-semibold">Інформаційні технології у фармації, 1 семестр</h3>
          </div>

          <div className="pr-5 border-r">
            <p className="text-xs">Група</p>
            <h3 className="text-sm font-semibold">PH9-25-1</h3>
          </div>

          <div>
            <p className="text-xs">Викладач</p>
            <h3 className="text-sm font-semibold">Пташник Р.В.</h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <ListFilter />
          </Button>
          <Button variant="outline">
            <UnfoldVertical className="rotate-[90deg]" />
          </Button>
          <Button variant="outline">
            <NotebookPen />
          </Button>
          <Button variant="outline">
            <Printer />
          </Button>
        </div>
      </div>

      <GradeBookTable />
    </WideContainer>
  );
}
