import z from "zod";

export const signupSchema = z
  .object({
    email: z.email("Invalid Email Address."),
    password: z.string().min(13, "Password Should Be At Least 13 Characters Long.").max(64,"Password Should Be Less Than 64 Characters. "),
    confirmPassword: z.string().trim().min(1,"This Field Can't Be Empty."),
  }).refine((data) =>data.password===data.confirmPassword,{
    message:"Passwords do not match.",
    path:["confirmPassword"]
  });
  
export type signupschema= z.infer<typeof signupSchema>;