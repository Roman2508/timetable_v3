import { Link } from "react-router";

import { Card } from "~/components/ui/common/card";
import { navData } from "~/components/features/sidebar/nav-data";
import { RootContainer } from "~/components/layouts/root-container";

export default function HomePage() {
  return (
    <RootContainer>
      <div className="p-10 my-5 bg-sidebar">
        {navData.navMain.map((el) => (
          <div key={el.id}>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">{el.title}</h1>
            </div>

            <div className="grid grid-cols-4 gap-3 mt-4 mb-10">
              {el.items.map((item) => (
                <Link to={item.url}>
                  <Card className="shadow-none hover:border-primary gap-0 min-h-[80px] h-full p-3 pl-5 cursor-pointer flex flex-row items-center gap-4">
                    <div className="">{el.icon && <el.icon size={24} className="" />}</div>
                    <div className="">
                      <h5 className="flex gap-2 font-bold text-md leading-5 mb-1">{item.title}</h5>
                      <p className="text-sm opacity-[0.6]">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </RootContainer>
  );
}
