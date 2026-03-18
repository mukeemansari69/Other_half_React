import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "/public/Home/css/testimonials.css";

const reviews = [
  {
    id: 1,
    name: "Laura, Max’s Owner",
    image: "/Home/images/d1.jpg",
    rating: 4,
    title: "My dog is like a puppy again!",
    desc: "After just a few weeks of using Everyday One, my 8-year-old Labrador is running around like he's 2 again. His coat is shinier, and he seems happier overall.",
  },
  {
    id: 2,
    name: "Laura, Max’s Owner",
    image: "/Home/images/d2.jpg",
    rating: 4,
    title: "My dog is like a puppy again!",
    desc: "After just a few weeks of using Everyday One, my 8-year-old Labrador is running around like he's 2 again. His coat is shinier.",
  },
  {
    id: 3,
    name: "Laura, Max’s Owner",
    image: "/Home/images/d3.jpg",
    rating: 4,
    title: "My dog is like a puppy again!",
    desc: "After just a few weeks of using Everyday One, my 8-year-old Labrador is running around like he's 2 again.",
  },
  {
    id: 4,
    name: "Laura, Max’s Owner",
    image: "/Home/images/d4.jpg",
    rating: 4,
    title: "My dog is like a puppy again!",
    desc: "After just a few weeks of using Everyday One, my 8-year-old Labrador is running around like he's 2 again.",
  },
  {
    id: 5,
    name: "Laura, Max’s Owner",
    image: "/Home/images/d4.jpg",
    rating: 4,
    title: "My dog is like a puppy again!",
    desc: "After just a few weeks of using Everyday One, my 8-year-old Labrador is running around like he's 2 again.",
  },
  {
    id: 6,
    name: "Laura, Max’s Owner",
    image: "/Home/images/d4.jpg",
    rating: 4,
    title: "My dog is like a puppy again!",
    desc: "After just a few weeks of using Everyday One, my 8-year-old Labrador is running around like he's 2 again.",
  },
  {
    id: 7,
    name: "Laura, Max’s Owner",
    image: "/Home/images/d4.jpg",
    rating: 4,
    title: "My dog is like a puppy again!",
    desc: "After just a few weeks of using Everyday One, my 8-year-old Labrador is running around like he's 2 again.",
  },
  {
    id: 8,
    name: "Laura, Max’s Owner",
    image: "/Home/images/d4.jpg",
    rating: 4,
    title: "My dog is like a puppy again!",
    desc: "After just a few weeks of using Everyday One, my 8-year-old Labrador is running around like he's 2 again.",
  },
];

const Stars = ({ count }) => {
  return (
    <div className="stars">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < count ? "star filled" : "star"}>
          ★
        </span>
      ))}
    </div>
  );
};

export default function Testimonials() {
  return (
    <section className="testimonial-section w-full">
      
      {/* ✅ 1920 CENTER CONTAINER */}
      <div className="max-w-[1920px] mx-auto px-6">

        <div className="testimonial-container">

          <h2 className="testimonial-heading">
            LOVED BY PET PARENTS,
            <br />
            TRUSTED BY OVER 4 MILLION FURRY TAILS
          </h2>

          <Swiper
            className="testimonial-swiper"
            modules={[Autoplay]}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            loop={true}
            loopAdditionalSlides={8}
            loopFillGroupWithBlank={true}
            spaceBetween={24}
            slidesPerView={1.5}
            centeredSlides={false}
            watchSlidesProgress={true}
            breakpoints={{
              640: { slidesPerView: 1.5 },
              768: { slidesPerView: 2.5 },
              1024: { slidesPerView: 3.5 },
              1280: { slidesPerView: 4.5 },
            }}
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id}>
                <div className="testimonial-card">

                  <div className="card-content">
                    <Stars count={review.rating} />

                    <h3 className="card-title">{review.title}</h3>

                    <p className="card-desc">{review.desc}</p>
                  </div>

                  <div className="card-user">
                    <img src={review.image} alt="user" />
                    <span>{review.name}</span>
                  </div>

                </div>
              </SwiperSlide>
            ))}
          </Swiper>

        </div>
      </div>
    </section>
  );
}