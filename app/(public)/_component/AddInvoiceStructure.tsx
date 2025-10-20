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
  paidStatus,
  serviceList,
} from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

export function AddInvoiceStructure() {
  const form = useForm<invoiceSchemaType>({
    // @ts-expect-error schema coercion type
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      serviceDate: new Date(),
      driverName: "",
      odometerKm: 0,
      // lines: [{ serviceType: "Aki / Baterai", value: 0 }],
      lines: [{ serviceType: "Aki / Baterai", keteranganItem: "" }],
      status: "Unpaid",
      locationService: "",
      notes: "",
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
      return `${name} ${l.keteranganItem} ${data.serviceDate}`;
    });
    console.log(lines);
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={
            // @ts-expect-error schema coercion type
            form.handleSubmit(onSubmit)
          }
          className="space-y-8"
        >
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {/* <FormField
              // @ts-expect-error schema coercion type
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
            /> */}

            <FormField
              // @ts-expect-error schema coercion type
              control={form.control}
              name="locationService"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Tempat Service</FormLabel>
                  <FormControl>
                    <Input placeholder="Bengkel..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              // @ts-expect-error schema coercion type
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

            {/* <FormField
              // @ts-expect-error schema coercion type
              control={form.control}
              name="picName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama PIC Service</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              // @ts-expect-error schema coercion type
              control={form.control}
              name="driverName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Driver</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              // @ts-expect-error schema coercion type
              control={form.control}
              name="odometerKm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kilometer Truck (km)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="123456" {...field} />
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
                    "grid w-full gap-3 rounded-md border border-border p-3",
                    // sm: stack (1 kolom), md+: horizontal
                    isCustom
                      ? "md:grid-cols-[auto_1fr_2fr_auto]" // Select | Custom | Keterangan | Delete
                      : "md:grid-cols-[auto_2fr_auto]" // Select | Keterangan | Delete
                  )}
                >
                  {/* ----- 1.  selector (always visible) ----- */}
                  <FormField
                    // @ts-expect-error schema coercion type
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
                      // @ts-expect-error schema coercion type
                      control={form.control}
                      name={`lines.${idx}.customService`}
                      render={({ field }) => (
                        <>
                          <Input placeholder="New service name" {...field} />
                          <FormMessage />
                        </>
                      )}
                    />
                  )}

                  <div className="flex gap-2 w-full items-center">
                    {/* ----- 3.  price / value ----- */}
                    <FormField
                      // @ts-expect-error schema coercion type
                      control={form.control}
                      name={`lines.${idx}.keteranganItem`}
                      render={({ field }) => (
                        <>
                          <Textarea
                            placeholder="Keterangan item service..."
                            {...field}
                          />
                          <FormMessage />
                        </>
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
                </div>
              );
            })}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({ serviceType: serviceList[0], keteranganItem: "" })
              }
            >
              <Plus className="mr-2 h-4 w-4" /> Tambah Baris
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <FormField
              // @ts-expect-error schema coercion type
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Pembayaran</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Status Pembayaran" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {paidStatus.map((ps) => (
                        <SelectItem key={ps} value={ps}>
                          {ps}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              // @ts-expect-error schema coercion type
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notes tambahan..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <div className="text-right leading-tight mt-8">
              <p className="text-muted-foreground text-sm">Grand Total</p>
              <p className="text-green-700 dark:text-green-300 text-2xl">
                Rp. xxxx
              </p>
            </div> */}
          </div>

          <Button type="submit" className="w-full">
            Simpan Invoice
          </Button>
        </form>
      </Form>
    </>
  );
}
