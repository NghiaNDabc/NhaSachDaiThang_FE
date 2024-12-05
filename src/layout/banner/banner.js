import React, { useState, useEffect } from 'react';
import banner2 from '../../assets/ms_banner_img2.jpg';
import banner1 from '../../assets/ms_banner_img1.jpg';
const images = [banner1, banner2];

const Banner = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 8000); // Thay đổi ảnh sau mỗi 3 giây
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            style={{
                height: '400px',
            }}
            className="relative w-full overflow-hidden"
        >
            {/* Ảnh */}
            {images.map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt={`Slide ${index}`}
                    className={`absolute w-full h-full object-cover transition-transform duration-1000 ${
                        index === currentIndex ? 'translate-x-0' : 'translate-x-full'
                    }`}
                />
            ))}

            {/* Nút điều hướng */}
            <div className="absolute inset-0 flex justify-between items-center px-4">
                <button
                    onClick={() =>
                        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
                    }
                    className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                >
                    &#8592;
                </button>
                <button
                    onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)}
                    className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                >
                    &#8594;
                </button>
            </div>

            {/* Chỉ số */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-gray-400'}`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default Banner;
