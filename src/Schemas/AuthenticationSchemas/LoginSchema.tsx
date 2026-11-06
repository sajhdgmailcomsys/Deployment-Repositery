import z from "zod";

export const loginSchema = z
  .object({
    email: z.string().min(1,"This Field Can't Be Empty."),
    password: z.string().min(1,"This Field Can't Be Empty."),
  });
  
export type LoginSchema= z.infer<typeof loginSchema>;