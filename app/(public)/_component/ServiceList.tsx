/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { invoiceSchema, serviceList } from "@/lib/zodSchemas";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import z from "zod";

type ServicePair = {
  type: (typeof serviceList)[number];
  customKey?: string;
  value: number;
};

type InvoiceFormValues = z.infer<typeof invoiceSchema> & {
  servicePairs: ServicePair[];
};

function ServiceListRow({
  index,
  onRemove,
}: {
  index: number;
  onRemove: () => void;
}) {
  const { control, register, watch, setValue } =
    useFormContext<InvoiceFormValues>();

  const type = watch(`servicePairs.${index}.type`);

  // keep main service type sync
  const pairs = watch("servicePairs");

  useEffect(() => {
    if (pairs?.length) {
      setValue("serviceType", pairs[pairs.length - 1]?.type as any, {
        shouldValidate: true,
      });
    }
  }, [pairs, setValue]);

  return (
    <div className="grid grid-cols-12 gap-2 items-center rounded-xl border p-3">
      <div className="col-span-12 md:col-span-5">
        <FormField
          control={control}
          name={`servicePairs.${index}.type`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-muted-foreground">
                Jenis Service
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Jenis Service" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {serviceList.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Jika Input -> Lainnya */}
              {type == "Pilih Lainnya" && (
                <FormControl>
                  <Input
                    className="mt-2"
                    placeholder="Masukan Jenis Service"
                    {...register(`servicePairs.${index}.customKey` as const)}
                  />
                </FormControl>
              )}
            </FormItem>
          )}
        />
      </div>

      {/* Value */}
      <div className="col-span-10 md:col-span-5">
        <FormLabel className="text-xs text-muted-foreground">Harga</FormLabel>
        <Input
          type="number"
          min={1}
          step={100}
          placeholder="1"
          {...register(`servicePairs.${index}.value` as const, {
            valueAsNumber: true,
          })}
        />
      </div>

      {/* Remove service */}
      <div className="col-span-2 md:col-span-2 flex justify-end pt-5 md:pt-0">
        <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}
