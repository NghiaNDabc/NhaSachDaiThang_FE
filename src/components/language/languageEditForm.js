import { useState } from 'react';
import style from './languageFormStyle.module.scss';
import classNames from 'classnames/bind';
import { languageService } from '../../services/languageService';
import Button from '../button/button';

const cx = classNames.bind(style);

function LanguageEditForm({ item, onClose }) {
    const [language, setLanguage] = useState(item);
    const [name, setName] = useState(language.name);
    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        const languageData = {
            languageId: language.languageId,
            name,
        };
        Object.keys(languageData).forEach((key) => {
            formData.append(key, languageData[key]);
        });
        await languageService.put(formData);
        onClose();
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <button onClick={() => onClose()} className={cx('close-button')}>
                    X
                </button>
                <h2>Sửa ngôn ngữ</h2>
                <div className={cx('row')}>
                    <label className={cx('label')}>
                        Tên
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={cx('input')}
                            required
                        />
                    </label>
                </div>
                <Button onClick={handleSubmit} className={cx('submit-button')} variant="add">
                    Sửa
                </Button>
            </div>
        </div>
    );
}

export default LanguageEditForm;
