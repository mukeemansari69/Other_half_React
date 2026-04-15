import { Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../lib/api.js";

const ratingChoices = [1, 2, 3, 4, 5];

const buildInitialFormState = () => ({
  productId: "",
  title: "",
  rating: 5,
  description: "",
});

const getReviewErrors = (formState) => {
  const errors = {};

  if (!formState.productId) {
    errors.productId = "Please choose a purchased product first.";
  }

  if (!formState.title.trim()) {
    errors.title = "Please add a short review title.";
  } else if (formState.title.trim().length < 4) {
    errors.title = "Title should be at least 4 characters long.";
  }

  if (!Number.isFinite(Number(formState.rating)) || formState.rating < 1 || formState.rating > 5) {
    errors.rating = "Please select a rating between 1 and 5 stars.";
  }

  if (!formState.description.trim()) {
    errors.description = "Please describe your experience with the product.";
  } else if (formState.description.trim().length < 20) {
    errors.description = "Description should be at least 20 characters long.";
  }

  return errors;
};

const ReviewPage = () => {
  const location = useLocation();
  const { token, user } = useAuth();
  const [eligibleProducts, setEligibleProducts] = useState([]);
  const [formState, setFormState] = useState(buildInitialFormState);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submittedReview, setSubmittedReview] = useState(null);

  useEffect(() => {
    let isActive = true;

    const loadEligibleProducts = async () => {
      setLoading(true);

      try {
        const response = await apiRequest("/reviews/eligible", { token });

        if (!isActive) {
          return;
        }

        const products = response.products || [];
        setEligibleProducts(products);
        setFormState((currentState) => ({
          ...currentState,
          productId: currentState.productId || products[0]?.productId || "",
        }));
      } catch (error) {
        if (isActive) {
          setStatus({
            type: "error",
            message: error.message || "Purchased products could not be loaded for review.",
          });
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadEligibleProducts();

    return () => {
      isActive = false;
    };
  }, [token]);

  const selectedProduct = useMemo(() => {
    return (
      eligibleProducts.find((product) => product.productId === formState.productId) || null
    );
  }, [eligibleProducts, formState.productId]);

  const visibleErrors = useMemo(() => {
    return Object.fromEntries(
      Object.entries(fieldErrors).filter(([field]) => touchedFields[field] || submitting)
    );
  }, [fieldErrors, submitting, touchedFields]);

  const updateField = (field, value) => {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }));

    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  };

  const markTouched = (field) => {
    setTouchedFields((currentState) => ({
      ...currentState,
      [field]: true,
    }));

    const nextErrors = getReviewErrors(formState);
    setFieldErrors(nextErrors);
  };

  const getFieldClassName = (field) => {
    const hasError = Boolean(visibleErrors[field]);

    return `w-full rounded-[24px] border px-4 py-3 text-[#1A1A1A] outline-none transition ${
      hasError
        ? "border-[#0F4A12] bg-[#F4FAEA] shadow-[0_0_0_4px_rgba(15,74,18,0.08)]"
        : "border-[#D9D1BF] bg-[#FBF8EF] focus:border-[#0F4A12]"
    }`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = getReviewErrors(formState);
    setFieldErrors(nextErrors);
    setTouchedFields({
      productId: true,
      title: true,
      rating: true,
      description: true,
    });

    if (Object.keys(nextErrors).length > 0) {
      setStatus({
        type: "error",
        message: "Please complete the required review details before submitting.",
      });
      return;
    }

    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await apiRequest("/reviews", {
        method: "POST",
        token,
        body: {
          productId: formState.productId,
          title: formState.title.trim(),
          rating: formState.rating,
          description: formState.description.trim(),
          customerProfile: `${user?.subscription?.dogProfile?.breed || "Dog parent"} | ${
            selectedProduct?.productName || "PetPlus customer"
          }`,
        },
      });

      setSubmittedReview(response.review);
      setStatus({
        type: "success",
        message: response.message || "Review submitted successfully.",
      });
      setEligibleProducts((currentProducts) =>
        currentProducts.filter((product) => product.productId !== formState.productId)
      );
      setFormState({
        productId: "",
        title: "",
        rating: 5,
        description: "",
      });
      setTouchedFields({});
      setFieldErrors({});
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Review could not be submitted right now.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-[#FBF8EF] px-6 py-14 md:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl rounded-[36px] border border-[#E6DFCF] bg-white p-10 text-center shadow-[0_24px_80px_rgba(34,30,18,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F4A12]">
            Review page
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-[#1A1A1A]">
            Loading your purchased products...
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#FBF8EF] px-6 py-10 md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1180px] space-y-6">
        <section className="rounded-[36px] bg-[#163B1D] p-8 text-white shadow-[0_32px_100px_rgba(13,32,18,0.22)] md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#EBF466]">
            Review page
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
            Share how your dog's routine is going.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/80 md:text-base">
            Your review helps other dog parents choose with more confidence. Add a
            title, star rating, and honest description for any product you purchased.
          </p>
          {location.state?.fromCheckout ? (
            <div className="mt-6 rounded-[24px] border border-white/15 bg-white/10 px-5 py-4 text-sm leading-7 text-white/86">
              {location.state?.message ||
                "Thanks for your order. If you have already started using the product, you can leave a quick review here now, or come back later from your account."}
            </div>
          ) : null}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[36px] border border-[#E6DFCF] bg-white p-8 shadow-[0_24px_80px_rgba(34,30,18,0.08)] md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F4A12]">
              Purchased products
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-[#1A1A1A]">
              Choose what you want to review
            </h2>

            <div className="mt-8 grid gap-4">
              {eligibleProducts.length > 0 ? (
                eligibleProducts.map((product) => {
                  const isSelected = product.productId === formState.productId;

                  return (
                    <button
                      key={product.productId}
                      type="button"
                      onClick={() => {
                        updateField("productId", product.productId);
                        setTouchedFields((currentState) => ({
                          ...currentState,
                          productId: true,
                        }));
                      }}
                      className={`rounded-[28px] border px-5 py-5 text-left transition ${
                        isSelected
                          ? "border-[#0F4A12] bg-[#F4FAEA]"
                          : "border-[#E6DFCF] bg-[#FBF8EF] hover:border-[#0F4A12]"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={product.image}
                          alt={product.productName}
                          className="h-16 w-16 rounded-[18px] bg-white object-contain p-2"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-[#1A1A1A]">
                            {product.productName}
                          </h3>
                          <p className="mt-1 text-sm text-[#645E53]">
                            Purchased on{" "}
                            {new Intl.DateTimeFormat("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }).format(new Date(product.purchasedAt))}
                          </p>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#0F4A12]">
                            Order {product.sourceOrderNumber}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="rounded-[28px] bg-[#FBF8EF] px-5 py-6 text-sm leading-7 text-[#5C584D]">
                  No reviewable purchased products are available right now. Once you place
                  an order from your account, it will show up here.
                </div>
              )}
            </div>
          </article>

          <article className="rounded-[36px] border border-[#E6DFCF] bg-white p-8 shadow-[0_24px_80px_rgba(34,30,18,0.08)] md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F4A12]">
              Submit review
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-[#1A1A1A]">
              Add a title, stars, and honest notes
            </h2>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#353126]">Product</span>
                <select
                  value={formState.productId}
                  onChange={(event) => updateField("productId", event.target.value)}
                  onBlur={() => markTouched("productId")}
                  className={getFieldClassName("productId")}
                >
                  <option value="">Choose a product you purchased</option>
                  {eligibleProducts.map((product) => (
                    <option key={product.productId} value={product.productId}>
                      {product.productName}
                    </option>
                  ))}
                </select>
                {visibleErrors.productId ? (
                  <p className="mt-2 text-sm font-medium text-[#0F4A12]">
                    {visibleErrors.productId}
                  </p>
                ) : null}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#353126]">Review title</span>
                <input
                  type="text"
                  value={formState.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  onBlur={() => markTouched("title")}
                  className={getFieldClassName("title")}
                  placeholder="Example: Helped my dog feel more active"
                />
                {visibleErrors.title ? (
                  <p className="mt-2 text-sm font-medium text-[#0F4A12]">
                    {visibleErrors.title}
                  </p>
                ) : null}
              </label>

              <div>
                <span className="mb-2 block text-sm font-medium text-[#353126]">Rating</span>
                <div
                  className={`flex flex-wrap gap-3 rounded-[24px] border px-4 py-4 ${
                    visibleErrors.rating
                      ? "border-[#0F4A12] bg-[#F4FAEA]"
                      : "border-[#D9D1BF] bg-[#FBF8EF]"
                  }`}
                >
                  {ratingChoices.map((choice) => {
                    const isActive = choice <= formState.rating;

                    return (
                      <button
                        key={choice}
                        type="button"
                        onClick={() => {
                          updateField("rating", choice);
                          markTouched("rating");
                        }}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                          isActive
                            ? "border-[#0F4A12] bg-[#0F4A12] text-white"
                            : "border-[#D9D1BF] bg-white text-[#1A1A1A]"
                        }`}
                      >
                        <Star size={16} className={isActive ? "fill-current" : ""} />
                        <span>{choice}</span>
                      </button>
                    );
                  })}
                </div>
                {visibleErrors.rating ? (
                  <p className="mt-2 text-sm font-medium text-[#0F4A12]">
                    {visibleErrors.rating}
                  </p>
                ) : null}
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#353126]">
                  Review description
                </span>
                <textarea
                  value={formState.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  onBlur={() => markTouched("description")}
                  className={`${getFieldClassName("description")} min-h-[180px] resize-y`}
                  placeholder="Tell other dog parents what changed, how the routine felt, and what stood out most for your dog."
                />
                {visibleErrors.description ? (
                  <p className="mt-2 text-sm font-medium text-[#0F4A12]">
                    {visibleErrors.description}
                  </p>
                ) : null}
              </label>

              {status.message ? (
                <div
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    status.type === "success"
                      ? "bg-[#EEF6E7] text-[#0F4A12]"
                      : "bg-[#FFF1EE] text-[#A13A2C]"
                  }`}
                >
                  {status.message}
                </div>
              ) : null}

              <button
                type="submit"
                className="w-full rounded-full bg-[#0F4A12] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                disabled={submitting || eligibleProducts.length === 0}
              >
                {submitting ? "Submitting review..." : "Submit review"}
              </button>
            </form>

            {submittedReview ? (
              <div className="mt-6 rounded-[28px] bg-[#FBF8EF] p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#0F4A12]">
                  Review submitted
                </p>
                <h3 className="mt-2 text-xl font-semibold text-[#1A1A1A]">
                  {submittedReview.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#5C584D]">
                  Your review is now part of the pack feedback shown across the site.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    to={submittedReview.productRoute}
                    className="rounded-full bg-[#0F4A12] px-5 py-3 text-sm font-semibold text-white"
                  >
                    Open product page
                  </Link>
                  <Link
                    to={`/?reviewsProduct=${submittedReview.productId}#reviews`}
                    className="rounded-full border border-[#D6D0C1] px-5 py-3 text-sm font-semibold text-[#1A1A1A]"
                  >
                    See all reviews
                  </Link>
                </div>
              </div>
            ) : null}
          </article>
        </section>
      </div>
    </main>
  );
};

export default ReviewPage;
