import React from "react";

import { groupsAPI } from "~/api/groups-api";
import type { Route } from "./+types/groups";
import { useLoaderData } from "react-router";
import GroupsPage from "~/pages/groups-page";
import { useAppDispatch } from "~/store/store";
import { setGroupCategories } from "~/store/groups/groups-slice";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Групи" }, { name: "description", content: "Welcome to React Router!" }];
}

export async function loader({}) {
  // const { data } = await groupsAPI.getGroupsCategories();
  // console.log("groups data:", data);
  // return { data };
}
/* 
// Функція для завантаження даних на сервері - SSR
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // Отримуємо дані для SSR
    const products = await fetchProductsForSSR();
    
    return json({ products });
  } catch (error) {
    console.error('Error loading products:', error);
    return json({ products: [] });
  }
}
*/

export default function Teachers() {
  return <GroupsPage />;
}

/* 
export async function loader({ params }: Route.LoaderArgs) {
  let team = await fetchTeam(params.teamId);
  return { name: team.name };
}

export default function Teachers({
  loaderData,
}: Route.ComponentProps) {
  return <h1>{loaderData.name}</h1>;
} */
