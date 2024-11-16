import classNames from 'classnames/bind';
import styles from './input.module.scss';
import PropTypes from 'prop-types';
var cx = classNames.bind(styles);
function Input({
    type = 'text',
    placeholder = '',
    value,
    onChange,
    onBlur,
    className,
    icon,
    isError,
    errorMessage,
    ...props
}) {
    return (
        <div className={cx('input-container', { 'input-error': isError })}>
            {icon && <span className={cx('input-icon')}>{icon}</span>}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className={cx('input', className)}
                {...props}
            />
            {isError && <span className={cx('error-message')}>{errorMessage}</span>}
        </div>
    );
}
Input.propTypes = {
    type: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    className: PropTypes.string,
    icon: PropTypes.element,
    isError: PropTypes.bool,
    errorMessage: PropTypes.string,
};


export default Input;
