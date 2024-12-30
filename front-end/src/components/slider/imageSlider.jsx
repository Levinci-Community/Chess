// import { Image } from "@chakra-ui/react";
// import React from "react";
// import "swiper/css";
// import "swiper/css/effect-fade";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import { Autoplay, EffectFade, Pagination } from "swiper/modules";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/swiper-bundle.css";
// import appSettings from "../../settings/appSettings";

// const ImageSlider = ({
//   images,
//   interval = 9000,
//   width = "100%",
//   height = "100%",
// }) => {
//   return (
//     <Swiper
//       slidesPerView={1}
//       spaceBetween={30}
//       loop={true}
//       effect={"fade"}
//       pagination={{
//         clickable: true,
//       }}
//       autoplay={{
//         delay: interval,
//         disableOnInteraction: false,
//       }}
//       modules={[Autoplay, EffectFade, Pagination]}
//       className="mySwiper"
//     >
//       {images.map((imageUrl, index) => (
//         <SwiperSlide key={index}>
//           <Image
//             src={`${appSettings.API_PROXY}/images/${imageUrl}`}
//             alt={`Slide ${index}`}
//             w={width}
//             h={height}
//             objectFit={"fill"}
//             borderRadius={8}
//             aspectRatio={16 / 9}
//           />
//         </SwiperSlide>
//       ))}
//     </Swiper>
//   );
// };

// export default ImageSlider;

import React from "react";
import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import appSettings from "../../settings/appSettings";

const ImageSlider = ({
  images,
  interval = 5000,
  width = "100%",
  height = "100%",
}) => {
  const runtimeErrors = (error) => {
    return true;
  };

  return (
    <div className="slide-container">
      <Fade
        duration={interval}
        overlay={{ runtimeErrors }}
        arrows={false}
        canSwipe
        pauseOnHover
        indicators
      >
        {images.map((image, index) => (
          <div key={`image-slider-${index}`}>
            <img
              src={`${appSettings.API_PROXY}/images/${image}`}
              alt={`Slide ${index}`}
              style={{
                width: width,
                height: height,
                objectFit: "fill",
                borderRadius: 8,
                aspectRatio: "16 / 9",
              }}
            />
          </div>
        ))}
      </Fade>
    </div>
  );
};

export default ImageSlider;
