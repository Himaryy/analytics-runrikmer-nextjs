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

export const paidStatus = ["Paid", "Paid Partially", "Unpaid"];
export const pengecekanMandiriStatus = ["Ok", "Bermasalah"];

export const lineSchema = z.object({
  serviceType: z.string().min(1, { message: "Tidak Boleh Kosong" }), // accept any non-empty string
  // value: z.number().min(0, "Min 0"),
  keteranganItem: z
    .string()
    .min(1, { message: "Keterangan tidak boleh kosong" }),
  customService: z.string().optional(),
});

export const invoiceSchema = z.object({
  // invoiceNumber: z.string().min(1, { message: "Tidak boleh kosong" }),
  serviceDate: z.date({ message: "Tanggal service wajib dipilih" }),
  driverName: z.string().min(3, { message: "Nama driver minimal 3 karakter" }),
  odometerKm: z.coerce.number().min(1, { message: "Tidak boleh 0 / kosong" }),
  locationService: z.string().min(3, { message: "Minimal 3 karakter" }),
  lines: z.array(lineSchema).min(1, "Minimal memilih 1 jenis service"),

  status: z.enum(paidStatus, { message: "Status wajib dipilih" }),
  notes: z.string().optional(),
});

export type invoiceSchemaType = z.infer<typeof invoiceSchema>;

export const pengecekanMandiriSchema = z.object({
  driverName: z.string().min(3, { message: "Nama minimal 3 karakter" }),
  lines: z
    .array(lineSchema)
    .min(1, { message: "Minimal memilih 1 jenis service" }),
  status: z.enum(pengecekanMandiriStatus, { message: "Status wajib dipilih" }),
  notes: z.string().optional(),
  serviceDate: z.date({ message: "Tanggal service wajib dipilih" }),
});

export type pengecekanMandiriType = z.infer<typeof pengecekanMandiriSchema>;
