import z from "zod";

export const updateProductPriceOrStockSchema = z.object({
  
  productName:z.string().min(1,"The Product is required."),
  newCostPrice: z.number().gt(0, "Cost price must be greater than 0"),
  newSellingPrice: z.number().gt(0, "Selling price must be greater than 0"),
  newStock: z.number().int().gt(0,"New Stock can't be negative."),
  isFeatured: z.boolean().default(false),
  
});

export type UpdateProductPriceOrStockInputType= z.input<typeof updateProductPriceOrStockSchema>;
export type UpdateProductPriceOrStockOutputType = z.output<typeof updateProductPriceOrStockSchema>;