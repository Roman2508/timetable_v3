import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(4, "Довжина поля має бути більше 3 символів").max(50, "Максимальна довжина поля - 50 символів"),
  shortName: z
    .string()
    .min(1, "Довжина поля має бути більше 1 символа")
    .max(50, "Максимальна довжина поля - 15 символів"),
});

