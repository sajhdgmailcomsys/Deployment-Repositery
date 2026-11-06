import z from "zod";

export const changePassSchema = z
  .object({
    email: z.string().min(1,"This field can't be empty."),
  });
  
export type ChangePassSchema= z.infer<typeof changePassSchema>;