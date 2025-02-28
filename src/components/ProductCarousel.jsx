import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "./ProductCard";

export default function ProductCarousel({ products }) {
    const swiperRef = useRef(null);
    const [isBeginning, setIsBeginning] = useState(true);

    return (
        <div className="w-full mx-auto mt-10">
            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={4}
                navigation
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    setIsBeginning(swiper.isBeginning);
                }}
                onSlideChange={(swiper) => setIsBeginning(swiper.isBeginning)}
                breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 4 },
                }}
            >
                {products.map((product) => (
                    <SwiperSlide key={product.id}>
                        <ProductCard product={product} />
                    </SwiperSlide>
                ))}
            </Swiper>

            <button
                onClick={() => swiperRef.current?.slidePrev()}
                disabled={isBeginning}
                className={`mt-4 px-4 py-2 ${isBeginning ? "opacity-50 cursor-not-allowed" : "bg-blue-500 text-white"}`}
            >
                Prev
            </button>
        </div>
    );
}
