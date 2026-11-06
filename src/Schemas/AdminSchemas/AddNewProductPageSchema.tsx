import z from "zod";

export const addNewProductSchema = z.object({
  description: z.string().trim().min(1, "Description cannot be empty"), 
  costPrice: z.number().gt(0, "Cost price must be greater than 0"),
  sellingPrice: z.number().gt(0, "Selling price must be greater than 0"),
  categoryName: z.string().trim().min(1, "Category name cannot be empty"),
  brandName: z.string().trim().min(1, "Brand name cannot be empty"),
  primaryImageURL: z.url().nullable().default(""),
  productImageURLs: z.array(z.url()).nullable().default([]),
  detailedDescription: z.string().nullable().default(""),
  stock: z.number().int(),
  isFeatured: z.boolean().default(false),
  unit: z.string().trim().min(1, "Unit cannot be empty"),
});

export type AddNewProductSchemaTypeInput= z.input<typeof addNewProductSchema>;
export type AddNewProductSchemaTypeOutput = z.output<typeof addNewProductSchema>;