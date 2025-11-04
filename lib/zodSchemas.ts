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
export const statusOverdue = ["warning", "danger"];
export const pengecekanMandiriStatus = ["Ok", "Bermasalah"];

export const lineSchema = z.object({
  serviceType: z.string().min(1, { message: "Tidak Boleh Kosong" }), // accept any non-empty string
  // value: z.number().min(0, "Min 0"),
  keteranganItem: z
    .string()
    .min(1, { message: "Keterangan tidak boleh kosong" }),
  customService: z.string().optional(),
});

// Invoice
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

export const getInvoiceSchema = z.object({
  idFaktur: z.number({ message: "Invalid ID Faktur" }),
  idInvoice: z.string({ message: "Invalid ID Invoice" }),
  odometerKm: z.string({ message: "Invalid Odometer Kendaraan" }),
  keterangan: z.string().optional(),
  locationService: z.string({ message: "Invalid Lokasi Service" }),
  driverName: z.string({ message: "Invalid Nama" }),
  serviceDate: z.date({ message: "Invalid Tanggal Service" }),
});

export type getInvoiceSchemaType = z.infer<typeof getInvoiceSchema>;

export const getDetailInvoiceSchema = z.object({
  idDetailFaktur: z.number({ message: "Invalid ID Detail Faktur" }).optional(),
  idFaktur: z.number({ message: "Invalid ID Faktur" }),
  idInvoice: z.string({ message: "Invalid ID Invoice" }),
  idParameter: z.number({ message: "Invalid ID Parameter" }),
  odometerKm: z.string({ message: "Invalid Odometer Kendaraan" }),
  keteranganItem: z
    .string({ message: "Invalid Keterangan Item Service" })
    .optional(),
  namaParameter: z.string({ message: "Invalid Nama Parameter" }),
  serviceDate: z.date({ message: "Invalid Tanggal Service" }),
});
export type getDetailInvoiceType = z.infer<typeof getDetailInvoiceSchema>;

export const detailInvoiceFormSchema = z.object({
  idDetailFaktur: z.number().int().optional(),
  idParameter: z.number().int().positive(),
  keteranganItem: z
    .string()
    .min(1, { message: "Keterangan tidak boleh kosong" }),
});
export type DetailInvoiceFormType = z.infer<typeof detailInvoiceFormSchema>;

export const fakturHeaderSchema = z.object({
  idFaktur: z.number({ message: "Invalid ID Faktur" }),
  locationService: z.string({ message: "Invalid Lokasi Service" }),
  driverName: z.string({ message: "Invalid Nama" }),
  keterangan: z.string().optional(),
});

export type FakturHeaderType = z.infer<typeof fakturHeaderSchema>;

export const detailInvoiceListFormSchema = z.object({
  items: z.array(detailInvoiceFormSchema).min(1, "Minimal 1 baris service"),
});
export type DetailInvoiceListType = z.infer<typeof detailInvoiceListFormSchema>;

// Pnegecekan Mandiri
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

// Parameter
export const parameterKendaraanSchema = z.object({
  intervalJarak: z.coerce.number().min(1, { message: "Minimal 1" }),
  intervalWaktu: z.coerce.number().min(1, { message: "Minimal 1" }),
  namaParameter: z
    .string()
    .min(3, { message: "Minimal 3 karakter" })
    .max(100, { message: "Maksimal 100 karakter" }),
});

export type parameterKendaraanType = z.infer<typeof parameterKendaraanSchema>;

export const getParameterKendaraan = z.object({
  idParameter: z.number({ message: "Invalid ID Parameter" }),
  intervalJarak: z.coerce.number({ message: "Invalid Interval Jarak" }),
  intervalWaktu: z.coerce.number({ message: "Invalid Interval Waktu" }),
  namaParameter: z.string({ message: "Invalid Nama Parameter" }),
});
export type getParameterKendaraanType = z.infer<typeof getParameterKendaraan>;

// Overdue
export const getOvedueParameterKendaraan = z.object({
  idParameter: z.number({ message: "Invalid ID Parameter" }),
  intervalJarak: z.coerce.number({ message: "Invalid Interval Jarak" }),
  intervalWaktu: z.coerce.number({ message: "Invalid Interval Waktu" }),
  namaParameter: z.string({ message: "Invalid Nama Parameter" }),
  message: z.string({ message: "Invalid Overdue Message" }),
  tanggal: z.date({ message: "Invalid Tanggal Overdue" }),
  odometerKm: z.string({ message: "Invalid Odometer Kendaraan" }),
  type: z.enum(statusOverdue),
});

export type getOverdueType = z.infer<typeof getOvedueParameterKendaraan>;
