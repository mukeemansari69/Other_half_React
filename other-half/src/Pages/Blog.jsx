import React from "react";
import { NavLink } from "react-router-dom";
import { ArrowRight, BookOpenText, CalendarDays, Clock3, Microscope, Sparkles } from "lucide-react";

import Marque from "../Home/Marque";
import Features from "../Home/Features";
import "/public/Blog/css/blog.css";

const featuredPost = {
  category: "Editor’s Pick ⭐",
  date: "April 2026",
  readTime: "6 min read",
  title: "Real Dog Health Starts with Daily Habits, Not Trends",
  excerpt:
    "Long-term dog health isn’t built overnight. From better digestion to stronger immunity and cleaner teeth, consistent daily routines create results that quick fixes never can. Here’s how simple habits can transform your dog’s wellbeing.",
  image: "/OurStory/images/story-banner.webp",
  route: "/science",
};

const categoryCards = [
  {
    title: "Nutrition Science",
    text: "Understand what actually goes into your dog’s body — from ingredient quality to how balanced formulas support digestion, energy, and long-term health.",
    icon: Microscope,
  },
  {
    title: "Everyday Routines",
    text: "Simple daily habits that create lasting results — from feeding schedules to dental care routines that fit easily into your lifestyle.",
    icon: Sparkles,
  },
  {
    title: "Product Education",
    text: "Clear, honest breakdowns of how our products work, why they matter, and how to use them effectively for real results.",
    icon: BookOpenText,
  },
];

const blogPosts = [
  {
    id: "post-1",
    category: "Science",
    date: "April 04, 2026",
    readTime: "5 min read",
    title: "How a multivitamin supports more than one problem at the same time.",
    excerpt:
      "A closer look at how joint, gut, immunity, and coat support can live inside one daily scoop when a formula is built with system-wide thinking.",
    image: "/Home/images/d1.webp",
    route: "/product",
  },
  {
    id: "post-2",
    category: "Oral Care",
    date: "April 02, 2026",
    readTime: "4 min read",
    title: "Why no-brush dental support gets better compliance from real households.",
    excerpt:
      "The easier the habit, the more likely pet parents stick with it. That is where powder-based oral care changes the game.",
    image: "/Home/images/d2.webp",
    route: "/doggie-dental",
  },
  {
    id: "post-3",
    category: "Bundle Thinking",
    date: "March 30, 2026",
    readTime: "6 min read",
    title: "What makes a bundle feel useful instead of overwhelming.",
    excerpt:
      "A good bundle removes decision fatigue and turns multiple health goals into one easy routine. Here is the logic behind that.",
    image: "/Home/images/d3.webp",
    route: "/daily-duo",
  },
  {
    id: "post-4",
    category: "Integrity",
    date: "March 28, 2026",
    readTime: "5 min read",
    title: "Ingredient integrity is not just a label, it is a trust system.",
    excerpt:
      "Shoppers do not only buy outcomes. They buy confidence in sourcing, manufacturing, and the standards behind the formula.",
    image: "/Integrity/images/no-filler.webp",
    route: "/integrity",
  },
  {
    id: "post-5",
    category: "Glossary",
    date: "March 24, 2026",
    readTime: "4 min read",
    title: "How ingredient glossaries help shoppers understand formulas faster.",
    excerpt:
      "When customers recognize what ingredients do, they make decisions faster and trust the product page more deeply.",
    image: "/Glossary/images/banner.webp",
    route: "/glossary",
  },
  {
    id: "post-6",
    category: "Brand Story",
    date: "March 20, 2026",
    readTime: "7 min read",
    title: "Behind the scenes of a brand that wants wellness to feel simpler.",
    excerpt:
      "Every strong pet brand needs a point of view. This story-style post connects education, design, and product purpose together.",
    image: "/OurStory/images/nextstep.webp",
    route: "/our-story",
  },
];

const quickNotes = [
  {
    label: "Fresh insights",
    value: "06",
    text: "Expert-written blog posts designed to simplify dog health into actionable insights",
  },
  {
    label: "What We Focus On",
    value: "05",
    text: "Carefully selected topics that actually impact your dog’s daily life.",
  },
  {
    label: "Direct paths",
    value: "100%",
    text: "Every article connects you to relevant products and deeper insights instantly.",
  },
];

const MetaLine = ({ date, readTime }) => (
  <div className="blog-meta">
    <span className="blog-meta__item">
      <CalendarDays size={15} />
      {date}
    </span>
    <span className="blog-meta__item">
      <Clock3 size={15} />
      {readTime}
    </span>
  </div>
);

