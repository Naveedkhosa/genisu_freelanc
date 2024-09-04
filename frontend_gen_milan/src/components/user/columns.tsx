import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import baseClient from '@/services/apiClient';

export type CurrentUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  address: string;
  company: string;
  license_number: string;
  transporter_name?: string;
  created_at: string; // Ensure these are strings or Date objects
  updated_at: string; // Ensure these are strings or Date objects
};

export const getUserColumns = (t): ColumnDef<User>[] => [
  {
    accessorKey: "id",
    header: t("user_columns.ID"),
  },
  {
    accessorKey: "name",
    header: t("user_columns.Name"),
  },
  {
    accessorKey: "email",
    header: t("user_columns.Email"),
  },
  {
    accessorKey: "role",
    header: t("user_columns.Role"),
  },
  {
    accessorKey: "phone",
    header: t("user_columns.Phone"),
  },
  {
    accessorKey: "address",
    header: t("user_columns.Address"),
  },
  {
    accessorKey: "company",
    header: t("user_columns.Company"),
  },
  {
    accessorKey: "license_number",
    header: t("user_columns.License Number"),
  },
  {
    accessorKey: "created_at",
    header: t("user_columns.Created At"),
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return !isNaN(date.getTime())
        ? format(date, "yyyy-MM-dd HH:mm:ss")
        : t("user_columns.Invalid Date");
    },
  },
  {
    accessorKey: "updated_at",
    header: t("user_columns.Updated At"),
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return !isNaN(date.getTime())
        ? format(date, "yyyy-MM-dd HH:mm:ss")
        : t("user_columns.Invalid Date");
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { id } = row.original;
      const updateUser = () => {
        console.log(id);
      }
      const deleteUser = async () => {
        const response = await baseClient.delete(`/users/${id}`);
        if (response.status == 200) {
          toast(t('user_columns.Deleted Successfully'));
          window.location.reload()
        } else {
          toast(t('user_columns.Not Deleted'));
        }
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <span className="sr-only">{t("user_columns.Open menu")}</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("user_columns.Actions")}</DropdownMenuLabel>
            <DropdownMenuItem>
              <Button onClick={updateUser}>{t("user_columns.Edit")}</Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button onClick={deleteUser}>{t("user_columns.Delete")}</Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
