import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";  // Import useTranslation
import {
  ChevronDown,
  ChevronRight,
  Car,
  SidebarCloseIcon,
  List,
  DollarSign,
  Package2,
} from "lucide-react";
import {
  FaTachometerAlt,
  FaShoppingCart,
  FaRocket,
  FaQuestionCircle,
  FaUsers,
  FaMinus,
  FaLocationArrow,
  FaCalculator,
  FaFirstOrder,
  FaHome,
} from "react-icons/fa";
import { GoLocation } from "react-icons/go";
import { MdSpatialTracking } from "react-icons/md";
import { FaDashcube, FaLocationPin, FaLocationPinLock, FaMapLocationDot, FaMessage, FaRegMessage } from "react-icons/fa6";
import useSidebarStore from "@/store/showside";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { t, i18n } = useTranslation("global"); // Initialize useTranslation
  const [expandedItems, setExpandedItems] = useState({});
  const { isVisible, toggleSidebar, hideSidebar, showSidebar } = useSidebarStore();
  const navigate = useNavigate();

  const current_user = JSON.parse(localStorage.getItem("user"));
  console.log(current_user?.role);

  let menuItems = [];

  switch (current_user?.role) {
    case "Admin":
      menuItems = [
        {
          icon: <FaTachometerAlt className="text-xl text-primary-400 group-hover:text-white" />,
          text: t("sidebar.Dashboard"), // Use translation
          link: "/dashboard",
          isChild: false,
        },
        {
          icon: <FaUsers className="text-xl text-primary-400 group-hover:text-white" />,
          text: t("sidebar.Users"), // Use translation
          link: "#",
          isChild: false,
          children: [
            {
              text: t("sidebar.Customers"), // Use translation
              link: "/user/customers",
              isChild: true,
            },
            {
              text: t("sidebar.Transporter"), // Use translation
              link: "/user/transporter",
              isChild: true,
            },
            {
              text: t("sidebar.Drivers"), // Use translation
              link: "/user/driver",
              isChild: true,
            },
          ],
        },
        {
          icon: <Package2 className="text-xl text-primary-400 group-hover:text-white" />,
          text: t("sidebar.Types"), // Use translation
          link: "#",
          isChild: false,
          children: [
            {
              text: t("sidebar.Package Type"), // Use translation
              link: "/types/package-type",
              isChild: true,
            },
            {
              text: t("sidebar.Truck Type"), // Use translation
              link: "/types/truck-type",
              isChild: true,
            },
            {
              text: t("sidebar.Truck Body Type"), // Use translation
              link: "/types/truck-body-type",
              isChild: true,
            },
          ],
        },
        {
          icon: <GoLocation className="text-xl text-primary-400 group-hover:text-white" />,
          text: t("sidebar.Live Location"), // Use translation
          link: "/live-location",
          isChild: false,
        },
        {
          icon: <FaShoppingCart className="text-xl text-primary-400 group-hover:text-white" />,
          text: t("sidebar.Shipment"), // Use translation
          link: "/shipment",
          isChild: false,
        },
        {
          icon: <MdSpatialTracking className="text-xl text-primary-400 group-hover:text-white" />,
          text: t("sidebar.Track Shipment"), // Use translation
          link: "/track-shipment",
          isChild: false,
        },
        {
          icon: <DollarSign className="text-xl text-primary-400 group-hover:text-white" />,
          text: t("sidebar.Payments"), // Use translation
          link: "/payment",
          isChild: false,
        },
        {
          icon: <Car className="text-xl text-primary-400 group-hover:text-white" />,
          text: t("sidebar.Vehicle"), // Use translation
          link: "/vehicle",
          isChild: false,
        },
        {
          icon: <FaQuestionCircle className="text-xl text-primary-400 group-hover:text-white" />,
          text: t("sidebar.Support Tickets"), // Use translation
          link: "/support-ticket",
          isChild: false,
        },
      ];
      break;
    case "Customer":
      menuItems = [
        {
          icon: <FaHome className="text-xl text-primary-400 group-hover:text-white" />,
          text: t("sidebar.Dashboard"), // Use translation
          link: "/dashboard",
          isChild: false,
        },
        {
          icon: <FaFirstOrder className="text-xl text-primary-400 group-hover:text-white" />,
          text: t("sidebar.Shipment"), // Use translation
          link: "/shipment",
          isChild: false,
        },
        {
          icon: <FaFirstOrder className="text-xl text-primary-400 group-hover:text-white" />,
          text: t("New Shipment"), // Use translation
          link: "/new-shipment",
          isChild: false,
        },

        {
          icon: <FaRegMessage className="text-xl text-primary-400 group-hover:text-white" />,
          text: t("sidebar.Live Support"), // Use translation
          link: "/live-chat",
          isChild: false,
        },
        {
          icon: <FaCalculator className="text-xl text-primary-400 group-hover:text-white" />,
          text: t("dashboard.Rate Calculator"), // Use translation
          link: "/rate-calculator",
          isChild: false,
        },
        {
          icon: <FaMapLocationDot className="text-xl text-primary-400 group-hover:text-white" />,
          text: t("sidebar.Track Shipment"), // Use translation
          link: "/track-shipment",
          isChild: false,
        },
        {
          icon: <FaQuestionCircle className="text-xl text-primary-400 group-hover:text-white" />,
          text: t("sidebar.Support Ticket"), // Use translation
          link: "/support-ticket",
          isChild: false,
        },


      ];
      break;
    case "Driver":
      menuItems = [
        {
          icon: <FaHome className="text-xl text-primary-400 group-hover:text-white" />,
          text: t("sidebar.Dashboard"), // Use translation
          link: "/dashboard",
          isChild: false,
        },
        {
          icon: <FaFirstOrder className="text-xl text-primary-400 group-hover:text-white" />,
          text: t("sidebar.Shipment"), // Use translation
          link: "/shipment",
          isChild: false,
        },


        {
          icon: <List className="text-xl text-primary-400 group-hover:text-white" />,
          text: t("sidebar.Request List"), // Use translation
          link: "/request-list",
          isChild: false,
        },
        {
          icon: <FaRegMessage className="text-xl text-primary-400 group-hover:text-white" />,
          text: t("sidebar.Live Support"), // Use translation
          link: "/live-chat",
          isChild: false,
        },
        {
          icon: <FaCalculator className="text-xl text-primary-400 group-hover:text-white" />,
          text: t("dashboard.Rate Calculator"), // Use translation
          link: "/rate-calculator",
          isChild: false,
        },
      ];
      break;
    case "Transporter":
      menuItems = [
        {
          icon: <FaTachometerAlt className="text-xl text-primary-400 group-hover:text-white" />,
          text: t("sidebar.Dashboard"), // Use translation
          link: "/dashboard",
          isChild: false,
        },
        {
          icon: <FaShoppingCart className="text-xl text-primary-400 group-hover:text-white" />,
          text: t("sidebar.Shipment"), // Use translation
          link: "/shipment",
          isChild: false,
        },
        {
          icon: <FaRocket className="text-xl text-primary-400 group-hover:text-white" />,
          text: t("sidebar.Route"), // Use translation
          link: "/route",
          isChild: false,
        },
        {
          icon: <List className="text-xl text-primary-400 group-hover:text-white" />,
          text: t("sidebar.Request List"), // Use translation
          link: "/request-list",
          isChild: false,
        },
        {
          icon: <FaQuestionCircle className="text-xl text-primary-400 group-hover:text-white" />,
          text: t("sidebar.Support Ticket"), // Use translation
          link: "/support-ticket",
          isChild: false,
        },
      ];
      break;
    default:
      break;
  }

  const handleExpand = (index) => {
    setExpandedItems((prevExpandedItems) => ({
      ...prevExpandedItems,
      [index]: !prevExpandedItems[index],
    }));
  };

  const handleLinkClick = (link) => {
    if (window.innerWidth < 1024) {
      hideSidebar();
    }
    navigate(link);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        hideSidebar();
      }
      if (window.innerWidth > 1024) {
        showSidebar();
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [hideSidebar, showSidebar]);

  const [hovered, setHovered] = useState<boolean>(false);

  const onHovered = () => {
    setHovered(true);
  }

  const onBlurred = () => {
    setHovered(false);
  }

  useEffect(()=>{
    if(!hovered){
      setExpandedItems({});
    }
  },[hovered])

  return (
    <>
      {isVisible && (
        <div onMouseEnter={onHovered} onMouseLeave={onBlurred} className={`fixed transition-all duration-300 top-0 left-0 w-full  bg-primary-200  border border-gray-500 z-50 pt-4 px-2 min-h-[100vh]  ${hovered ? 'sm:w-[230px]' : 'sm:w-[66px]'}`}>
          <SidebarCloseIcon onClick={toggleSidebar} className="text-2xl text-white cursor-pointer lg:hidden right-2 top-2" />
          <div className="flex justify-center p-2 text-2xl font-bold rounded cursor-pointer md:justify-stretch">
            <span className={`ml-2 text-white sm:visible ${hovered ? '' : 'md:hidden'}`}>Geniusship</span>
          </div>
          <div className="flex flex-col gap-3 mt-1">
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                <div
                  onClick={() => handleExpand(index)}
                  className="group flex h-[53px] hover:bg-gray-400 px-3 items-center rounded cursor-pointer"
                >
                  <div onClick={() => handleLinkClick(item.link)} className="flex items-center w-full">
                    {item.icon}
                    <span className={`ml-3 text-sm font-semibold text-white sm:visible ${hovered ? '' : 'md:hidden'}`}>{item.text}</span>
                  </div>
                  {item.children && (
                    <span className="ml-auto">
                      {expandedItems[index] ? (
                        <ChevronDown className="text-white" />
                      ) : (
                        <ChevronRight className="text-white" />
                      )}
                    </span>
                  )}
                </div>
                {item.children && expandedItems[index] && (
                  <div className="pl-4">
                    {item.children.map((child, childIndex) => (
                      <div
                        onClick={() => handleLinkClick(child.link)}
                        key={childIndex}
                        className="flex h-[53px] cursor-pointer mt-2 group bg-white sm:bg-transparent sm:hover:bg-gray-400 px-3 items-center rounded hover:text-black"
                      >
                        <FaMinus className="text-sm text-primary-400 group-hover:text-white" />
                        <span className="ml-3 text-sm font-semibold text-black sm:text-green-400 sm:group-hover:text-white">
                          {child.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
