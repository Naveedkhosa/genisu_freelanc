import { useState } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';


export interface Payment {
  id: number;
  name: string;
  slug: string;
  image: string;
  active: boolean;
  created_at: string;
}

export const PaymentColumns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "image",
    header: "Image",
  },
  {
    accessorKey: "active",
    header: "Active",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return format(new Date(value), 'MM/dd/yyyy, p'); // Format as needed
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: function Test() {
      // const payment = row.original;
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-8 h-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuItem onSelect={() => setIsDialogOpen(true)}>
                <Button variant='outline' className='w-full'>Edit Payment Method</Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button onClick={() => { }}>Delete</Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="w-[92%] rounded-lg sm:max-w-[900px]">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-4 py-4">
                <div className='flex flex-col gap-3'>
                  <div className="flex flex-col items-start gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder='Paypal'
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-col items-start gap-4">
                    <Label htmlFor="secert-key" className="text-right">
                      Secert Key
                    </Label>
                    <Input
                      id="secert-key"
                      placeholder='Secret key'
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-col items-start gap-4">
                    <Label htmlFor="public-key" className="text-right">
                      Public key
                    </Label>
                    <Input
                      id="public-key"
                      defaultValue=""
                      placeholder='public-key'
                      className="w-full"
                    />
                  </div>
                </div>
                <div className='flex flex-col gap-3'>
                  <div className="flex flex-col items-start gap-4">
                    <Label htmlFor="hash-key" className="text-right">
                      Hash Key
                    </Label>
                    <Input
                      id="hash-key"
                      defaultValue=""
                      placeholder='*****'
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-col items-start gap-4">
                    <Label htmlFor="instruction" className="text-right">
                      instruction
                    </Label>
                    <Textarea
                      id="instruction"
                      defaultValue=""
                      placeholder='write instruction here'
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-col items-start gap-4">
                    <Label htmlFor="photo" className="text-right">
                     photo
                    </Label>
                    <Input
                      id="photo"
                      defaultValue=""
                      placeholder=''
                      className="w-full"
                      type='file'
                    />
                  </div>
                   <div className="flex items-start gap-4">
                    <Label htmlFor="active" className="text-right">
                     Active
                    </Label>
                    <Checkbox
                      id="active"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button className='mt-3 text-white bg-primary-200 sm:mt-0' type="submit">Update Payment Method </Button>
                <Button  variant='destructive' type="submit">Cancel </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];
