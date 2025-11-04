"use client";

import { useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  detailInvoiceListFormSchema,
  DetailInvoiceListType,
  getDetailInvoiceType,
  getInvoiceSchemaType,
  getParameterKendaraanType,
} from "@/lib/zodSchemas";

import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import {
  AddListServiceAction,
  DeleteListServiceAction,
  EditListServiceAction,
} from "../actions";
import { useRouter } from "next/navigation";

interface iAppProps {
  header: getInvoiceSchemaType;
  details: getDetailInvoiceType[];
  parameters: getParameterKendaraanType[];
}

export default function ListService({
  header,
  details,
  parameters,
}: iAppProps) {
  const router = useRouter();

  // Track rows being edited (by index)
  const [editingRow, setEditingRow] = useState<number | null>(null);

  const parameterOptions = useMemo(
    () =>
      [...parameters]
        .map((p) => ({
          idParameter: p.idParameter,
          namaParameter: p.namaParameter,
        }))
        .sort((a, b) => a.idParameter - b.idParameter),
    [parameters]
  );

  const hasOptions = parameterOptions.length > 0;

  const defaultValues: DetailInvoiceListType = {
    items: details.map((item) => ({
      idDetailFaktur: item.idDetailFaktur ?? undefined,
      idParameter: item.idParameter,
      keteranganItem: item.keteranganItem ?? "",
    })),
  };

  const form = useForm<DetailInvoiceListType>({
    resolver: zodResolver(detailInvoiceListFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { control, reset, getValues, trigger } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Global submit → lock all rows again
  async function handleSave(idx: number) {
    const checkIdDetail = await trigger(`items.${idx}`);

    if (!checkIdDetail) {
      console.error("Data Detail Faktur is invalid");
      return;
    }

    const value = getValues(`items.${idx}`);

    // kondisi tambah baru atau edit
    const isAddNewData = value.idDetailFaktur == null;

    const response = isAddNewData
      ? await AddListServiceAction(header.idFaktur, [value])
      : await EditListServiceAction(header.idFaktur, [value]);
    console.log("Save row result:", response);

    if (response.status === "success") {
      setEditingRow(null);
      router.refresh(); // tarik data terbaru dari server component
    } else {
      console.error(response.message);
      // TODO: tampilkan toast error di sini
    }
  }

  function handleCancelRow() {
    reset(defaultValues);
    setEditingRow(null);
  }

  function handleEditRow(idx: number) {
    // const id = getValues(`items.${idx}.idDetailFaktur`) as number | undefined;
    // console.log("EDIT ROW → idDetailFaktur:", id, "index:", idx);
    setEditingRow(idx);
  }

  async function handleDeleteListService(idx: number) {
    const values = getValues(`items.${idx}`);
    const response = await DeleteListServiceAction(values.idDetailFaktur!);

    if (response.status === "success") {
      remove(idx);
      router.refresh();
    } else {
      console.error(response.message);
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-6">
        {/* Top actions */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Detail Service List
          </div>
        </div>

        {fields.map((field, idx) => {
          const isRowEditing = editingRow === idx;

          return (
            <div
              key={field.id}
              className="grid w-full gap-3 md:grid-cols-[auto_2fr_auto]"
            >
              {/* hidden idDetailFaktur */}
              <FormField
                control={control}
                name={`items.${idx}.idDetailFaktur`}
                render={({ field }) => (
                  <input type="hidden" value={field.value ?? ""} readOnly />
                )}
              />

              {/* Parameter */}
              <FormField
                control={control}
                name={`items.${idx}.idParameter`}
                render={({ field }) => {
                  const idDetail = getValues(`items.${idx}.idDetailFaktur`) as
                    | number
                    | undefined;
                  const isExistingRow = idDetail != null;
                  const isEditing = editingRow === idx;

                  if (isExistingRow) {
                    // ✅ Row lama → pakai input read-only (tapi nilai tetap masuk ke RHF)
                    return (
                      <FormItem>
                        <input
                          type="hidden"
                          value={field.value ?? ""}
                          readOnly
                        />
                        <FormControl>
                          <Input
                            value={
                              parameterOptions.find(
                                (p) => p.idParameter === field.value
                              )?.namaParameter ?? `Parameter #${field.value}`
                            }
                            readOnly
                            disabled
                            className="bg-muted/50 dark:bg-muted/30"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }

                  // ✅ Row baru → pakai SELECT
                  return (
                    <FormItem>
                      <FormControl>
                        {hasOptions ? (
                          <Select
                            value={String(field.value ?? "")}
                            onValueChange={(val) => field.onChange(Number(val))}
                            disabled={!isEditing} // hanya aktif ketika row masuk mode edit
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih parameter…" />
                            </SelectTrigger>
                            <SelectContent>
                              {parameterOptions.map((opt) => (
                                <SelectItem
                                  key={opt.idParameter}
                                  value={String(opt.idParameter)}
                                >
                                  {opt.namaParameter}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            type="number"
                            inputMode="numeric"
                            value={Number(field.value ?? 0)}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            placeholder="Masukkan ID Parameter (angka)"
                            disabled={!isEditing}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Keterangan */}
              <FormField
                control={control}
                name={`items.${idx}.keteranganItem`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Contoh: Oli Shell 1L"
                        {...field}
                        disabled={!isRowEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Row dropdown with Edit & Delete */}
              <div className="flex items-center gap-2">
                {isRowEditing ? (
                  <>
                    <Button
                      type="button"
                      size="sm"
                      className="w-auto"
                      onClick={() => handleSave(idx)}
                    >
                      Simpan Data
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="w-auto"
                      onClick={handleCancelRow}
                    >
                      Batal
                    </Button>
                  </>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className={cn(
                          "w-9 h-9",
                          "bg-muted/60 hover:bg-muted",
                          "dark:bg-muted/40 dark:hover:bg-muted/50"
                        )}
                        aria-label="More actions"
                      >
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => handleEditRow(idx)}>
                        <Pencil className="mr-2 size-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 dark:text-red-400"
                        onClick={() => handleDeleteListService(idx)}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          );
        })}

        {/* Footer: Tambah Baris (left) | Simpan/Batal (right) */}
        {/* <div className="sticky bottom-0 mt-4 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40 border-t pt-4"> */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const newIdx = fields.length;
              append({
                idDetailFaktur: undefined,
                idParameter: parameterOptions[0]?.idParameter ?? 0,
                keteranganItem: "",
              });
              // auto-enable edit on the newly added row
              setEditingRow(newIdx);
            }}
            className={cn(
              "rounded-lg px-4 font-medium shadow-sm w-auto",
              "text-green-700 bg-green-600/10 hover:bg-green-600/15",
              "border border-green-600/30",
              "dark:text-white dark:bg-green-400/15 dark:hover:bg-green-400/25 dark:border-green-400/30",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-green-600/40 dark:focus-visible:ring-green-400/40",
              "disabled:opacity-60 disabled:pointer-events-none"
            )}
          >
            <Plus className="mr-2 h-4 w-4" /> Tambah Baris
          </Button>
        </div>
        {/* </div> */}
      </form>
    </Form>
  );
}
