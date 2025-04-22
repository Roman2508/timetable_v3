import { GraduationCap, Package, Pencil, Trash, Trash2 } from "lucide-react";

import { Card } from "~/components/ui/common/card";
import { Badge } from "~/components/ui/common/badge";
import { Button } from "~/components/ui/common/button";
import { RootContainer } from "~/components/layouts/root-container";

const DistributionPage = () => {
  return (
    <RootContainer>
      <div className="flex justify-between items-center mb-6">
        <div className="">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 text-black/40" />
            <div className="text-black/40 text-sm">ГРУПА</div>
          </div>

          <div className="flex gap-3 items-center">
            <h2 className="text-2xl font-semibold">PH9-25-1</h2>
            <Badge variant="outline" className="text-primary bg-primary-light border-0">
              Активна
            </Badge>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline">
            <Package />
            Архівувати
          </Button>

          <Button>
            <Pencil />
            Зберегти зміни
          </Button>
        </div>
      </div>

      <div className="flex w-full gap-3">
        <Card className="px-10 pb-12 flex-1">
          <h3 className="text-xl font-semibold mb-5">Навантаження групи</h3>
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
