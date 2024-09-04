
import AddUser from "./add-user"
const UserHeader = ({ type }: any) => {
    return (
        <div className='flex justify-between w-full my-5'>
            <div className='flex items-center px-4'>
                <h2 className='mr-3 text-xl font-bold text-white' style={{ textTransform: 'capitalize' }}>{type}</h2>
            </div>
            <div className='flex'>
                <AddUser params={type} />
            </div>
        </div>
    )
}

export default UserHeader