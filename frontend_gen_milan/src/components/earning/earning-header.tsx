import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { AiOutlineSearch } from 'react-icons/ai'
const EarningHeader = () => {
    return (
        <div className='w-full flex justify-between my-5'>
            <div className='flex gap-3 items-center'>
                <h2 className='font-bold text-xl mr-3'>Earnings</h2>
                <Select>
                    <SelectTrigger className="w-[140px] outline-none border focus:outline-none active:outline-none">
                        <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>All</SelectLabel>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="banana">Banana</SelectItem>
                            <SelectItem value="blueberry">Blueberry</SelectItem>
                            <SelectItem value="grapes">Grapes</SelectItem>
                            <SelectItem value="pineapple">Pineapple</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className='relative w-full rounded-md lg:w-[500px] border'>
                <Input
                    type="email"
                    className='placeholder:text-xs pl-10 pr-4 py-2 border-none outline-none focus:border-none focus:ring-0'
                    placeholder="Search for AwB, Order ID, Buyer Mobile Number, Email, SKU, Pickup ID"
                />
                <AiOutlineSearch className='absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500' />
            </div>
        </div>
    )
}

export default EarningHeader