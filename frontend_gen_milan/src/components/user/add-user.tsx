import { useState, useEffect } from 'react';
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import baseClient from '@/services/apiClient';
import { useTranslation } from 'react-i18next';

const AddUser = ({ params }: { params: string }) => {
  const { t } = useTranslation("global"); // Use translation function from i18next

  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [company, setCompany] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [transporters, setTransporters] = useState([]);
  const [selectedTransporter, setSelectedTransporter] = useState('');
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  const current_user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (role === 'Driver') {
      fetchTransporters();
    }
  }, [role]);
  
    // Load current user from localStorage
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    if (currentUser?.role === 'Transporter') {
      setRole('Driver');
      setSelectedTransporter(currentUser?.id);
    }
  }, []);

  const fetchTransporters = async () => {
    try {
      const response = await baseClient.get('/all_transporters');
      setTransporters(response.data);
    } catch (error) {
      console.error('Error fetching transporters:', error);
    }
  };
  
   const capitalizeFirstLetter = (str: string) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const capitalizedParams = capitalizeFirstLetter(params);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const userData = {
      name: username,
      email,
      password,
      role,
      phone,
      address,
      company,
      license_number: licenseNumber,
      transporter_id: selectedTransporter,
    };

    try {
      const response = await baseClient.post('/users', userData);
      toast.success(t('add_user.User created successfully'));
      // Reset form fields
      setRole('');
      setUsername('');
      setPassword('');
      setEmail('');
      setPhone('');
      setAddress('');
      setCompany('');
      setLicenseNumber('');
      setSelectedTransporter('');
      // Close the Popover
      setPopoverOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      const decodedMessage = JSON.parse(err.response.request.responseText);
      if (decodedMessage?.email) {
        toast.error(t('add_user.Email Already Taken'));
      } else {
        toast.error(t('add_user.Error creating user'));
      }
    }
  };

  return (
    <div className="flex text-black">
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button className="flex gap-1 bg-black bg-opacity-25 text-white">
            <PlusIcon size={15} /> <span>{t('add_user.Add User')} {t(`add_user.${capitalizedParams}`)} </span>
          </Button>
        </PopoverTrigger>
        <div className="flex justify-center w-full h-full">
          <PopoverContent className="lg:w-[700px] w-[300px] popup-for-rocket-user text-white bg-primary-200">
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">{t('add_user.Add User')} {t(`add_user.${capitalizedParams}`)}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('add_user.Set the dimensions for the layer.')}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 p-4">
              {current_user?.role !== 'Transporter' && (
                <div className="grid items-center grid-cols-3 gap-4">
                  <Label htmlFor="role">{t('add_user.Role')}</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="w-[140px] outline-none border focus:outline-none active:outline-none">
                      <SelectValue placeholder={t('add_user.Select Role')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Customer">{t('add_user.Customer')}</SelectItem>
                        <SelectItem value="Driver">{t('add_user.Driver')}</SelectItem>
                        <SelectItem value="Transporter">{t('add_user.Transporter')}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div> 
              )}

                <div className="grid items-center grid-cols-3 gap-4">
                  <Label htmlFor="username">{t('add_user.Username')}</Label>
                  <Input
                    id="username"
                    className="h-8 bg-black bg-opacity-25 col-span-2"
                    placeholder={t('add_user.Enter username')}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="grid items-center grid-cols-3 gap-4">
                  <Label htmlFor="password">{t('add_user.Password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    className="h-8 bg-black bg-opacity-25 col-span-2"
                    placeholder={t('add_user.Enter password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="grid items-center grid-cols-3 gap-4">
                  <Label htmlFor="email">{t('add_user.Email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    className="h-8 bg-black bg-opacity-25 col-span-2"
                    placeholder={t('add_user.Enter email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="grid items-center grid-cols-3 gap-4">
                  <Label htmlFor="phone">{t('add_user.Phone')}</Label>
                  <Input
                    id="phone"
                    className="h-8 bg-black bg-opacity-25 col-span-2"
                    placeholder={t('add_user.Enter phone number')}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="grid items-center grid-cols-3 gap-4">
                  <Label htmlFor="address">{t('add_user.Address')}</Label>
                  <Input
                    id="address"
                    className="h-24 bg-black bg-opacity-25 col-span-2"
                    placeholder={t('add_user.Enter address')}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="grid items-center grid-cols-3 gap-4">
                  <Label htmlFor="company">{t('add_user.Company')}</Label>
                  <Input
                    id="company"
                    className="h-8 bg-black bg-opacity-25 col-span-2"
                    placeholder={t('add_user.Enter company name')}
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>

                 {role === 'Driver' && (
                  <div className="grid items-center grid-cols-3 gap-4">
                    <Label htmlFor="license_number">{t('add_user.License Number')}</Label>
                    <Input
                      id="license_number"
                      className="h-8 col-span-2"
                      placeholder={t('add_user.Enter license number')}
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                    />
                  </div>
                )}

                <div className="flex justify-end gap-4">
                  <Button 
                  className='bg-white text-red-400'
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setPopoverOpen(false);
                    }}
                  >
                    {t('add_user.Cancel')}
                  </Button >
                  <Button className='bg-white text-green-400' type="submit">{t('add_user.Save')}</Button>
                </div>
              </div>
            </form>
          </PopoverContent>
        </div>
      </Popover>
    </div>
  );
};

export default AddUser;
