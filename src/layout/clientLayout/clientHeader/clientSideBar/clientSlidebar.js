import { useClientContext } from '../../../../contexts/CientContext';
import { faBars, faCartPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import style from './clientSlideBar.module.scss';
const cx = classNames.bind(style);
function ClientSlideBar() {
    const { categories } = useClientContext();
    const renderSubCategories = (subCategories) => {
        return (
            <ul className={cx('sub-menu')}>
                {subCategories.map((sub) => (
                    <li key={sub.categoryId}>
                        <span>{sub.name}</span>
                        {sub.subCategories?.length > 0 && renderSubCategories(sub.subCategories)}
                    </li>
                ))}
            </ul>
        );
    };
    return (
        <>
            <div className={cx('category')}>
                <FontAwesomeIcon className={cx('category-icon')} icon={faBars} /> <span style={{fontSize:'28px', fontWeight:'bold'}}>Danh Mục</span>
                <div className={cx('category-menu')}>
                    <ul>
                        {categories.map((category) => (
                            <li key={category.categoryId}>
                                <span>{category.name}</span>
                                {category.subCategories?.length > 0 && renderSubCategories(category.subCategories)}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}

export default ClientSlideBar;
