import { Link } from "react-router";

import { Card } from "~/components/ui/common/card";
import { navData } from "~/components/features/sidebar/nav-data";
import { RootContainer } from "~/components/layouts/root-container";
import { useEffect } from "react";
import { groupsAPI } from "~/api/groups-api";

export default function HomePage() {
  // useEffect(() => {
  //   (async function () {
  //     const { data } = await groupsAPI.getGroupsCategories();
  //     console.log(data);
  //   })();
  // }, []);

  return (
    <RootContainer>
      <div className="p-10 my-5 bg-sidebar">
        {navData.navMain.map((el) => (
          <div key={el.id}>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">{el.title}</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4 mb-10">
              {el.items.map((item) => (
                <Link to={item.url} key={item.id}>
                  <Card className="shadow-none hover:border-primary min-h-[80px] h-full p-2 pl-3 2xl:p-3 2xl:pl-5 cursor-pointer gap-2 2xl:gap-4">
                    <div className="[&>svg]:w-7 2xl:[&>svg]:w-9 [&>svg]:h-7 2xl:[&>svg]:h-9">
                      {el.icon && <el.icon strokeWidth={1.25} />}
                    </div>
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
