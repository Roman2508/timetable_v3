import { z } from "zod";
import type { categorySchema } from "./groups-form-schema";

export type GroupCategoryModalStateType = { isOpen: boolean; actionType: "create" | "update" };
export type CategoryFormData = z.infer<typeof categorySchema>;
export type GroupsStatusType = "Активний" | "Архів" | "";
