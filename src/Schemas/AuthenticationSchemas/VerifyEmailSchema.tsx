import z from "zod";

export const verifyEmailSchema = z
  .object({
    email: z.string().min(1,"This field can't be empty."),
  });
  
export type VerifyEmailSchema= z.infer<typeof verifyEmailSchema>;