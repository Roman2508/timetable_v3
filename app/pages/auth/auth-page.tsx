import { GraduationCap, Package, Pencil, Trash2 } from "lucide-react";

import { Card } from "~/components/ui/common/card";
import { Badge } from "~/components/ui/common/badge";
import { Input } from "~/components/ui/common/input";
import { Button } from "~/components/ui/common/button";
import { RootContainer } from "~/components/layouts/root-container";

const AuthPage = () => {
  return (
    <RootContainer classNames="!max-w-120">
      <Card className="px-10 pb-12 my-10 flex flex-col items-center gap-0">
        <img src="https://api.pharm.zt.ua:9443/uploads/Zh_BFFK_logotip_kolorovij_192d386e74.png" className="w-25" />

        <h1 className="text-lg font-semibold mb-0 text-center mt-4 leading-5 whitespace-nowrap">
          Житомирський базовий фармацевтичний
          <br /> фаховий коледж
        </h1>
        <h2 className="text-md font-semibold mb-5 opacity-[0.5]">Житомирської обласної ради</h2>

        <div className="w-full">
          {[{ title: "Логін*" }, { title: "Пароль*" }].map((input) => (
            <div className="mb-4" key={input.title}>
              <h5 className="font-semibold text-md">{input.title}</h5>

              <Input className="w-full" />
            </div>
          ))}
        </div>

        <div className="mt-4 w-full">
          <Button className="w-full mb-4">Увійти</Button>

          <p className="text-center mb-4">або увійти за допомогою Google</p>

          <Button variant="outline" className="w-full">
            Вхід за допомогою Google
          </Button>
        </div>
      </Card>
    </RootContainer>
  );
};

export default AuthPage;
