import React, { useState } from 'react';
import './Carousel.scss';

interface Props {
    images: string[];
}

const Carousel: React.FC<Props> = ({ images }) => {
    const [index, setIndex] = useState(0);
    

    const prev = () => setIndex((index - 1 + images.length) % images.length);
    const next = () => setIndex((index + 1) % images.length);

    return (
        <div className="carousel">
            <img src={images[index]} alt="carousel" className="carousel-image" />
            <button onClick={prev} className="carousel-button left">{'⟨'}</button>
            <button onClick={next} className="carousel-button right">{'⟩'}</button>
            <div className="carousel-dots">
                {images.map((_, index) => (
                <div 
                    key={index} 
                    className={`dot ${index === index ? 'active' : ''}`}
                    onClick={() => setIndex(index)}
                />
                ))}
            </div>
        </div>
    );
};

export default Carousel;
