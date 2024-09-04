import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '../ui/button';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

const PaymentOutForm = () => {
    const [amount, setAmount] = useState('120');
    const [paymentMethod, setPaymentMethod] = useState('creditCard');

    return (
        <div className='flex text-black'>
            <Popover>
                <PopoverTrigger asChild>
                    <Button className='flex gap-1 bg-primary-300'><PlusIcon size={15} /> <span>Add Payment</span></Button>
                </PopoverTrigger>
                <div className='w-full flex justify-center h-full'>
                    <PopoverContent className="w-[700px] popup-for-rocket-user bg-white">
                        <div className="grid grid-cols-1 gap-4 p-4">
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="amount">Amount</Label>
                                <Input
                                    id="amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="col-span-2 h-8"
                                    placeholder="Enter amount"
                                    readOnly
                                />
                            </div>

                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label>Payment Method</Label>
                                <div className="col-span-2 flex flex-col gap-2">
                                    <RadioGroup defaultValue={paymentMethod} onValueChange={setPaymentMethod}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="creditCard" id="creditCard" />
                                            <Label htmlFor="creditCard">Credit Card</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="cashOnDelivery" id="cashOnDelivery" />
                                            <Label htmlFor="cashOnDelivery">Cash on Delivery</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="paypal" id="paypal" />
                                            <Label htmlFor="paypal">PayPal</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="bankTransfer" id="bankTransfer" />
                                            <Label htmlFor="bankTransfer">Bank Transfer</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 p-4">
                            <Button type="button" variant="outline" onClick={() => {/* Handle cancel */ }}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Save
                            </Button>
                        </div>
                    </PopoverContent>
                </div>
            </Popover>
        </div>
    );
}

export default PaymentOutForm;
