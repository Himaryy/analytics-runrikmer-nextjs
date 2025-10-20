import { z } from "zod";

export const serviceList = [
  "Oli Mesin + Filter Oli",
  "Filter Udara",
  "Filter Solar (Fuel Filter)",
  "Filter Kabin / AC",
  "Oli Transmisi & Gardan",
  "Minyak Rem",
  "Kampas Rem (Brake Lining)",
  "Kopling (Clutch Disc & Cover)",
  "Radiator & Coolant",
  "Aki / Baterai",
  "Ban (Tekanan & Rotasi)",
  "Suspensi & As Roda",
  "Lampu, Klakson, & Kelistrikan",
  "Pelumas Power Steering / Hidrolik",
  "Pelumas Bearing Roda",
  "Servis Lengkap (General Check-Up)",
  "Pilih Lainnya",
] as const;

export const lineSchema = z.object({
  serviceType: z.string().min(1), // accept any non-empty string
  value: z.number().min(0, "Min 0"),
  customService: z.string().optional(),
});

export const invoiceSchema = z.object({
  invoiceNumber: z
    .string()
    .min(3, { message: "Invoice minimal 3 karakter" })
    .max(100, { message: "Invoice maksimal 100 karakter" }),
  serviceDate: z.date({ message: "Tanggal service wajib dipilih" }),
  serviceBy: z
    .string()
    .min(3, { message: "Nama minimal 3 karakter" })
    .max(50, { message: "Nama maksimal 50 karakter" }),
  lines: z.array(lineSchema).min(1, "Minimal 1 jenis service"),
});

export type invoiceSchemaType = z.infer<typeof invoiceSchema>;
