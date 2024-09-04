import ColumnChart from "@/components/charts/ColumnChart";
import CustomerInsightsChart from "@/components/charts/MultilineChart.tsx";
import baseClient from "@/services/apiClient";
import { BoxIcon, Calculator, Car, ChartBar, DollarSign, PersonStanding, TimerIcon, Truck } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { CiExport } from "react-icons/ci";
import { FaLocationDot } from "react-icons/fa6";
import { MdAirplaneTicket } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { GoOrganization } from "react-icons/go";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Chart from "react-apexcharts";



const Dashboard = () => {
  const [t, i18n] = useTranslation("global");
  const [stats, setStats] = useState({
    shipment: {
      pending_total: 0,
      in_transit_total: 0,
      delivered_total: 0,
      order_confirmed_total: 0,
      pickup_total: 0,
      cancelled_total: 0,
      total_shipments: 0,
    },
    total_drivers: [],
    total_transporters: [],
    bids: {
      total_bids: 0,
      total_rejected_bids: 0,
      total_accepted_bids: 0,
      total_pending_bids: 0,
      all_time_earning: 0,
      today_earning: 0,
      last_30_days_earning: 0,
      last_week_earning: 0,
    },
    stats: {
      total_drivers: 0,
      total_transporters: 0,
      total_customers: 0
    }
  });

  const [transporter_stats, setTransporterStats] = useState({
    total_vehicles:5,
    total_drivers:3,
    bids: {
      total_bids: 0,
      total_rejected_bids: 10,
      total_accepted_bids: 5,
      total_pending_bids: 4,
      all_time_earning: 0,
      today_earning: 0,
      last_30_days_earning: 0,
      last_week_earning: 0,
    }
  });

  const users_by_percentage = {
    options: {
      series: [stats?.stats?.total_drivers, stats?.stats?.total_transporters, stats?.stats?.total_customers],
      labels: ['Drivers', 'Transporters', 'Customers']
    },
  };

  const admin_earning = {
    options: {
      series: [{
        name: 'series1',
        data: [31, 40, 28, 51, 42, 109, 100]
      }, {
        name: 'series2',
        data: [11, 32, 45, 32, 34, 52, 41]
      }],
      chart: {
        height: 350,
        type: 'area'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        type: 'datetime',
        categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        },
      },
    },


  };


  async function getData(url: string) {
    try {
      const response = await baseClient.get(url);
      return response.data;
    } catch (exp) {
      console.error("Error fetching data:", exp);
      return [];
    }
  }


  const current_user = JSON.parse(localStorage.getItem("user"));


  let endpoint = "";
  switch (current_user?.role) {
    case "Admin":
      endpoint = "dashboard/statistics";
      break;
    case "Driver":
      endpoint = "dashboard/driver/bids/" + current_user?.id;
      break;
    default:
      endpoint = `dashboard/statistics/${current_user?.id}`;
      break;
  }

  useEffect(() => {
    async function fetchData() {
      const data = await getData(endpoint);
      setStats(data);
    }
    fetchData();
  }, [endpoint]);

  // stats data
  useEffect(() => {
    baseClient.get("dashboard/statistics/users").then((data) => {
      console.log("received_data : ", data);
    })
  }, []);

  let shipments_stats_for_admin = {
    options: {
      series: [0, 0, 0, 0, 0],
      labels: ['Pending', 'Confirmed', 'Pickup', 'In Transit', 'Delivered']
    },
  };

  let shipments_stats_for_customer = {
    options: {
      series: [0, 0, 0, 0, 0],
      labels: ['Pending', 'Confirmed', 'Pickup', 'In Transit', 'Delivered']
    },
  };
  let bids_stats_for_driver = {
    options: {
      series: [0, 0, 0],
      labels: ['Accepted bids', 'Pending bids', 'Rejected bids']
    },
  };
  let bids_stats_for_transporter = {
    options: {
      series: [0, 0, 0],
      labels: ['Accepted bids', 'Pending bids', 'Rejected bids']
    },
  };

  const metrics = [];
  const smallMetrics = [];
  switch (current_user?.role) {
    case "Customer":
      shipments_stats_for_customer = {
        options: {
          series: [stats?.shipment?.pending_total, stats?.shipment?.order_confirmed_total, stats?.shipment?.pickup_total, stats?.shipment?.in_transit_total, stats?.shipment?.delivered_total],
          labels: ['Pending', 'Confirmed', 'Pickup', 'In Transit', 'Delivered']
        },
      };
      metrics.push(
        {
          id: 2,
          title: <>{t("dashboard.Total Shipments")}</>,
          value: stats?.shipment?.total_shipments,
          icon: <Truck className="text-white " />,
          change: "",
          bg: "bg-black bg-opacity-25",
          icon_bg: "bg-black bg-opacity-25",
        },
        {
          id: 3,
          title: <>{t("dashboard.Completed Shipments")}</>,
          value: stats?.shipment?.delivered_total,
          icon: <BoxIcon className="text-white " />,
          change: "",
          bg: "bg-black bg-opacity-25",
          icon_bg: "bg-black bg-opacity-25",
        },
        {
          id: 4,
          title: <>{t("dashboard.Pending Shipments")}</>,
          value: stats?.shipment?.pending_total,
          icon: <TimerIcon className="text-white " />,
          change: "",
          bg: "bg-black bg-opacity-25",
          icon_bg: "bg-black bg-opacity-25",
        },
        {
          id: 5,
          title: <>{t("dashboard.In Progress shipments")}</>,
          value: stats?.shipment?.in_transit_total,
          icon: <TimerIcon className="text-white " />,
          change: "",
          bg: "bg-black bg-opacity-25",
          icon_bg: "bg-black bg-opacity-25",
        },
        {
          id: 6,
          title: <>{t("dashboard.Cancelled shipments")}</>,
          value: stats?.shipment?.cancelled_total,
          icon: <TimerIcon className="text-white " />,
          change: "",
          bg: "bg-black bg-opacity-25",
          icon_bg: "bg-black bg-opacity-25",
        }
      );
      break;
    case "Transporter":
      metrics.push(
        {
          id: 1,
          title: <>{t("dashboard.Total Drivers")}</>,
          value: transporter_stats?.total_drivers,
          icon: <Truck className="text-white " />,
          change: "",
          bg: "bg-black bg-opacity-25",
          icon_bg: "bg-black bg-opacity-25",
        },
        {
          id: 1,
          title: <>{t("dashboard.Total Vehicles")}</>,
          value: transporter_stats?.total_vehicles,
          icon: <Truck className="text-white " />,
          change: "",
          bg: "bg-black bg-opacity-25",
          icon_bg: "bg-black bg-opacity-25",
        },
        {
          id: 1,
          title: <>{t("dashboard.Today Earning")}</>,
          value: transporter_stats?.bids?.today_earning,
          icon: <Truck className="text-white " />,
          change: "",
          bg: "bg-black bg-opacity-25",
          icon_bg: "bg-black bg-opacity-25",
        },
        {
          id: 1,
          title: <>{t("dashboard.Last Week Earning")}</>,
          value: transporter_stats?.bids?.last_week_earning,
          icon: <Truck className="text-white " />,
          change: "",
          bg: "bg-black bg-opacity-25",
          icon_bg: "bg-black bg-opacity-25",
        },
        {
          id: 1,
          title: <>{t("dashboard.Last Month Earning")}</>,
          value: transporter_stats?.bids?.last_30_days_earning,
          icon: <Truck className="text-white " />,
          change: "",
          bg: "bg-black bg-opacity-25",
          icon_bg: "bg-black bg-opacity-25",
        },
        {
          id: 1,
          title: <>{t("dashboard.Total Earning")}</>,
          value: transporter_stats?.bids?.all_time_earning,
          icon: <Truck className="text-white " />,
          change: "",
          bg: "bg-black bg-opacity-25",
          icon_bg: "bg-black bg-opacity-25",
        },
        {
          id: 2,
          title: <>{t("dashboard.Total Bids")}</>,
          value: transporter_stats?.bids?.total_bids,
          icon: <Truck className="text-white " />,
          change: "",
          bg: "bg-black bg-opacity-25",
          icon_bg: "bg-black bg-opacity-25",
        },
        {
          id: 3,
          title: <>{t("dashboard.Accepted Bids")}</>,
          value: transporter_stats?.bids?.total_accepted_bids,
          icon: <BoxIcon className="text-white " />,
          change: "",
          bg: "bg-black bg-opacity-25",
          icon_bg: "bg-black bg-opacity-25",
        },
        {
          id: 4,
          title: <>{t("dashboard.Pending Bids")}</>,
          value: transporter_stats?.bids?.total_pending_bids,
          icon: <TimerIcon className="text-white " />,
          change: "",
          bg: "bg-black bg-opacity-25",
          icon_bg: "bg-black bg-opacity-25",
        },
        {
          id: 5,
          title: <>{t("dashboard.Rejected Bids")}</>,
          value: transporter_stats?.bids?.total_rejected_bids,
          icon: <TimerIcon className="text-white " />,
          change: "",
          bg: "bg-black bg-opacity-25",
          icon_bg: "bg-black bg-opacity-25",
        }
      );

      bids_stats_for_transporter = {
        options: {
          series: [transporter_stats?.bids?.total_accepted_bids, transporter_stats?.bids?.total_pending_bids, transporter_stats?.bids?.total_rejected_bids],
          labels: ['Accepted bids', 'Pending bids', 'Rejected bids']
        },
      };

      break;
    case "Driver":
      bids_stats_for_driver = {
        options: {
          series: [stats?.bids?.total_accepted_bids, stats?.bids?.total_pending_bids, stats?.bids?.total_rejected_bids],
          labels: ['Accepted bids', 'Pending bids', 'Rejected bids']
        },
      };

      metrics.push(
        {
          id: 1,
          title: <>{t("dashboard.Today Earning")}</>,
          value: stats?.bids?.today_earning,
          icon: <Truck className="text-white " />,
          change: "",
          bg: "bg-black bg-opacity-25",
          icon_bg: "bg-black bg-opacity-25",
        },
        {
          id: 1,
          title: <>{t("dashboard.Last Week Earning")}</>,
          value: stats?.bids?.last_week_earning,
          icon: <Truck className="text-white " />,
          change: "",
          bg: "bg-black bg-opacity-25",
          icon_bg: "bg-black bg-opacity-25",
        },
        {
          id: 1,
          title: <>{t("dashboard.Last Month Earning")}</>,
          value: stats?.bids?.last_30_days_earning,
          icon: <Truck className="text-white " />,
          change: "",
          bg: "bg-black bg-opacity-25",
          icon_bg: "bg-black bg-opacity-25",
        },
        {
          id: 1,
          title: <>{t("dashboard.Total Earning")}</>,
          value: stats?.bids?.all_time_earning,
          icon: <Truck className="text-white " />,
          change: "",
          bg: "bg-black bg-opacity-25",
          icon_bg: "bg-black bg-opacity-25",
        },
        {
          id: 2,
          title: <>{t("dashboard.Total Bids")}</>,
          value: stats?.bids?.total_bids,
          icon: <Truck className="text-white " />,
          change: "",
          bg: "bg-black bg-opacity-25",
          icon_bg: "bg-black bg-opacity-25",
        },
        {
          id: 3,
          title: <>{t("dashboard.Accepted Bids")}</>,
          value: stats?.bids?.total_accepted_bids,
          icon: <BoxIcon className="text-white " />,
          change: "",
          bg: "bg-black bg-opacity-25",
          icon_bg: "bg-black bg-opacity-25",
        },
        {
          id: 4,
          title: <>{t("dashboard.Pending Bids")}</>,
          value: stats?.bids?.total_pending_bids,
          icon: <TimerIcon className="text-white " />,
          change: "",
          bg: "bg-black bg-opacity-25",
          icon_bg: "bg-black bg-opacity-25",
        },
        {
          id: 5,
          title: <>{t("dashboard.Rejected Bids")}</>,
          value: stats?.bids?.total_rejected_bids,
          icon: <TimerIcon className="text-white " />,
          change: "",
          bg: "bg-black bg-opacity-25",
          icon_bg: "bg-black bg-opacity-25",
        }
      );
      break;
    case "Admin":
      smallMetrics.push(
        {
          id: 1,
          title: <>{t("dashboard.Total Drivers")}</>,
          value: stats?.stats?.total_drivers,
          icon: <Car className="text-xl font-bold text-gray-200 " />,
          change: "",
          bg: "bg-black bg-opacity-25",
        },
        {
          id: 2,
          title: <>{t("dashboard.Total Transporters")}</>,
          value: stats?.stats?.total_transporters,
          icon: <GoOrganization className="text-xl font-bold text-gray-200 " />,
          change: "",
          bg: "bg-black bg-opacity-25",
        },
        {
          id: 3,
          title: <>{t("dashboard.Total Customers")}</>,
          value: stats?.stats?.total_customers,
          icon: <PersonStanding className="text-xl font-bold text-gray-200 " />,
          change: "",
          bg: "bg-black bg-opacity-25",

        },
        {
          id: 4,
          title: <>{t("dashboard.Today Revenue")}</>,
          value: 120,
          icon: <DollarSign className="text-xl font-bold text-gray-200 " />,
          change: "",
          bg: "bg-black bg-opacity-25",
        }
      );

      shipments_stats_for_admin = {
        options: {
          series: [stats?.shipment?.pending_total, stats?.shipment?.order_confirmed_total, stats?.shipment?.pickup_total, stats?.shipment?.in_transit_total, stats?.shipment?.delivered_total],
          labels: ['Pending', 'Confirmed', 'Pickup', 'In Transit', 'Delivered']
        },
      };

      metrics.push(
        {
          id: 1,
          title: <>{t("dashboard.Total Revenue")}</>,
          value: 12,
          icon: <ChartBar className="text-white " />,
          change: "",
          bg: "bg-black bg-opacity-25",
          icon_bg: "bg-black-500",
        },
        {
          id: 2,
          title: <>{t("dashboard.Total Shipments")}</>,
          value: stats?.shipment?.total_shipments,
          icon: <Truck className="text-white " />,
          change: "",
          bg: "bg-black bg-opacity-25",
          icon_bg: "bg-yellow-500",
        },
        {
          id: 3,
          title: <>{t("dashboard.Completed Shipments")}</>,
          value: stats?.shipment?.delivered_total,
          icon: <BoxIcon className="text-white " />,
          change: "",
          bg: "bg-black bg-opacity-25",
          icon_bg: "bg-green-500",
        },
        {
          id: 4,
          title: <>{t("dashboard.Pending Shipments")}</>,
          value: stats?.shipment?.pending_total,
          icon: <TimerIcon className="text-white " />,
          change: "",
          bg: "bg-black bg-opacity-25",
          icon_bg: "bg-purple-500",
        },
        {
          id: 5,
          title: <>{t("dashboard.In Progress shipments")}</>,
          value: stats?.shipment?.in_transit_total,
          icon: <TimerIcon className="text-white " />,
          change: "",
          bg: "bg-black bg-opacity-25",
          icon_bg: "bg-purple-500",
        },
        {
          id: 6,
          title: <>{t("dashboard.Cancelled shipments")}</>,
          value: stats?.shipment?.cancelled_total,
          icon: <TimerIcon className="text-white " />,
          change: "",
          bg: "bg-black bg-opacity-25",
          icon_bg: "bg-purple-500",
        }
      );
      break;

    default:
      break;
  }

  return (
    <div className="flex flex-col md:pl-[66px] sm:pl-0">
      <div className="flex flex-col flex-wrap md:flex-row">
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between w-full">
            {/* Dashboard top Section */}
            <div className="flex justify-between w-full px-4">
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-gray-300 ">{t("dashboard.Today's Board")}</h1>
                <p className="mt-2 text-sm text-gray-300">{t("dashboard.Summary")}</p>
              </div>
              <button className="flex items-center self-center gap-2 px-3 py-2 bg-transparent border rounded-md">
                <span className="order-1 font-semibold">{t("dashboard.Export")}</span>
                <CiExport />
              </button>
            </div>
          </div>
          {/* Dashboard Boxes */}
          <div className="flex flex-col  items-start w-full xl:flex-row">
            <div className="grid grid-cols-2 sm:flex flex-wrap w-full px-3 mt-6 xl:w-[70%]">
              {metrics.map((metric) => (
                <div
                  key={metric.id}
                  className={twMerge(
                    "flex flex-col p-2 md:p-4 md:pb-2 md:pt-6 w-full sm:w-[160px] ml-[1px] mb-[10px]  md:w-[320px] shadow-md",
                    metric.bg
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-gray-200">
                      {metric.value}
                    </p>
                    <div
                      className={twMerge(
                        "w-fit rounded-full",
                      )}
                    >
                      {metric.icon}
                    </div>
                  </div>
                  <div className="w-full h-[4px] mt-8 mb-2 bg-gray-400">
                    <div className="h-[100%] bg-white w-[65%]"></div>
                  </div>
                  <div className="flex flex-col gap-1 mt-2 md:gap-4">

                    <p className="font-normal text-gray-100">{metric.title}</p>
                    <p className="text-xs font-semibold text-blue-500">
                      {metric.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full xl:w-[30%] flex flex-col">
              <div className="grid xl:grid-cols-2 gap-[2px] sm:grid-cols-4 xs:grid-cols-2 grid-cols-1  mt-6 px-3 sm:mr-1">
                {
                  smallMetrics.map((metric) => (
                    <div key={metric.title} className={twMerge(
                      "flex items-center justify-between w-full px-3 py-3 rounded-sm shadow",
                      metric.bg
                    )}>
                      <div className="flex flex-col ">
                        <h1 className="text-base text-gray-100 font-semibold">{metric.title}</h1>
                        <p className="mt-2 text-x text-gray-100 font-bold">{metric.value}</p>
                      </div>
                      {metric.icon}
                    </div>
                  ))
                }

              </div>
              <div className="grid grid-cols-3  p-4">
                <Link to='/rate-calculator' className="flex ml-[1px] flex-col p-4 items-center text-center shadow  bg-black bg-opacity-25 rounded" >
                  <Calculator size={30} className="text-xl text-white font-bold  bg-black bg-opacity-25 p-2 rounded-full h-10 w-10" />
                  <p className="text-sm  text-gray-100  font-semibold mt-2">{t("dashboard.Rate Calculator")}</p>
                </Link>
                <Link to='/support-ticket' className="flex ml-[1px] flex-col p-4 items-center text-center shadow bg-black bg-opacity-25 rounded " >
                  <MdAirplaneTicket size={30} className="text-xl text-white font-bold  bg-black bg-opacity-25 p-2 rounded-full h-10 w-10" />
                  <p className="text-sm  text-gray-100  font-semibold mt-2">{t("dashboard.Create a Ticket")}</p>
                </Link>
                <Link to='/track-shipment' className="flex ml-[1px] flex-col p-4 items-center text-center shadow  bg-black bg-opacity-25 rounded" >
                  <FaLocationDot size={30} className="text-xl text-white font-bold  bg-black bg-opacity-25 p-2 rounded-full h-10 w-10" />
                  <p className="text-sm  text-gray-100 font-semibold mt-2">{t("dashboard.Track shipment")}</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap">
        {current_user?.role == "Admin" && (
          <>
            {/* <ColumnChart
              total_transporters={stats?.total_transporters}
              total_drivers={stats?.total_transporters}
            />
            <CustomerInsightsChart /> */}

            <div className="w-full grid-flow-row grid gap-3 px-3 my-5 md:grid-cols-3 sm:grid-cols-2  grid-cols-1">

              <div className="donut bg-white bg-opacity-10 rounded">
                <Chart
                  options={users_by_percentage.options}
                  series={users_by_percentage.options.series}
                  type="donut"
                  title="Users"
                  width="100%"
                  height="auto"
                />
              </div>

              <div className="donut bg-white bg-opacity-10 rounded">
                <Chart
                  options={shipments_stats_for_admin.options}
                  series={shipments_stats_for_admin.options.series}
                  title="Shipments"
                  type="donut"
                  width="100%"
                />
              </div>
              <div className="donut bg-white bg-opacity-10 rounded">
                <Chart
                  // @ts-ignore
                  options={admin_earning.options}
                  series={admin_earning.options.series}
                  title="Admin Earning"
                  type="area"
                  width="100%"
                />
              </div>

            </div>
          </>
        )}

        {/* customer charts */}

        {current_user?.role == "Customer" && (
          <>
            <div className="w-full grid grid-cols-4 gap-3 px-3 my-5">

              <div className="donut bg-white bg-opacity-10 rounded">
                <Chart
                  options={shipments_stats_for_customer.options}
                  series={shipments_stats_for_customer.options.series}
                  type="donut"
                  title="Shipments Statistics"
                  width="100%"
                  height="auto"
                />
              </div>

            </div>
          </>
        )}

        {/* Driver charts */}
        {current_user?.role == "Driver" && (
          <>
            <div className="w-full grid grid-cols-4 gap-3 px-3 my-5">

              <div className="donut bg-white bg-opacity-10 rounded">
                <Chart
                  options={bids_stats_for_driver.options}
                  series={bids_stats_for_driver.options.series}
                  type="donut"
                  title="Bids Statistics"
                  width="100%"
                  height="auto"
                />
              </div>

            </div>
          </>
        )}

        {/* Transporter charts */}
        {current_user?.role == "Transporter" && (
          <>
            <div className="w-full grid grid-cols-4 gap-3 px-3 my-5">

              <div className="donut bg-white bg-opacity-10 rounded">
                <Chart
                  options={bids_stats_for_transporter.options}
                  series={bids_stats_for_transporter.options.series}
                  type="donut"
                  title="Bids Statistics"
                  width="100%"
                  height="auto"
                />
              </div>

            </div>
          </>
        )}


      </div>
    </div>
  );
};

export default Dashboard;
