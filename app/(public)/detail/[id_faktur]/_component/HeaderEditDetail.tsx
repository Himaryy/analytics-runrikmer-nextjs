"use client";

import {
  fakturHeaderSchema,
  FakturHeaderType,
  getInvoiceSchemaType,
} from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { EditHeaderDetailAction } from "../actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateID } from "@/lib/formatValue";
import { Clipboard, MapPin, Pencil, Trash, User } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  dataHeader: getInvoiceSchemaType;
};

export default function HeaderDetail({ dataHeader }: Props) {
  const form = useForm<FakturHeaderType>({
    resolver: zodResolver(fakturHeaderSchema),
    defaultValues: {
      idFaktur: dataHeader.idFaktur,
      locationService: dataHeader.locationService,
      driverName: dataHeader.driverName,
      keterangan: dataHeader.keterangan ?? "",
    },
    mode: "onChange",
  });

  const { control, reset } = form;
  const [isLoading, setIsLoading] = useState(false);
  const [openHeaderDialog, setOpenHeaderDialog] = useState(false);

  const router = useRouter();

  async function onSubmit(data: FakturHeaderType) {
    setIsLoading(true);
    const response = await EditHeaderDetailAction(data);
    setIsLoading(false);

    if (response.status === "success") {
      reset(data);
      setOpenHeaderDialog(false);

      router.refresh();
    } else {
      console.error(response.message);
    }
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              Detail Faktur #{dataHeader.idFaktur}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Badge>Invoice: {dataHeader.idInvoice}</Badge>
              <Badge>Odometer: {dataHeader.odometerKm}</Badge>
              <Badge>{formatDateID(dataHeader.serviceDate)}</Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenHeaderDialog(true)}
            >
              <Pencil className="mr-2 size-4" /> Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => {}}>
              <Trash className="mr-2 size-4" /> Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          <div>
            <div className="text-muted-foreground text-xs">Nama</div>
            <div className="mt-1 flex items-center gap-2 font-medium">
              <User className="size-4 text-muted-foreground" />
              <span>{dataHeader.driverName}</span>
            </div>
          </div>

          <div>
            <div className="text-muted-foreground text-xs">Lokasi</div>
            <div className="mt-1 flex items-center gap-2 font-medium">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{dataHeader.locationService}</span>
            </div>
          </div>

          <div>
            <div className="text-muted-foreground text-xs">Notes Service</div>
            <div className="mt-1 flex items-center gap-2 font-medium">
              <Clipboard className="size-4 text-muted-foreground" />
              <span>{dataHeader.keterangan || "Tidak ada note"}</span>
            </div>
          </div>
        </div>
      </Card>

      <Dialog
        open={openHeaderDialog}
        onOpenChange={(value) => !isLoading && setOpenHeaderDialog(value)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Header Faktur</DialogTitle>
            <DialogDescription>
              Ubah informasi header lalu klik Simpan.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={control}
                name="driverName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Nama Pengemudi" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="locationService"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Lokasi" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="keterangan"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Keterangan Service" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
