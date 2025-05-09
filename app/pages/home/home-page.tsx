import { Link } from "react-router";

import { Card } from "~/components/ui/common/card";
import { navData } from "~/components/features/sidebar/app-sidebar";
import { RootContainer } from "~/components/layouts/root-container";

export default function HomePage() {
  return (
    <RootContainer>
      {navData.navMain.map((el) => (
        <div>
          <div className="flex items-center gap-2">
            {el.icon && <el.icon size={24} />}
            <h1 className="text-xl">{el.title}</h1>
          </div>

          <div className="grid grid-cols-6 gap-3 mt-4 mb-10">
            {el.items.map((item) => (
              <Link to={item.url}>
                <Card className="shadow-none hover:border-primary gap-0 min-h-[80px] py-3 cursor-pointer">
                  <div className="flex gap-2 font-medium text-md px-3 leading-5">{item.title}</div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </RootContainer>
  );
}
