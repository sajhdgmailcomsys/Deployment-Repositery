import z from "zod";

export const changePassMainSchema = z
  .object({
    newPassword: z.string().min(13, "Password Should Be At Least 13 Characters Long.").max(64,"Password Should Be Less Than 64 Characters. "),
    confirmPassword: z.string().trim().min(1,"This Field Can't Be Empty."),
  }).refine((data) =>data.newPassword===data.confirmPassword,{
    message:"Passwords do not match.",
    path:["confirmPassword"]
  });
  
export type ChangePassMainSchema= z.infer<typeof changePassMainSchema>;