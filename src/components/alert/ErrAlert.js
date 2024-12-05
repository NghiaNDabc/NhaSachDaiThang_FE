// ErrorAlert.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './ErrorAlert.module.scss';
const cx = classNames.bind(styles);

function ErrorAlert({ message }) {
    if (!message) return null;

    return (
        <div className={cx('error-alert')}>
            <FontAwesomeIcon icon={faExclamationTriangle} className={cx('icon')} />
            <span>{message}</span>
        </div>
    );
}

export default ErrorAlert;
