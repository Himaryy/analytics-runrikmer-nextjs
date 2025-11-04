"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  detailFakturExists,
  GetFakturByScanIdFaktur,
} from "@/app/data/get-invoice-data";
import {
  detailInvoiceFormSchema,
  DetailInvoiceFormType,
  fakturHeaderSchema,
  FakturHeaderType,
} from "@/lib/zodSchemas";
import { BASE_URL } from "@/utils/apiURL";

export async function AddListServiceAction(
  id_faktur: number,
  data: DetailInvoiceFormType[]
) {
  const newRows = data.filter((row) => row.idDetailFaktur == null);

  if (newRows.length === 0) {
    return { status: "success" as const, createdCount: 0 };
  }

  for (const row of newRows) {
    const parsedData = detailInvoiceFormSchema.safeParse(row);

    if (!parsedData.success) {
      return { status: "error" as const, message: "Invalid form data" };
    }
  }

  const payload = {
    id_faktur,
    detail_faktur: newRows.map((row) => ({
      id_parameter: row.idParameter,
      keterangan: row.keteranganItem,
    })),
  };

  console.log("payload from action", payload);

  try {
    const response = await fetch(`${BASE_URL}/detail_faktur`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-cache",
    });

    const server = await response.json();

    return { status: "success" as const, server };
  } catch (error: any) {
    return {
      status: "error" as const,
      message: error?.message ?? "Network/unknown error",
    };
  }
}

export async function EditHeaderDetailAction(data: FakturHeaderType) {
  const parsedData = fakturHeaderSchema.safeParse(data);

  if (!parsedData.success) {
    return {
      status: "error" as const,
      message: "Invalid header data",
    };
  }

  const { idFaktur, locationService, driverName, keterangan } = parsedData.data;

  // find the data using id
  const headerById = await GetFakturByScanIdFaktur(idFaktur);
  if (!headerById) {
    return {
      status: "error" as const,
      message: `Faktur ${idFaktur} tidak ditemukan`,
    };
  }

  const payload = {
    id_faktur: idFaktur,
    lokasi: locationService,
    nama: driverName,
    keterangan,
  };

  try {
    const response = await fetch(`${BASE_URL}/faktur`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-cache",
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return {
        status: "error" as const,
        message: `API error (${response.status}): ${
          text || response.statusText
        }`,
      };
    }

    const server = await response.json();

    return { status: "success" as const, data: server };
  } catch (error: any) {
    return {
      status: "error" as const,
      message: error?.message ?? "Network/unknown error",
    };
  }
}

export async function EditListServiceAction(
  idFaktur: number,
  data: DetailInvoiceFormType[]
) {
  const toUpdate = data.filter((res) => res.idDetailFaktur != null);

  if (toUpdate.length === 0) {
    return {
      status: "success" as const,
      message: "Tidak ada data yang di-update",
    };
  }

  for (const row of toUpdate) {
    const parsed = detailInvoiceFormSchema.safeParse(row);
    if (!parsed.success) {
      return { status: "error" as const, message: "Invalid ID Detail Invoice" };
    }
  }

  const existsFlags = await Promise.all(
    toUpdate.map((r) => detailFakturExists(idFaktur, r.idDetailFaktur!))
  );

  const missing = toUpdate
    .map((r, i) => (existsFlags[i] ? null : r.idDetailFaktur))
    .filter(Boolean) as number[];

  if (missing.length) {
    return {
      status: "error" as const,
      message: `ID DETAIL FAKTUR tidak ditemukan: ${missing.join(", ")}`,
    };
  }

  for (const row of toUpdate) {
    const payload = {
      id_detail_faktur: Number(row.idDetailFaktur),
      keterangan: row.keteranganItem.trim(),
    };

    const resp = await fetch(`${BASE_URL}/detail_faktur`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
      body: JSON.stringify(payload),
    });

    const json: any = await resp.json().catch(() => ({}));

    // handle soft error dari backend
    const softFail = json === false || json?.data === false;
    if (!resp.ok || softFail) {
      return {
        status: "error" as const,
        message: json?.message ?? "Update gagal",
      };
    }
  }

  return { status: "success" as const, message: "Detail berhasil di-update" };
}

export async function DeleteListServiceAction(idDetailFaktur: number) {
  if (!idDetailFaktur) {
    return {
      status: "error" as const,
      message: "ID DETAIL FAKTUR tidak valid",
    };
  }

  const payload = {
    id_detail_faktur: idDetailFaktur,
  };

  try {
    const response = await fetch(`${BASE_URL}/detail_faktur`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
      body: JSON.stringify(payload),
    });

    const server = await response.json();

    const softFail = server?.data === false;

    if (!response.ok || softFail) {
      return {
        status: "error" as const,
        message: server?.message ?? "Gagal menghapus detail faktur",
      };
    }

    return {
      status: "success" as const,
      message: "Detail berhasil dihapus",
      data: server,
    };
  } catch (error: any) {
    return {
      status: "error" as const,
      message: error?.message ?? "Network/unknown error",
    };
  }
}
