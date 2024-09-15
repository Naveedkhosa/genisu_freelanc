import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import baseClient from "@/services/apiClient";

const AddShipment = () => {
  //@ts-ignore
  const current_user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    customer_id: "",
    source: "",
    destination: "",
    shipment_date: "",
  });

  const [customers, setCustomers] = useState([]);

  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    // Fetch customers when the component mounts
    baseClient
      .get("all_customers")
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching customers:", error);
        toast.error("Failed to fetch customers");
      });
  }, []);

  const handleChange = (e:any) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleCustomerChange = (value:any) => {
    setFormData({
      ...formData,
      customer_id: value,
    });
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    if (current_user?.role == "Customer") {
      formData.customer_id = current_user?.id;
    }
    baseClient
      .post("shipments", formData)
      .then((_) => {
        toast.success("Shipment added successfully");
        setFormData({
          customer_id: "",
          source: "",
          destination: "",
          shipment_date: "",
        });
        setPopoverOpen(false);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        console.error("Error adding shipment:", error);
        toast.error("Failed to add shipment");
      });
  };

  return (
    <div className="flex text-black">
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          {(current_user?.role == "Admin" ||
            current_user?.role == "Transporter") && (
            <Button className="flex gap-1 bg-primary-300">
              <PlusIcon size={15} /> <span>Add Shipment</span>
            </Button>
          )}
        </PopoverTrigger>
        <div className="flex justify-center w-full h-full">
          <PopoverContent className="lg:w-[700px] w-[300px] popup-for-rocket-user bg-white">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-2 mt-2 p-4"
            >
              {current_user?.role != "Customer" && (
                <div className="grid items-center grid-cols-1 gap-2 mt-2">
                  <Label htmlFor="customerId">Customer ID</Label>
                  <Select
                    value={formData?.customer_id}
                    onValueChange={handleCustomerChange}
                  >
                    <SelectTrigger className="h-8 col-span-2 border outline-none focus:outline-none active:outline-none">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Customers</SelectLabel>
                        {customers.map((customer : any) => (
                          <SelectItem key={customer?.id} value={customer?.id}>
                            {customer?.name}{" "}
                            {/* Assuming userDetail contains the name */}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid items-center grid-cols-1 gap-2 mt-2">
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  className="h-8 col-span-2"
                  value={formData.source}
                  onChange={handleChange}
                  placeholder="Enter origin"
                />
              </div>

              <div className="grid items-center grid-cols-1 gap-2 mt-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  className="h-8 col-span-2"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="Enter destination"
                />
              </div>

              <div className="grid items-center grid-cols-1 gap-2 mt-2">
                <Label htmlFor="shipment_date">Shipment Date</Label>
                <Input
                  id="shipment_date"
                  type="date"
                  className="h-8 col-span-2"
                  value={formData.shipment_date}
                  onChange={handleChange}
                />
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setPopoverOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </PopoverContent>
        </div>
      </Popover>
    </div>
  );
};

export default AddShipment;
