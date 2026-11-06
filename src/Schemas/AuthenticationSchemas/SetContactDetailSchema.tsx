import z from "zod";

export const contactDetailSchema = z.object({
    address:z.string().trim().min(10,"Please enter a detailed address.").max(300,"Address is too long."),
    pakistaniPhoneNumber:z.string().trim().regex(/^0?3\d{9}$/,"Please enter a valid Pakistani phone number.")
}

)
export type contactDetailSchemaType = z.infer<typeof contactDetailSchema>;