const Blog = () => {
  return (
    <main className="blog-page">
      <section className="blog-hero">
        <div className="blog-container">
          <span className="blog-eyebrow">Expert Tips for Happy Paws</span>
          <h1 className="blog-hero__title">Where Smart Dog Parents Learn Better Care.</h1>
          <p className="blog-hero__text">
            Your dog depends on you for everything — we make it easier with trusted advice, simple routines, and science-backed care guides.
          </p>

          <div className="blog-hero__actions">
            <a href="#latest-reads" className="blog-button blog-button--dark">
              Start Learning
              <ArrowRight size={16} />
            </a>
            <NavLink to="/science" className="blog-button blog-button--light">
             Explore Dog Health Science ⭐
              <ArrowRight size={16} />
            </NavLink>
          </div>
        </div>
      </section>

      <Marque />

      <section className="blog-section blog-section--featured">
        <div className="blog-container">
          <article className="blog-featured-card">
            <div className="blog-featured-card__media">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                loading="lazy"
                decoding="async"
                className="blog-featured-card__image"
              />
            </div>

            <div className="blog-featured-card__content">
              <span className="blog-chip blog-chip--orange">{featuredPost.category}</span>
              <MetaLine date={featuredPost.date} readTime={featuredPost.readTime} />
              <h2 className="blog-featured-card__title">{featuredPost.title}</h2>
              <p className="blog-featured-card__text">{featuredPost.excerpt}</p>
              <NavLink to={featuredPost.route} className="blog-button blog-button--dark">
                Read Full Story
                <ArrowRight size={16} />
              </NavLink>
            </div>
          </article>
        </div>
      </section>

      <section className="blog-section blog-section--categories">
        <div className="blog-container">
          <div className="blog-heading">
            <span className="blog-chip blog-chip--green">What You’ll Learn</span>
            <h2 className="blog-heading__title">Real Knowledge for Better Dog Care, Not Just Content.</h2>
            <p className="blog-heading__text">
             Our blog is designed to simplify dog health — combining science, practical routines, and product education so you can make better decisions every day.
            </p>
          </div>

          <div className="blog-category-grid">
            {categoryCards.map(({ title, text, icon: Icon }) => (
              <article key={title} className="blog-category-card">
                <div className="blog-category-card__icon">
                  {React.createElement(Icon, { size: 22 })}
                </div>
                <h3 className="blog-category-card__title">{title}</h3>
                <p className="blog-category-card__text">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="latest-reads" className="blog-section blog-section--posts">
        <div className="blog-container">
          <div className="blog-heading">
            <span className="blog-chip blog-chip--lime">Must Read for Dog Parents</span>
            <h2 className="blog-heading__title">Why Daily Routines Matter More Than Quick Fixes for Your Dog’s Health</h2>
            <p className="blog-heading__text">
              From nutrition and dental care to daily wellness routines, explore expert-backed guides designed to keep your dog healthier, happier, and full of life.
            </p>
          </div>

          <div className="blog-post-grid">
            {blogPosts.map((post) => (
              <article key={post.id} className="blog-post-card">
                <div className="blog-post-card__media">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    className="blog-post-card__image"
                  />
                </div>

                <div className="blog-post-card__content">
                  <span className="blog-chip blog-chip--outline">{post.category}</span>
                  <MetaLine date={post.date} readTime={post.readTime} />
                  <h3 className="blog-post-card__title">{post.title}</h3>
                  <p className="blog-post-card__text">{post.excerpt}</p>

                  <NavLink to={post.route} className="blog-inline-link">
                    Open page
                    <ArrowRight size={15} />
                  </NavLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Features />

      <section className="blog-section blog-section--notes">
        <div className="blog-container">
          <div className="blog-notes">
            {quickNotes.map((item) => (
              <article key={item.label} className="blog-note-card">
                <p className="blog-note-card__label">{item.label}</p>
                <p className="blog-note-card__value">{item.value}</p>
                <p className="blog-note-card__text">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="blog-section blog-section--cta">
        <div className="blog-container">
          <div className="blog-cta">
            <span className="blog-eyebrow blog-eyebrow--dark">Start Your Journey ⭐</span>
            <h2 className="blog-cta__title">Turn Knowledge Into Better Care for Your Dog.</h2>
            <p className="blog-cta__text">
             Don’t stop at learning. Take action with products and routines built to deliver real, visible results for your dog.
            </p>

            <div className="blog-cta__actions">
              <NavLink to="/collection" className="blog-button blog-button--light">
                Visit collection
                <ArrowRight size={16} />
              </NavLink>
              <NavLink to="/our-story" className="blog-button blog-button--dark">
               Explore Our Approach
                <ArrowRight size={16} />
              </NavLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Blog;


