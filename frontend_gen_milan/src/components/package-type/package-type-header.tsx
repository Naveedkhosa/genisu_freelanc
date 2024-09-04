import AddPackageType from "./add-package-type";
import { useTranslation } from 'react-i18next';

const PackageHeader = () => {
    const { t } = useTranslation("global"); // Use translation function from i18next

    return (
        <div className='flex justify-between w-full my-5 '>
            <div className='flex items-center'>
                <h2 className='mr-3 text-xl font-bold text-white'>{t('package_header.Package type')}</h2>
             </div>
             <AddPackageType/>
        </div>
    )
}

export default PackageHeader;
