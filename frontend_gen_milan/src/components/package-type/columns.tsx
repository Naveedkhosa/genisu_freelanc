import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { format } from 'date-fns';
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import baseClient from "@/services/apiClient";
import { toast } from "sonner"; // Import toast for notifications

export interface PackageType {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export const getPackageColumns = (t): ColumnDef<PackageType>[] => [
  {
    accessorKey: "id",
    header: t("package_columns.ID"),
  },
  {
    accessorKey: "name",
    header: t("package_columns.Name"),
  },
  {
    accessorKey: "created_at",
    header: t("package_columns.Created At"),
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return format(new Date(value), 'MM/dd/yyyy, p'); // Format as needed
    },
  },
  {
    accessorKey: "updated_at",
    header: t("package_columns.Updated At"),
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return format(new Date(value), 'MM/dd/yyyy, p'); // Format as needed
    },
  },
  {
    id: "actions",
    header: t("package_columns.Actions"),
    cell: function ActionsCell({ row }) {
      const { id } = row.original;

      const deletePackageType = async () => {
        try {
          await baseClient.delete(`/package-types/${id}`);
          toast.success(t('package_columns.Package Type deleted successfully'));
          setTimeout(() => {
            window.location.reload(); // Reload the page after 1.5 seconds
          }, 1500); // 1.5 seconds delay
        } catch (error) {
          console.error('Error deleting package type:', error);
          toast.error(t('package_columns.Failed to delete package type'));
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <span className="sr-only">{t("package_columns.Open menu")}</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuItem onClick={deletePackageType}>
              <span>{t("package_columns.Delete")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
