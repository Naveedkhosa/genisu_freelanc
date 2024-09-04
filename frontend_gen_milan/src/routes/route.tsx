import Root from "@/layouts/Root";
import Dashboard from "@/pages/Dashboard";
import FeedBackPage from "@/pages/Feedback";
import EarningPage from "@/pages/Earning";
import InvoicePage from "@/pages/Invoice";
import { LoginPage } from "@/pages/login";
import Route from "@/pages/Route";
import Shipment from "@/pages/Shipment";
import SupportTicketPage from "@/pages/SupportTicket";
import UserPage from "@/pages/User";
import VehicleMangement from "@/pages/VehicleMangement";
import { createBrowserRouter } from "react-router-dom";
import LiveLocation from "@/pages/LiveLocation";
import MyRequest from "@/pages/MyRequest";
import RateCalculator from "@/pages/RateCalculator";
import RequestListPage from "@/pages/RequestList";
import PaymentPage from "@/pages/Payment";
import WalletPage from "@/pages/Wallet";
import Checkout from "@/pages/Checkout";
import Success from "@/pages/Success";
import Failure from "@/pages/Failure";
import { SignUp } from "@/pages/Sign-up";
import TrackShipment from "@/pages/TrackShipment";
import ShipmentTracking from "@/pages/ShipmentTracking";
import NavigateShipment from "@/pages/NavigateShipment";
import { CreateRequest } from "@/pages/CreateRequest";
import RequestListDetailAndBids from "@/pages/RequestListDetailAndBids";
import SupportTicketOpening from "@/pages/SupportTicketOpening";
import ChatBot from "@/pages/ChatBot";
import PackageType from "@/pages/PackageType";
import TruckType from "@/pages/TruckType";
import TruckBodyType from "@/pages/TruckBodyType";
import ShippingInvoice from "@/pages/ShippingInvoice";
import Home from "@/pages/Home";
import NewShipment from "@/pages/NewShipment";
import NewShipmentDetailsPage from "@/pages/NewShipmentDetail";


const router = createBrowserRouter([
    {
        path: "/auth",
        children: [
            {
                path: "/auth/login",
                element: <LoginPage />,
            },
            {
                path: "/auth/signupp",
                element: <SignUp />
            },
        ]
    },
    {
        path: '/home',
        element: <Home />
    },
    {
        path: "/",
        element: <Root />,
        //   errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                path: '/dashboard',
                element: <Dashboard />
            },
            {
                path: "/shipment",
                element: <Shipment />
            },
            {
                path: "/rate-calculator",
                element: <RateCalculator />
            },
            {
                path: "/create-request",
                element: <CreateRequest />
            },
            {
                path: "/track-shipment/:tid",
                element: <TrackShipment />
            },
            {
                path: "/new-shipment",
                element: <NewShipment />
            },
            {
                path: "/new-shipment/:id",
                element: <NewShipmentDetailsPage shipment={null}  />
            },
            {
                path: "/shipping-invoice",
                element: <ShippingInvoice />
            },
            {
                path: "/track-shipment",
                element: <ShipmentTracking />
            },
            {
                path: "/navigate/shipment/:tid",
                element: <NavigateShipment />
            },
            {
                path: "/vehicle",
                element: <VehicleMangement />
            },
            {
                path: 'types',
                children: [
                    {
                        path: "/types/package-type",
                        element: <PackageType />
                    },
                    {
                        path: "/types/truck-type",
                        element: <TruckType />
                    },
                    {
                        path: "/types/truck-body-type",
                        element: <TruckBodyType />
                    }
                ]
            },
            {
                path: "/route",
                element: <Route />
            },
            {
                path: "/feedback",
                element: <FeedBackPage />
            },
            {
                path: "/wallet",
                element: <WalletPage />
            },

            {
                path: "/invoice",
                element: <InvoicePage />
            },
            {
                path: "/earning",
                element: <EarningPage />
            },
            {
                path: "/payment",
                element: <PaymentPage />
            },
            {
                path: "/checkout/:id",
                element: <Checkout />
            },
            {
                path: "/success",
                element: <Success />
            },
            {
                path: "/failure",
                element: <Failure />
            },
            {
                path: "/live-location",
                element: <LiveLocation />
            },
            {
                path: "/live-chat",
                element: <ChatBot />
            },
            {
                path: "/my-request/:id",
                element: <MyRequest />,
            },
            {
                path: "/request-list",
                element: <RequestListPage />,

            },
            {
                path: "request-list/:id",
                element: <RequestListDetailAndBids />,
            },
            {
                path: "/support-ticket",
                element: <SupportTicketPage />
            },
            {
                path: "/support-ticket/:id",
                element: <SupportTicketOpening />
            },
            {
                path: "/user/",
                children: [
                    {
                        path: ':type',
                        element: <UserPage />
                    }
                ]
            },
        ]
    },
]);

export default router