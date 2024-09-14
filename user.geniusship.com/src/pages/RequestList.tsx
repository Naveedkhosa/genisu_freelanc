// import RequestListPageCard from "@/components/my-request/my-request-card"

import RequestListCard from "@/components/request-list/request-list-card"
import RequestListHeader from "@/components/request-list/request-list-header"



const RequestListPage = () => {

    return (
        <div className='flex flex-col w-full px-4 pl-[76px]'>
            <RequestListHeader />
            <RequestListCard />
        </div>
    )
}

export default RequestListPage

