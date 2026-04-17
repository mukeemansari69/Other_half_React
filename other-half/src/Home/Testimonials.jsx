import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import "/public/Home/css/testimonials.css";
import { apiRequest } from "../lib/api.js";
import testimonialsData from "../testimonialsData.js";
import { resolveReviewProduct } from "../../shared/reviewProductCatalog.js";

const MAX_STARS = 5;

const Stars = ({ count }) => {
  const normalizedCount = Math.max(0, Math.min(MAX_STARS, count));

  return (
    <div className="stars">
      {[...Array(MAX_STARS)].map((_, index) => (
        <span key={index} className={index < normalizedCount ? "star filled" : "star"}>
          {"\u2605"}
        </span>
      ))}
    </div>
  );
};

const mapApiReviewToCard = (review) => ({
  id: review.id,
  productId: review.productId,
  name: review.customerName,
  profile: review.customerProfile,
  image: review.customerImage,
  rating: review.rating,
  title: review.title,
  description: review.description,
});

export default function Testimonials({ items = testimonialsData }) {
  const location = useLocation();
  const sectionRef = useRef(null);
  const [apiReviews, setApiReviews] = useState([]);
  const reviewProductId = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("reviewsProduct") || "";
  }, [location.search]);

  useEffect(() => {
    let isActive = true;

    const loadReviews = async () => {
      try {
        const query = reviewProductId
          ? `/reviews?productId=${encodeURIComponent(reviewProductId)}`
          : "/reviews";
        const response = await apiRequest(query);

        if (!isActive) {
          return;
        }

        setApiReviews((response.reviews || []).map(mapApiReviewToCard));
      } catch {
        if (isActive) {
          setApiReviews([]);
        }
      }
    };

    loadReviews();

    return () => {
      isActive = false;
    };
  }, [reviewProductId]);

  const fallbackItems = useMemo(() => {
    const filteredItems = reviewProductId
      ? items.filter((item) => item.productId === reviewProductId)
      : items;

    if (filteredItems.length > 0) {
      return filteredItems;
    }

    return items;
  }, [items, reviewProductId]);

  const displayItems = apiReviews.length > 0 ? apiReviews : fallbackItems;
  const reviewProduct = reviewProductId
    ? resolveReviewProduct({ productId: reviewProductId })
    : null;
  const shouldScrollToReviews = location.hash === "#reviews";

  useLayoutEffect(() => {
    if (!shouldScrollToReviews) {
      return undefined;
    }

    let animationFrameId = null;
    let timeoutId = null;

    const scrollToReviews = () => {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      section.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    };

    animationFrameId = window.requestAnimationFrame(scrollToReviews);
    timeoutId = window.setTimeout(scrollToReviews, 120);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [displayItems.length, reviewProductId, shouldScrollToReviews]);

  return (
    <section ref={sectionRef} id="reviews" className="testimonial-section w-full">
      <div className="max-w-[1920px] mx-auto">
        <div className="testimonial-container">
          {reviewProduct ? (
            <p className="testimonial-kicker">
              Showing pack reviews for {reviewProduct.productName}
            </p>
          ) : null}

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
            loop={displayItems.length > 1}
            loopAdditionalSlides={displayItems.length}
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
            {displayItems.map((review) => (
              <SwiperSlide key={review.id}>
                <div className="testimonial-card">
                  <div className="card-content">
                    <Stars count={review.rating} />
                    <h3 className="card-title">{review.title}</h3>
                    <p className="card-desc">{review.description}</p>
                  </div>

                  <div className="card-user">
                    <img src={review.image} alt={review.name} loading="lazy" decoding="async" />
                    <div className="card-user-details">
                      <span className="card-user-name">{review.name}</span>
                      <p className="card-user-meta">{review.profile}</p>
                    </div>
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


