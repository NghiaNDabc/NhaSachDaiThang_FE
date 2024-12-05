import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import style from './breadCrumb.module.scss';

const cx = classNames.bind(style);
// to={category.link}
function Breadcrumb({ categories }) {
    return (
        <div  className={cx('breadcrumb')}>
            {categories.map((category, index) => (
                <span key={index}>

                    <Link >{category.name}</Link>
                    {index < categories.length - 1 && ' > '}
                </span>
            ))}
        </div>
    );
}

export default Breadcrumb;
