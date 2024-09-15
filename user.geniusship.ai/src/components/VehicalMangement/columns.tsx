import { ColumnDef } from "@tanstack/react-table"
import { format } from 'date-fns';
import {  MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import baseClient from '@/services/apiClient';
import { toast } from "sonner";

export interface Vehicle {
  id: number;
  vehicle_number: string;
  model: string;
  owner: string;
  year: number;
  status: 'Available' | 'In Maintenance' | 'Assigned';
  driver: string;
  created_at: string; // Use Date type if preferred
  updated_at: string; // Use Date type if preferred
}


export const VehicleColumns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "vehicle_number",
    header: "vehicle Number",
  },
  {
    accessorKey: "model",
    header: "Model",
  },
  {
    accessorKey: "owner",
    header: "Owner",
  },
  {
    accessorKey: "year",
    header: "Year",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "driver",
    header: "Driver",
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
    accessorKey: "updated_at",
    header: "Updated At",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return format(new Date(value), 'MM/dd/yyyy, p'); // Format as needed
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const { id } = row.original

      const deleteVehicle = async () => {
        const response = await baseClient.delete(`/vehicles/${id}`);
        if(response.status == 200){
          toast('Deleted Successfully');
          window.location.reload()
        }else{
          toast('Not Deleted');
        }
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Button onClick={deleteVehicle}>Delete</Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
]
