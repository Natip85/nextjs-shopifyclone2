import { z } from "zod";

const allowedWeightMeasurements = ["lb", "oz", "kg", "g"];

export const createProductSchema = z.object({
  title: z
    .string({ required_error: "'title' is required" })
    .nonempty("'title' cannot be empty")
    .min(3, { message: "Product title must be at least 3 characters" })
    .max(1000, { message: "'title' is too long" }),
  description: z
    .string({ required_error: "'description' is required" })
    .nonempty("'description' cannot be empty")
    .min(3, { message: "Product description must be at least 3 characters" })
    .max(1000, { message: "'description' is too long" }),
  price: z.string().transform((v) => Number(v) || 0),
  quantity: z.string().transform((v) => Number(v) || 0),
  weight: z
    .string()
    .transform((v) => (v ? Number(v) : 0))
    .optional(),
  shipping: z.boolean().optional(),
  weightMeasurement: z
    .string({ required_error: "'weightMeasurement' is required" })
    .refine((value) => allowedWeightMeasurements.includes(value), {
      message: "Invalid 'weightMeasurement' value",
    }),
  productStatus: z.string({ required_error: "'productStatus' is required" }),
  category: z
    .string({ required_error: "'category' is required" })
    .nonempty("'category' cannot be empty"),
});

export type createProductSchemaType = z.infer<typeof createProductSchema>;
