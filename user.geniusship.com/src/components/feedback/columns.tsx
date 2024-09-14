import { ColumnDef } from "@tanstack/react-table";
import { format } from 'date-fns';
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import baseClient from '@/services/apiClient';

export interface Feedback {
  id: number;
  user: string;
  rating: number; // Rating between 1 and 5
  comments?: string; // Optional field
  created_at: string; // Consider using Date type if preferred
}

export const FeedbackColumns: ColumnDef<Feedback>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "rating",
    header: "Rating",
  },
  {
    accessorKey: "comments",
    header: "Comments",
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
    cell: ({ row }) => {
      const { id } = row.original

      const deleteFeedBack = async () => {
        const response = await baseClient.delete(`/feedback/${id}`);
        if(response.status == 204){
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
            <DropdownMenuItem><Button onClick={deleteFeedBack}>Delete</Button></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
