import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
  // Example images
  const paypalIcon = "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg";
const SelectAccountPopup = () => {
    return (
        <Dialog>
            <DialogTrigger>
                <Button className="text-white shadow-sm mt-4 bg-primary-200 hover:bg-slate-700">
                    Add Account
                </Button>
            </DialogTrigger>
            <DialogContent className="rounded-lg w-[94%] sm:w-full">
                <DialogHeader>
                    <DialogTitle>Bank Account</DialogTitle>
                    <DialogDescription>
                        Add your bank account to receive payments
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                    <div className="grid items-center grid-cols-1 gap-2 mt-1">
                        <Label htmlFor="pickupCity">Select Bank</Label>
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a bank account" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Bank Accounts</SelectLabel>
                                    <SelectItem value="paypal">
                                        <div className="flex items-center gap-2">
                                            <img src={paypalIcon} alt="PayPal" className="w-8 h-8" />
                                            <span>PayPal</span>
                                        </div>
                                    </SelectItem>
                                    {/* Add more bank accounts here */}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 w-full">
                    <div className="grid items-center grid-cols-1 gap-2 mt-1">
                        <Label htmlFor="account-number">Account Detail</Label>
                        <Input
                            id="account-number"
                            className="h-8 col-span-2 py-5"
                            placeholder="Account Number"
                            type="text"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                    <Button className="w-full border border-green-400 hover:bg-green-400">
                        Next
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SelectAccountPopup