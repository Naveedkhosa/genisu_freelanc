import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";

const Root = () => {
    return (
        <div className="flex max-w-screen w-full bg_img">
            <Sidebar />
            <div className="flex flex-col w-full">
                <Header />
                <Outlet/>
                <Toaster />
            </div>
        </div>
    );
};

export default Root;
