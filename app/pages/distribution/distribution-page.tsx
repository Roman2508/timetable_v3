import { FolderSearch2, GraduationCap, Package, Pencil, Search, TextSearch, Trash, Trash2 } from "lucide-react";

import { Card } from "~/components/ui/common/card";
import { Badge } from "~/components/ui/common/badge";
import { Button } from "~/components/ui/common/button";
import { RootContainer } from "~/components/layouts/root-container";
import { DistributionLessonsTable } from "~/components/features/pages/distribution/distribution-lessons-table";

const DistributionPage = () => {
  return (
    <RootContainer>
      <div className="flex justify-between items-center mb-6">
        <div className="">
          {true ? (
            <div className="flex flex-col h-[56px]">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 text-black/40" />
                <div className="text-black/40 text-sm">ГРУПА</div>
              </div>

              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold">PH9-25-1</h2>
                <Badge variant="outline" className="text-primary bg-primary-light border-0">
                  Активна
                </Badge>
              </div>
            </div>
          ) : (
            <div className="flex items-center h-[56px]">
              <h2 className="text-lg font-semibold">Виберіть групу для розподілу навантаження</h2>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button>
            <Search />
            Вибрати групу
          </Button>
        </div>
      </div>

      <div className="flex w-full gap-3">
        <Card className="p-3 flex-1">
          <DistributionLessonsTable />
        </Card>

        <Card className="px-10 pb-12 flex-1">
          <h3 className="text-xl font-semibold mb-5">Види навантаження</h3>
        </Card>

        <Card className="px-10 pb-12 flex-1">
          <h3 className="text-xl font-semibold mb-5">Викладачі</h3>
        </Card>
      </div>
    </RootContainer>
  );
};

export default DistributionPage;
