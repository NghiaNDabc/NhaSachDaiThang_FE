import { useState } from 'react';
import style from './languageFormStyle.module.scss';
import classNames from 'classnames/bind';
import { languageService } from '../../services/languageService';
import Button from '../button/button';
import RequiredStar from '../requiredStar/requiredStar';

const cx = classNames.bind(style);

function LanguageAddForm({ onClose, onAdd }) {
    const [name, setName] = useState();
    const [errormes, seterrormes] = useState();
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!name) {
            seterrormes('Không được để trống');
            return;
        }
        if (name.length > 100) {
            seterrormes('Tối đa 100 ký tự');
            return;
        }
        const formData = new FormData();
        const languageData = {
            name,
        };
        Object.keys(languageData).forEach((key) => {
            formData.append(key, languageData[key]);
        });
        await languageService.post(formData);
        onAdd();
        setName();
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <button onClick={onClose} className={cx('close-button')}>
                    X
                </button>
                <h2>Thêm ngôn ngữ</h2>
                <div className={cx('row')}>
                    <label className={cx('label')}>
                        Tên
                        <RequiredStar />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (e.target.value && e.target.value.length <= 100) seterrormes();
                            }}
                            className={cx('input')}
                            required
                        />
                        <p className={cx('error')}>{errormes}</p>
                    </label>
                </div>
                <Button onClick={handleSubmit} className={cx('submit-button')} variant="add">
                    Thêm ngôn ngữ mới
                </Button>
            </div>
        </div>
    );
}

export default LanguageAddForm;
