
const FeedBackHeader = () => {
    return (
        <div className='flex justify-between w-full my-5'>
            <div className='flex items-center gap-3'>
                <h2 className='mr-3 text-xl font-bold'>Feedback</h2>
                {/* <Select>
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
                </Select> */}
            </div>
            {/* <div className='relative w-full rounded-md lg:w-[500px] border'>
                <Input
                    type="email"
                    className='py-2 pl-10 pr-4 border-none outline-none placeholder:text-xs focus:border-none focus:ring-0'
                    placeholder="Search for AwB, Order ID, Buyer Mobile Number, Email, SKU, Pickup ID"
                />
                <AiOutlineSearch className='absolute text-gray-500 transform -translate-y-1/2 top-1/2 left-3' />
            </div> */}
        </div>
    )
}

export default FeedBackHeader