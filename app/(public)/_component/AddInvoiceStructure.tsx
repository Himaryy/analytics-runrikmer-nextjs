"use client";

import { DatePicker } from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
  invoiceSchema,
  invoiceSchemaType,
  serviceList,
} from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { PriceInput } from "./PriceInput";
import { formatRupiah } from "@/lib/formatValue";

export function AddInvoiceStructure() {
  const form = useForm<invoiceSchemaType>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceNumber: "",
      serviceBy: "",
      serviceDate: undefined,
      lines: [{ serviceType: "Aki / Baterai", value: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lines",
  });

  const watchLines = form.watch("lines");

  function onSubmit(data: invoiceSchemaType) {
    const lines = data.lines.map((l) => {
      const name =
        l.serviceType === "Pilih Lainnya"
          ? l.customService?.trim() || "Lainnya"
          : l.serviceType;
      return `${name} ${formatRupiah(l.value)} ${data.serviceDate}`;
    });
    console.log(lines);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="invoiceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Invoice</FormLabel>
                  <FormControl>
                    <Input placeholder="INV-271297" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Di Service Oleh</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Service</FormLabel>
                  <FormControl>
                    <DatePicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Dynamic input */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel>Detail Service</FormLabel>
            </div>

            {fields.map((item, idx) => {
              const isCustom =
                watchLines?.[idx]?.serviceType === "Pilih Lainnya";

              return (
                <div
                  key={item.id}
                  className={cn(
                    "grid items-end gap-3 w-full",
                    isCustom
                      ? "grid-cols-[auto_1fr_2fr_auto]"
                      : "grid-cols-[auto_2fr_auto]"
                  )}
                >
                  {/* ----- 1.  selector (always visible) ----- */}
                  <FormField
                    control={form.control}
                    name={`lines.${idx}.serviceType`}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange(val);
                          if (val !== "Pilih Lainnya") {
                            // clear the custom name when user leaves "Pilih Lainnya"
                            form.setValue(`lines.${idx}.customService`, "");
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceList.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {/* ----- 2.  extra name field (only for "Pilih Lainnya") ----- */}
                  {isCustom && (
                    <FormField
                      control={form.control}
                      name={`lines.${idx}.customService`}
                      render={({ field }) => (
                        <Input placeholder="New service name" {...field} />
                      )}
                    />
                  )}

                  {/* ----- 3.  price / value ----- */}
                  <FormField
                    control={form.control}
                    name={`lines.${idx}.value`}
                    render={({ field }) => (
                      <PriceInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Rp 0"
                      />
                    )}
                  />

                  {/* ----- 4.  delete ----- */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(idx)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              );
            })}
            <Button
              className="mb-6"
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ serviceType: serviceList[0], value: 0 })}
            >
              <Plus className="mr-2 h-4 w-4" /> Tambah Baris
            </Button>
          </div>

          <Button type="submit" className="w-full">
            Simpan Invoice
          </Button>
        </form>
      </Form>
    </>
  );
}
