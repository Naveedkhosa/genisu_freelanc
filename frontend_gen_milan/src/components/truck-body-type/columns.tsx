import { ColumnDef } from "@tanstack/react-table";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import baseClient from "@/services/apiClient";

export interface TruckBodyType {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export const getTruckBodyColumns = (t): ColumnDef<TruckBodyType>[] => [
  {
    accessorKey: "id",
    header: t("truck_body_columns.ID"),
  },
  {
    accessorKey: "name",
    header: t("truck_body_columns.Name"),
  },
  {
    accessorKey: "created_at",
    header: t("truck_body_columns.Created At"),
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return format(new Date(value), 'MM/dd/yyyy, p'); // Format as needed
    },
  },
  {
    accessorKey: "updated_at",
    header: t("truck_body_columns.Updated At"),
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return format(new Date(value), 'MM/dd/yyyy, p'); // Format as needed
    },
  },
  {
    id: "actions",
    header: t("truck_body_columns.Actions"),
    cell: function ActionsCell({ row }) {
      const { id } = row.original;

      const deleteTruckBodyType = async () => {
        try {
          await baseClient.delete(`/truck-body-types/${id}`);
          toast.success(t('truck_body_columns.Truck Body Type deleted successfully'));
          setTimeout(() => {
            window.location.reload(); // Reload the page after 1.5 seconds
          }, 1500); // 1.5 seconds delay
        } catch (error) {
          console.error('Error deleting truck body type:', error);
          toast.error(t('truck_body_columns.Failed to delete truck body type'));
        }
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-8 h-8 p-0">
                <span className="sr-only">{t("truck_body_columns.Open menu")}</span>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuItem>
                <Button variant="ghost" onClick={deleteTruckBodyType}>
                  {t("truck_body_columns.Delete")}
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
