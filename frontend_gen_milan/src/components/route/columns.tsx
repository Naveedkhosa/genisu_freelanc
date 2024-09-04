import { ColumnDef } from "@tanstack/react-table"
import { format } from 'date-fns';
import {  MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import baseClient from '@/services/apiClient';
import { toast } from "sonner";

export interface Route {
    id: number;
    name: string;
    description?: string; // Optional field
    start_location: string;
    end_location: string;
    distance_km: number;
    estimated_time_minutes: number;
    cost: number;
    created_at: string; // Consider using Date type if preferred
    updated_at: string; // Consider using Date type if preferred
  }
  

export const RouteColumns: ColumnDef<Route>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "description",
      header: "Description",

    },
    {
      accessorKey: "start_location",
      header: "Start Location",
    },
    {
      accessorKey: "end_location",
      header: "End Location",
    },
    {
      accessorKey: "distance_km",
      header: "Distance (km)",
    },
    {
      accessorKey: "estimated_time_minutes",
      header: "Estimated Time (minutes)",
    },
    {
      accessorKey: "cost",
      header: "Cost",
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

          const deleteRoute = async () => {
            const response = await baseClient.delete(`/routes/${id}`);
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
                <DropdownMenuItem><Button onClick={deleteRoute}>Delete</Button></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      }
  ]