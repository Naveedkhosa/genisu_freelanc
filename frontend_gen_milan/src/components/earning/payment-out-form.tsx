import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '../ui/button';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

const PaymentOutForm = () => {
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [transaction, setTransaction] = useState('');

    return (
        <div className='flex text-black self-end'>
            <Popover>
                <PopoverTrigger asChild>
                    <Button className='flex gap-1 bg-primary-300'><PlusIcon size={15} /> <span>Payment CheckOut</span></Button>
                </PopoverTrigger>
                <div className='w-full flex justify-center h-full'>
                    <PopoverContent className=" w-[700px] popup-for-rocket-user bg-white">
                        <div className="grid grid-cols-1 gap-4 p-4">
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="amount">Amount</Label>
                                <Input
                                    id="amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="col-span-2 h-8"
                                    placeholder="Enter amount"
                                />
                            </div>

                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="paymentMethod">Payment Method</Label>
                                <Input
                                    id="paymentMethod"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="col-span-2 h-8"
                                    placeholder="Enter payment method"
                                />
                            </div>

                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="transaction">Transaction</Label>
                                <Input
                                    id="transaction"
                                    value={transaction}
                                    onChange={(e) => setTransaction(e.target.value)}
                                    className="col-span-2 h-8"
                                    placeholder="Enter transaction (optional)"
                                />
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
