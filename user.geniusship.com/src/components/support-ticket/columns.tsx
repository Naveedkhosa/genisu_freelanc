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
import baseClient from '@/services/apiClient';
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

export const getSupportTicketColumns = (t:any) => [
  {
    accessorKey: "id",
    header: t("support_ticket.ID"),
  },
  {
    accessorKey: "user",
    header: t("support_ticket.User"),
  },
  {
    accessorKey: "subject",
    header: t("support_ticket.Subject"),
    cell: ({ row }) => {
      const value = row.original;
      return <Link to={`/support-ticket/${value.id}`} style={{ color: "blue", textDecoration: "underline"}}>{value.subject}</Link>;
    },
  },
  {
    accessorKey: "description",
    header: t("support_ticket.Description"),
  },
  {
    accessorKey: "status",
    header: t("support_ticket.Status"),
  },
  {
    accessorKey: "created_at",
    header: t("support_ticket.Created At"),
    cell: ({ getValue }) => {
      const value = getValue();
      return format(new Date(value), 'MM/dd/yyyy, p'); // Format as needed
    },
  },
  {
    accessorKey: "updated_at",
    header: t("support_ticket.Updated At"),
    cell: ({ getValue }) => {
      const value = getValue();
      return format(new Date(value), 'MM/dd/yyyy, p'); // Format as needed
    },
  },
  {
    id: "actions",
    header: t("support_ticket.Actions"),
    cell: ({ row }) => {
      const { id, status } = row.original;
      const loginedUser = JSON.parse(localStorage.getItem('user'));
      const navigate = useNavigate();

      const updateStatus = async (newStatus) => {
        const response = await baseClient.put(`/support-tickets/${id}/status`, { status: newStatus });
        if (response.status === 200) {
          toast(t(`${newStatus} Successfully`));
          window.location.reload();
        } else {
          toast(t('Failed to update status'));
        }
      };

      const deleteSupportTicket = async () => {
        const response = await baseClient.delete(`/support-tickets/${id}`);
        if (response.status === 204) {
          toast(t('support_ticket.Deleted Successfully'));
          window.location.reload();
        } else {
          toast(t('support_ticket.Not Deleted'));
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <span className="sr-only">{t("support_ticket.Open menu")}</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {loginedUser.role == 'Admin' && (
              <>
                <DropdownMenuItem><Button onClick={() => updateStatus('open')} disabled={status === "Open"}>{t('support_ticket.Open')}</Button></DropdownMenuItem>
                <DropdownMenuItem><Button onClick={() => updateStatus('resolved')} disabled={status === 'Resolved'}>{t('support_ticket.Resolved')}</Button></DropdownMenuItem>
                <DropdownMenuItem><Button onClick={() => updateStatus('closed')} disabled={status === 'Closed'}>{t('support_ticket.Closed')}</Button></DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem><Button onClick={deleteSupportTicket}>{t('support_ticket.Delete')}</Button></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
