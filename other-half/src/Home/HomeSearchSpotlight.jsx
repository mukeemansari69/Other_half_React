import { ArrowUpRight, Search, Sparkles, Tag } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  discoveryCategories,
  findDiscoverySuggestions,
} from "../../shared/discoverySearch.js";

const HomeSearchSpotlight = () => {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 180);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchQuery]);

  const suggestions = useMemo(
    () =>
      findDiscoverySuggestions(debouncedQuery, {
        productLimit: 3,
        categoryLimit: 4,
      }),
    [debouncedQuery]
  );
  const popularCategories = useMemo(() => discoveryCategories.slice(0, 4), []);
  const hasTypedQuery = searchQuery.trim().length > 0;
  const showPanel = isFocused || hasTypedQuery;

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();
    navigate(
      trimmedQuery
        ? `/collection?search=${encodeURIComponent(trimmedQuery)}`
        : "/collection"
    );
    setIsFocused(false);
  };

  const handleBlurCapture = (event) => {
    if (wrapperRef.current?.contains(event.relatedTarget)) {
      return;
    }

    setIsFocused(false);
  };

  return (
    <div
      ref={wrapperRef}
      className="hero-search"
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={handleBlurCapture}
    >
      <div className="hero-search__header">
        <div>
          <p className="hero-search__eyebrow">Search the collection</p>
          <h2 className="hero-search__title">Find the right routine faster.</h2>
        </div>
        <span className="hero-search__badge">
          <Sparkles size={14} />
          Live suggestions
        </span>
      </div>

      <form className="hero-search__form" onSubmit={handleSubmit}>
        <Search size={18} />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search Everyday, dental, immunity, digestion..."
          aria-label="Search products and wellness categories"
        />
        <button type="submit">Search</button>
      </form>

      <div className="hero-search__chips">
        {popularCategories.map((category) => (
          <Link
            key={category.id}
            to={`/collection?topic=${encodeURIComponent(category.label)}`}
            className="hero-search__chip"
          >
            {category.label}
          </Link>
        ))}
      </div>

      {showPanel ? (
        <div className="hero-search__panel">
          <div className="hero-search__panel-section">
            <div className="hero-search__panel-heading">
              <span className="hero-search__panel-icon">
                <Search size={14} />
              </span>
              <span>{hasTypedQuery ? "Matching products" : "Popular picks"}</span>
            </div>

            <div className="hero-search__results">
              {suggestions.products.length > 0 ? (
                suggestions.products.map((product) => (
                  <Link
                    key={product.productId}
                    to={product.route}
                    className="hero-search__result-card"
                    onClick={() => setIsFocused(false)}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      loading="lazy"
                      decoding="async"
                    />
                    <div>
                      <p className="hero-search__result-title">{product.title}</p>
                      <p className="hero-search__result-meta">
                        {product.rating} stars · {product.reviews} reviews
                      </p>
                    </div>
                    <ArrowUpRight size={15} />
                  </Link>
                ))
              ) : (
                <Link
                  to={`/collection?search=${encodeURIComponent(searchQuery.trim())}`}
                  className="hero-search__empty"
                  onClick={() => setIsFocused(false)}
                >
                  No direct product match yet. Open the full collection for broader results.
                </Link>
              )}
            </div>
          </div>

          <div className="hero-search__panel-section">
            <div className="hero-search__panel-heading">
              <span className="hero-search__panel-icon">
                <Tag size={14} />
              </span>
              <span>{hasTypedQuery ? "Matching categories" : "Popular categories"}</span>
            </div>

            <div className="hero-search__category-grid">
              {(suggestions.categories.length > 0
                ? suggestions.categories
                : popularCategories
              ).map((category) => (
                <Link
                  key={category.id}
                  to={`/collection?topic=${encodeURIComponent(category.label)}`}
                  className="hero-search__category-card"
                  onClick={() => setIsFocused(false)}
                >
                  <span className="hero-search__category-label">{category.label}</span>
                  <span className="hero-search__category-count">
                    {category.count} product{category.count === 1 ? "" : "s"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default HomeSearchSpotlight;
