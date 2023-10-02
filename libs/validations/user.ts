import * as z from "zod";

export const userValidation = z.object({
  name: z.string().min(3).max(30),
  email: z.string().email(),
  image: z.string().url().nonempty(),
});
