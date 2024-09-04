// import RequestListPageCard from "@/components/my-request/my-request-card"

import RequestListCard from "@/components/request-list/request-list-card"
import RequestListHeader from "@/components/request-list/request-list-header"



const RequestListPage = () => {

    return (
        <div className='flex flex-col w-full px-4 '>
            <RequestListHeader />
            <div className="w-full h-full xl:w-[70%] flex lg:flex-row flex-col">
                <RequestListCard />
            </div>
        </div>
    )
}

export default RequestListPage

