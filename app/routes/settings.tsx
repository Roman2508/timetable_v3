import { useLoaderData } from "react-router";

import type { Route } from "./+types/settings";
import SettingsPage from "~/pages/settings-page";
import { rolesAPI } from "~/api/roles-api";
import { useAppDispatch } from "~/store/store";
import { useRef } from "react";
import { setRoles } from "~/store/roles/roles-slice";
import { authAPI } from "~/api/auth-api";
import { setUsers } from "~/store/auth/auth-slice";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Налаштування" }, { name: "description", content: "Welcome to React Router!" }];
}

export async function loader() {
  const { data: roles } = await rolesAPI.getAll();
  const { data: users } = await authAPI.getUsers({});
  return { roles, users };
}

export default function Settings() {
  const dispatch = useAppDispatch();
  const loaderData = useLoaderData<typeof loader>();

  const initialized = useRef(false);

  if (!initialized.current) {
    dispatch(setRoles(loaderData.roles));
    dispatch(setUsers(loaderData.users[0]));
    initialized.current = true;
  }

  return <SettingsPage />;
}
