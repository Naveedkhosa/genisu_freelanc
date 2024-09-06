"use client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { app_url } from "@/services/apiClient";
import baseClient from "@/services/apiClient";

const user = localStorage.getItem("user");
const current_user = user ? JSON.parse(user) : null;

export type Shipment = {
  shipment_id: string;
  tracking_number: string;
  customer_name: string;
  pickup_address: string;
  destination_address: string;
  expected_price: string;
  total_bids: number;
  created_at: string;
  updated_at: string;
};

const updateStatus = (shipment_id: any, shipment_status: any) => {
  baseClient.post('shipment/update', {
    id: shipment_id,
    status: shipment_status
  }).then((response) => {
    console.log(response);
  }).catch((error) => {
    console.log(error);
  })
};

export const getShipmentColumns = (t) => {
  var shipmentColumns: ColumnDef<Shipment>[] = [];

  if (current_user?.role === "Driver" || current_user?.role === "Transporter") {
    shipmentColumns.push(
      {
        accessorKey: "shipment_id",
        header: t("shipment_columns.ID"),
      },
      {
        header: t("shipment_columns.Navigate"),
        cell: ({ row }) => {
          const status = row.getValue<string>("status");
          const tracking_number = row.getValue<string>("tracking_number");
          if (status !== 'pending' && status !== "completed") {
            return (
              <Link className="text-gray-100 px-3 h-[30px] flex items-center justify-center rounded border border-blue-500 whitespace-nowrap hover:bg-blue-500 hover:text-white" to={`${app_url}navigate/shipment/${tracking_number}`}>
                {t("shipment_columns.Start Navigating")}
              </Link>
            );
          } else {
            return (
              <p className="text-gray-100 text-sm">........</p>
            );
          }
        }
      },
      {
        accessorKey: "tracking_number",
        header: t("shipment_columns.Tracking Number"),
      },
      {
        accessorKey: "customer_name",
        header: t("shipment_columns.Customer"),
      },
      {
        accessorKey: "pickup_address",
        header: t("shipment_columns.Origin"),
      },
      {
        accessorKey: "destination_address",
        header: t("shipment_columns.Destination"),
      },
      {
        accessorKey: "fare",
        header: t("shipment_columns.Fare"),
      },
      {
        accessorKey: "status",
        header: t("shipment_columns.Status"),
        cell: ({ row }) => {
          const status = row.getValue<string>("status");
          return (
            <>
              {status === "pending" ? (
                <div className="text-red-600 ">
                  {t("shipment_columns.Pending")}
                </div>
              ) : (
                <>
                  {status}
                </>
              )}
            </>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: t("shipment_columns.Created At"),
        cell: ({ getValue }) => {
          const value = getValue<string>();
          return format(new Date(value), "MM/dd/yyyy, p"); // Format as needed
        },
      },
      {
        accessorKey: "updated_at",
        header: t("shipment_columns.Updated At"),
        cell: ({ getValue }) => {
          const value = getValue<string>();
          return format(new Date(value), "MM/dd/yyyy, p"); // Format as needed
        },
      },
      {
        accessorKey: "chat_room",
        header: "Chat",
        cell: ({ row }) => {
          const chat_room = row.getValue<string>("chat_room");
          return chat_room == "N/A" ? null : (
            <Link to={`${app_url}chat/${chat_room}`} style={{color:"black",width:"100%",backgroundColor:"white"}} className="px-4 py-2 rounded-xl">
              Chat
            </Link>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const shipment_id = row.getValue<string>("shipment_id");
          const status = row.getValue<string>("status");

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">{t("shipment_columns.Actions")}</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t("shipment_columns.Actions")}</DropdownMenuLabel>
                {status === "order_confirmed" && (
                  <DropdownMenuItem onClick={() => updateStatus(shipment_id, 'pickup')}>
                    {t("shipment_columns.Going For Pickup")}
                  </DropdownMenuItem>
                )}
                {status === "pickup" && (
                  <DropdownMenuItem onClick={() => updateStatus(shipment_id, 'in_transit')}>
                    {t("shipment_columns.In Transit")}
                  </DropdownMenuItem>
                )}
                {status === "in_transit" && (
                  <DropdownMenuItem onClick={() => updateStatus(shipment_id, 'delivered')}>
                    {t("shipment_columns.Delivered")}
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      }
    );
  } else {
    shipmentColumns.push(
      {
        accessorKey: "shipment_id",
        header: t("shipment_columns.ID"),
      },
      {
        accessorKey: "tracking_number",
        header: t("shipment_columns.Tracking Number"),
        cell: ({ row }) => {
          const status = row.getValue<string>("status");
          const tracking_number = row.getValue<string>("tracking_number");

          if (status !== "pending") {
            return (
              <Link className="text-gray-200" to={`${app_url}track-shipment/${tracking_number}`}>{tracking_number}</Link>
            );
          } else {
            return (
              <>
                {tracking_number}
              </>
            );
          }
        }
      },
      {
        accessorKey: "customer_name",
        header: t("shipment_columns.Customer"),
      },
      {
        accessorKey: "pickup_address",
        header: t("shipment_columns.Origin"),
      },
      {
        accessorKey: "destination_address",
        header: t("shipment_columns.Destination"),
      },
      {
        accessorKey: "expected_price",
        header: t("shipment_columns.Expected Price"),
      },
      {
        accessorKey: "total_bids",
        header: t("shipment_columns.Bids"),
        cell: ({ row }) => {
          const total_bids = row.getValue<string>("total_bids");
          const shipment_id = row.getValue<string>("shipment_id");
          return (
            <Link to={`${app_url}my-request/${shipment_id}`} className="bg-green-600 text-white rounded-sm px-2 py-1 text-nowrap cursor-pointer">
              {total_bids} {t("shipment_columns.Bids")}
            </Link>
          );
        }
      },
      {
        accessorKey: "status",
        header: t("shipment_columns.Status"),
        cell: ({ row }) => {
          const status = row.getValue<string>("status");
          return (
            <>
              {status === "pending" ? (
                <div className="bg-red-600 py-1 px-2 text-nowrap text-white rounded-sm">
                  {t("shipment_columns.Pending")}
                </div>
              ) : (
                <>
                 <div className="bg-green-600 py-1 px-2 text-nowrap text-white rounded-sm">
                  {status}
                </div>
                </>
              )}
            </>
          );
        },
      },

      {
        accessorKey: "created_at",
        header: t("shipment_columns.Created At"),
        cell: ({ getValue }) => {
          const value = getValue<string>();
          return format(new Date(value), "MM/dd/yyyy, p"); // Format as needed
        },
      },
      {
        accessorKey: "updated_at",
        header: t("shipment_columns.Updated At"),
        cell: ({ getValue }) => {
          const value = getValue<string>();
          return format(new Date(value), "MM/dd/yyyy, p"); // Format as needed
        },
      },
      {
        accessorKey: "chat_room",
        header: "Chat",
        cell: ({ row }) => {
          const chat_room = row.getValue<string>("chat_room");
          return chat_room == "N/A" ? null : (
            <Link to={`${app_url}chat/${chat_room}`} style={{color:"black",width:"100%",backgroundColor:"white"}} className="px-4 py-2 rounded-xl">
              Chat
            </Link>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const payment = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">{t("shipment_columns.Actions")}</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t("shipment_columns.Actions")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>{t("shipment_columns.View customer")}</DropdownMenuItem>
                <DropdownMenuItem>{t("shipment_columns.View payment details")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      }
    );

    // insert column for feedback button

    // insert column for feedback button

    const index = 8; // Position where you want to add the feedback column
    const newShipmentColumns = [
      ...shipmentColumns.slice(0, index),
      {
        header: "Leave Feedback",
        cell: ({ row }) => {
          const status = row?.original?.status;
          if (status == "delivered") {
            return (
              <Link
                to={`${app_url}feedback/${row?.original?.shipment_id}`}
                className="bg-yellow-500 hover:underline py-1 px-3 text-nowrap text-white rounded-sm"
              >
                Leave Feedback
              </Link>
            );
          } else {
            return (
              <>---</>
            )
          }
        },
      },
      ...shipmentColumns.slice(index),
    ];
    shipmentColumns = newShipmentColumns;

  }

  return shipmentColumns;
};
