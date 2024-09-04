import { useState } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '../ui/checkbox';

export interface CalculatorRate {
    id: number;
    courier: string;
    rating: number;
    estimated_delivery_date: string;
    chargeable_weight: number;
    shipment_rate: number;
    active: boolean;
    created_at: string;
}

export const CalculatorRateColumns: ColumnDef<CalculatorRate>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "courier",
        header: "Courier",
    },
    {
        accessorKey: "rating",
        header: "Rating",
    },
    {
        accessorKey: "estimated_delivery_date",
        header: "Estimated Delivery Date",
        cell: ({ getValue }) => {
            const value = getValue<string>();
            return format(new Date(value), 'MM/dd/yyyy'); // Format as needed
        },
    },
    {
        accessorKey: "chargeable_weight",
        header: "Chargeable Weight (KG)",
    },
    {
        accessorKey: "CalculatorRate_rate",
        header: "Shipment Rate",
    },
    {
        accessorKey: "active",
        header: "Active",
        cell: ({ getValue }) => {
            const value = getValue<boolean>();
            return value ? "Active" : "Inactive";
        },
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
        cell: function ActionCell({ row }) {
            const [isDialogOpen, setIsDialogOpen] = useState(false);
            const shipment = row.original;

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
                                <Button variant='outline' className='w-full'>Edit Shipment</Button>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Button onClick={() => { }}>Delete</Button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className="w-[92%] rounded-lg sm:max-w-[900px]">
                            <DialogHeader>
                                <DialogTitle>Edit Shipment</DialogTitle>
                                <DialogDescription>
                                    Make changes to the shipment details here. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 gap-4 py-4">
                                <div className='flex flex-col gap-3'>
                                    <div className="flex flex-col items-start gap-4">
                                        <Label htmlFor="courier" className="text-right">
                                            Courier
                                        </Label>
                                        <Input
                                            id="courier"
                                            defaultValue={shipment.courier}
                                            placeholder='Courier'
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="flex flex-col items-start gap-4">
                                        <Label htmlFor="rating" className="text-right">
                                            Rating
                                        </Label>
                                        <Input
                                            id="rating"
                                            type="number"
                                            defaultValue={shipment.rating}
                                            placeholder='Rating'
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="flex flex-col items-start gap-4">
                                        <Label htmlFor="estimated_delivery_date" className="text-right">
                                            Estimated Delivery Date
                                        </Label>
                                        <Input
                                            id="estimated_delivery_date"
                                            type="date"
                                            defaultValue={shipment.estimated_delivery_date}
                                            placeholder='Estimated Delivery Date'
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-3'>
                                    <div className="flex flex-col items-start gap-4">
                                        <Label htmlFor="chargeable_weight" className="text-right">
                                            Chargeable Weight (KG)
                                        </Label>
                                        <Input
                                            id="chargeable_weight"
                                            type="number"
                                            defaultValue={shipment.chargeable_weight}
                                            placeholder='Chargeable Weight (KG)'
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="flex flex-col items-start gap-4">
                                        <Label htmlFor="shipment_rate" className="text-right">
                                            Shipment Rate
                                        </Label>
                                        <Input
                                            id="shipment_rate"
                                            type="number"
                                            defaultValue={shipment.shipment_rate}
                                            placeholder='Shipment Rate'
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <Label htmlFor="active" className="text-right">
                                            Active
                                        </Label>
                                        <Checkbox
                                            id="active"
                                            defaultChecked={shipment.active}
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button className='mt-3 text-white bg-primary-200 sm:mt-0' type="submit">Update Shipment</Button>
                                <Button variant='destructive' type="button" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            );
        },
    },
];
