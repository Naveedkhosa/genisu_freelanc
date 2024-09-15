import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaWallet, FaUser, FaGlobe, FaBolt } from "react-icons/fa";
import { Calculator } from "lucide-react";
import { FaBoltLightning, FaChargingStation, FaLocationDot } from "react-icons/fa6";
import { MdAirplaneTicket } from "react-icons/md";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import useSidebarStore from "@/store/showside";
import baseClient from "@/services/apiClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import NotificationListener from "./NotificationListener";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";


const Header = () => {
  const [t, i18n] = useTranslation("global");
  // handle language change
  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  }

  const [isOpen, setIsOpen] = useState(false);
  const [quickOptOpened, setQuickOptOpened] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);
  const toggleQuickOptions = () => setQuickOptOpened(!quickOptOpened);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    repeatPassword: "",
  });
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/home");
    } else {
      baseClient
        .get("user")
        .then(() => {

        })
        .catch((error) => {
          if (error.response.statusText == "Unauthorized") {
            navigate("/home");
          }
        });
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        currentPassword: "",
        newPassword: "",
        repeatPassword: "",
      });
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await baseClient.post("/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/home");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors: any = {};

    if (
      formData.newPassword &&
      formData.newPassword !== formData.repeatPassword
    ) {
      newErrors.repeatPassword = t("header.Passwords do not match");
      valid = false;
    }

    if (formData.newPassword.length < 6) {
      newErrors.newPassword = t("header.New password must be at least 6 characters long");
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleUpdateProfile = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) return;

    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await baseClient.put(`/users/${user.id}`, formData);
      localStorage.setItem("user", JSON.stringify(response.data));
      setErrors({});
      toast(t("header.Profile updated successfully"));
    } catch (error) {

      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        toast(t("header.Error updating profile"));
      }
    }
  };

  const fetchUser = () => {
    const current_user = localStorage.getItem("user");

    return JSON.parse(current_user);
  };
  const { toggleSidebar, isVisible } = useSidebarStore();
  const current_user = fetchUser();



  // geo location handling



  type LocationStatus = "accessed" | "denied" | "unknown" | "error";

  const [locationStatus, setLocationStatus] =

    useState<LocationStatus>("unknown");

  const [position, setPosition] = useState<any>();

  let watchId: number | null = null;


  if (current_user?.role == "Driver") {

    console.log('current_user?.role', current_user?.role);

    if ("geolocation" in navigator) {

      watchId = navigator.geolocation.watchPosition((position) => {
        console.log("positionn :: ", {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      }
      );

    }

  }



  useEffect(() => {


    console.log("position now: ", position);

if(position?.lat==undefined){
  return;
}

    baseClient.post("update/locations", {
      id: current_user.id,
      name: current_user.name,
      lat: position?.lat,
      lng: position?.lng
    })
      .then((response) => {
        console.log("updated : ", response);
      });

  }, [position]);
  return (
    <div className="flex items-center justify-between w-full p-4 border border-gray-500 bg-black bg-opacity-25 shadow sm:justify-end">
      <div className="flex justify-end lg:hidden">
        <Menu
          onClick={toggleSidebar}
          className={`text-white text-4xl cursor-pointer ${isVisible ? "hidden" : "block"
            }`}
        />
      </div>
      <div className="flex items-center justify-end w-full space-x-4">
        <div className="flex items-center space-x-2 md:space-x-4">

          <div className="relative">
            <span className="flex items-center px-3 cursor-pointer py-2  bg-black bg-opacity-25 rounded text-xs text-gray-300" onClick={toggleQuickOptions}>
              <FaBolt className="text-lg text-gray-100 "  ></FaBolt>
              <span className="  md:block sm: hidden "> Quick Action</span>
            </span>
            {quickOptOpened && (
              <div className="absolute top-[100%] w-[340px] py-4 px-2 left-[-200%] mt-2 bg-primary-200 border border-gray-300 rounded-md shadow-lg z-10">
                <div className="grid grid-cols-3 gap-3">
                  <Link to='/rate-calculator' className="flex ml-[1px] flex-col p-4 items-center text-center shadow bg-gray-300 bg-opacity-25 rounded" >
                    <Calculator size={30} className="text-xl text-white font-bold  bg-gray-100 bg-opacity-25 p-2 rounded-full h-10 w-10" />
                    <p className="text-sm  text-gray-100  font-semibold mt-2">{t("dashboard.Rate Calculator")}</p>
                  </Link>
                  <Link to='/support-ticket' className="flex ml-[1px] flex-col p-4 items-center text-center shadow bg-gray-300 bg-opacity-25 rounded " >
                    <MdAirplaneTicket size={30} className="text-xl text-white font-bold bg-gray-100 bg-opacity-25 p-2 rounded-full h-10 w-10" />
                    <p className="text-sm  text-gray-100  font-semibold mt-2">{t("dashboard.Create a Ticket")}</p>
                  </Link>
                  <Link to='/track-shipment' className="flex ml-[1px] flex-col p-4 items-center text-center shadow bg-gray-300 bg-opacity-25 rounded" >
                    <FaLocationDot size={30} className="text-xl text-white font-bold bg-gray-100 bg-opacity-25 p-2 rounded-full h-10 w-10" />
                    <p className="text-sm  text-gray-100 font-semibold mt-2">{t("dashboard.Track shipment")}</p>
                  </Link>
                </div>
              </div>
            )}

          </div>

          <div className="relative flex items-center justify-end">
            <Button
              className="flex items-center justify-center p-2 text-gray-600 hover:text-gray-800"
              onClick={toggleDropdown}
            >
              <FaGlobe className="text-lg text-gray-100 " />
            </Button>

            {isOpen && (
              <div className="absolute top-[100%] right-[-100%] mt-2 w-48 bg-primary-200 rounded-md shadow-lg z-10">
                <ul className="py-1 h-[300px] overflow-y-auto">
                  <li>
                    <Button
                      className="w-full text-left px-4 text-gray-300 py-2 hover:text-primary-200 hover:bg-gray-100"
                      onClick={() => {
                        handleLanguageChange('ar');
                        toggleDropdown();
                      }}
                    >
                      Arabic
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="w-full text-left px-4 text-gray-300 py-2 hover:text-primary-200 hover:bg-gray-100"
                      onClick={() => {
                        handleLanguageChange('bg');
                        toggleDropdown();
                      }}
                    >
                      Bulgarian
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="w-full text-left px-4 text-gray-300 py-2 hover:text-primary-200 hover:bg-gray-100"
                      onClick={() => {
                        handleLanguageChange('cs');
                        toggleDropdown();
                      }}
                    >
                      Czech
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="w-full text-left px-4 text-gray-300 py-2 hover:text-primary-200 hover:bg-gray-100"
                      onClick={() => {
                        handleLanguageChange('da');
                        toggleDropdown();
                      }}
                    >
                      Danish
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="w-full text-left px-4 text-gray-300 py-2 hover:text-primary-200 hover:bg-gray-100"
                      onClick={() => {
                        handleLanguageChange('nl');
                        toggleDropdown();
                      }}
                    >
                      Dutch
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="w-full text-left px-4 text-gray-300 py-2 hover:text-primary-200 hover:bg-gray-100"
                      onClick={() => {
                        handleLanguageChange('en');
                        toggleDropdown();
                      }}
                    >
                      English
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="w-full text-left px-4 text-gray-300 py-2 hover:text-primary-200 hover:bg-gray-100"
                      onClick={() => {
                        handleLanguageChange('et');
                        toggleDropdown();
                      }}
                    >
                      Estonian
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="w-full text-left px-4 text-gray-300 py-2 hover:text-primary-200 hover:bg-gray-100"
                      onClick={() => {
                        handleLanguageChange('fr');
                        toggleDropdown();
                      }}
                    >
                      French
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="w-full text-left px-4 text-gray-300 py-2 hover:text-primary-200 hover:bg-gray-100"
                      onClick={() => {
                        handleLanguageChange('de');
                        toggleDropdown();
                      }}
                    >
                      German
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="w-full text-left px-4 text-gray-300 py-2 hover:text-primary-200 hover:bg-gray-100"
                      onClick={() => {
                        handleLanguageChange('el');
                        toggleDropdown();
                      }}
                    >
                      Greek
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="w-full text-left px-4 text-gray-300 py-2 hover:text-primary-200 hover:bg-gray-100"
                      onClick={() => {
                        handleLanguageChange('hr');
                        toggleDropdown();
                      }}
                    >
                      Croatian
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="w-full text-left px-4 text-gray-300 py-2 hover:text-primary-200 hover:bg-gray-100"
                      onClick={() => {
                        handleLanguageChange('hu');
                        toggleDropdown();
                      }}
                    >
                      Hungarian
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="w-full text-left px-4 text-gray-300 py-2 hover:text-primary-200 hover:bg-gray-100"
                      onClick={() => {
                        handleLanguageChange('ga');
                        toggleDropdown();
                      }}
                    >
                      Irish
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="w-full text-left px-4 text-gray-300 py-2 hover:text-primary-200 hover:bg-gray-100"
                      onClick={() => {
                        handleLanguageChange('it');
                        toggleDropdown();
                      }}
                    >
                      Italian
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="w-full text-left px-4 text-gray-300 py-2 hover:text-primary-200 hover:bg-gray-100"
                      onClick={() => {
                        handleLanguageChange('lv');
                        toggleDropdown();
                      }}
                    >
                      Latvian
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="w-full text-left px-4 text-gray-300 py-2 hover:text-primary-200 hover:bg-gray-100"
                      onClick={() => {
                        handleLanguageChange('lt');
                        toggleDropdown();
                      }}
                    >
                      Lithuanian
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="w-full text-left px-4 text-gray-300 py-2 hover:text-primary-200 hover:bg-gray-100"
                      onClick={() => {
                        handleLanguageChange('mt');
                        toggleDropdown();
                      }}
                    >
                      Maltese
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="w-full text-left px-4 text-gray-300 py-2 hover:text-primary-200 hover:bg-gray-100"
                      onClick={() => {
                        handleLanguageChange('pl');
                        toggleDropdown();
                      }}
                    >
                      Polish
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="w-full text-left px-4 text-gray-300 py-2 hover:text-primary-200 hover:bg-gray-100"
                      onClick={() => {
                        handleLanguageChange('pt');
                        toggleDropdown();
                      }}
                    >
                      Portuguese
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="w-full text-left px-4 text-gray-300 py-2 hover:text-primary-200 hover:bg-gray-100"
                      onClick={() => {
                        handleLanguageChange('ro');
                        toggleDropdown();
                      }}
                    >
                      Romanian
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="w-full text-left px-4 text-gray-300 py-2 hover:text-primary-200 hover:bg-gray-100"
                      onClick={() => {
                        handleLanguageChange('ru');
                        toggleDropdown();
                      }}
                    >
                      Russian
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="w-full text-left px-4 text-gray-300 py-2 hover:text-primary-200 hover:bg-gray-100"
                      onClick={() => {
                        handleLanguageChange('sk');
                        toggleDropdown();
                      }}
                    >
                      Slovak
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="w-full text-left px-4 text-gray-300 py-2 hover:text-primary-200 hover:bg-gray-100"
                      onClick={() => {
                        handleLanguageChange('sl');
                        toggleDropdown();
                      }}
                    >
                      Slovenian
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="w-full text-left px-4 text-gray-300 py-2 hover:text-primary-200 hover:bg-gray-100"
                      onClick={() => {
                        handleLanguageChange('sv');
                        toggleDropdown();
                      }}
                    >
                      Swedish
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="w-full text-left px-4 text-gray-300 py-2 hover:text-primary-200 hover:bg-gray-100"
                      onClick={() => {
                        handleLanguageChange('tr');
                        toggleDropdown();
                      }}
                    >
                      Turkish
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="w-full text-left px-4 text-gray-300 py-2 hover:text-primary-200 hover:bg-gray-100"
                      onClick={() => {
                        handleLanguageChange('ur');
                        toggleDropdown();
                      }}
                    >
                      Urdu
                    </Button>
                  </li>
                </ul>
              </div>

            )}
          </div>

          {(current_user?.role == "Driver" || current_user?.role == "Transporter") && (
            <Link to="/wallet">
              <span className="text-gray-100 ">
                <FaWallet className="text-lg text-gray-100" />
              </span>
            </Link>
          )}

          <Separator orientation="vertical" className="h-5" />

          <Link to="#">
            <span className="text-gray-100 ">$0</span>
          </Link>
          <Separator orientation="vertical" className="h-5" />
        </div>
        <NotificationListener />

        <Link to="#">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="flex gap-1">
                <div className="flex-col text-gray-100  hidden md:flex">
                  <span> {current_user?.name} </span>
                  <span className="text-xs text-gray-400 ">
                    ( {current_user?.role}){" "}
                  </span>
                </div>
                <FaUser className="w-10 h-10 p-2 text-gray-100 text-lg border rounded-full" />
              </Button>
            </PopoverTrigger>
            <div className="flex justify-center w-full h-full">
              <PopoverContent className="w-[200px] popup-for-rocket-user bg-primary-200">
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 gap-4">
                    <Button
                      className="bg-black bg-opacity-25 text-white"
                      type="button"
                      variant="outline"
                      onClick={handleLogout}
                    >
                      {t("header.Logout")}
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-black bg-opacity-25 text-white" variant="outline">{t("header.Edit Profile")}</Button>
                      </DialogTrigger>
                      <DialogContent className="w-[92%] bg-primary-200 text-white rounded-lg sm:max-w-[900px]">
                        <DialogHeader>
                          <DialogTitle>{t("header.Edit Profile")}</DialogTitle>
                          <DialogDescription>
                            {t("header.Make changes to your profile here. Click save when you're done.")}
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleUpdateProfile}>
                          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-3">
                              <div className="grid items-center grid-cols-4 gap-4">
                                <Label htmlFor="name" className="text-right">
                                  {t("header.Name")}
                                </Label>
                                <Input
                                  id="name"

                                  value={formData.name}
                                  onChange={handleInputChange}
                                  className="col-span-3 bg-black bg-opacity-25"
                                />

                                {errors.name && (
                                  <p className="col-span-4 text-red-500">

                                    {errors.name}
                                  </p>
                                )}
                              </div>
                              <div className="grid items-center grid-cols-4 gap-4">
                                <Label htmlFor="email" className="text-right">
                                  {t("header.Email")}
                                </Label>
                                <Input
                                  id="email"
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  className="col-span-3  bg-black bg-opacity-25"
                                  readOnly
                                />

                                {errors.email && (
                                  <p className="col-span-4 text-red-500">

                                    {errors.email}
                                  </p>
                                )}
                              </div>
                              <div className="grid items-center grid-cols-4 gap-4">
                                <Label htmlFor="phone" className="text-right">
                                  {t("header.Phone")}
                                </Label>
                                <Input
                                  id="phone"
                                  value={formData.phone}
                                  onChange={handleInputChange}
                                  className="col-span-3  bg-black bg-opacity-25"
                                />

                                {errors.phone && (
                                  <p className="col-span-4 text-red-500">

                                    {errors.phone}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col gap-3">
                              <div className="grid items-center grid-cols-4 gap-4">
                                <Label
                                  htmlFor="currentPassword"
                                  className="text-right"
                                >
                                  {t("header.Current Password")}
                                </Label>
                                <Input
                                  id="currentPassword"
                                  value={formData.currentPassword}
                                  onChange={handleInputChange}
                                  className="col-span-3  bg-black bg-opacity-25"
                                />

                                {errors.currentPassword && (
                                  <p className="col-span-4 text-red-500">

                                    {errors.currentPassword}
                                  </p>
                                )}
                              </div>
                              <div className="grid items-center grid-cols-4 gap-4">
                                <Label
                                  htmlFor="newPassword"
                                  className="text-right"
                                >
                                  {t("header.New Password")}
                                </Label>
                                <Input
                                  id="newPassword"
                                  value={formData.newPassword}
                                  onChange={handleInputChange}
                                  className="col-span-3  bg-black bg-opacity-25"
                                />

                                {errors.newPassword && (
                                  <p className="col-span-4 text-red-500">

                                    {errors.newPassword}
                                  </p>
                                )}
                              </div>
                              <div className="grid items-center grid-cols-4 gap-4">
                                <Label
                                  htmlFor="repeatPassword"
                                  className="text-right"
                                >
                                  {t("header.Repeat Password")}
                                </Label>
                                <Input
                                  id="repeatPassword"
                                  value={formData.repeatPassword}
                                  onChange={handleInputChange}
                                  className="col-span-3  bg-black bg-opacity-25"
                                />

                                {errors.repeatPassword && (
                                  <p className="col-span-4 text-red-500">

                                    {errors.repeatPassword}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              className="text-green-500 bg-white"
                              onClick={handleUpdateProfile}
                            >
                              {t("header.Update Profile")}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </PopoverContent>
            </div>
          </Popover>
        </Link>
      </div>
    </div>
  );
};

export default Header;
