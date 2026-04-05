import React from "react";
import { NavLink } from "react-router-dom";
import { ArrowRight, BookOpenText, CalendarDays, Clock3, Microscope, Sparkles } from "lucide-react";

import Marque from "../Home/Marque";
import Features from "../Home/Features";
import "/public/Blog/css/blog.css";

const featuredPost = {
  category: "Featured Story",
  date: "April 2026",
  readTime: "6 min read",
  title: "Why daily routines matter more than dramatic one-time fixes.",
  excerpt:
    "Strong dog wellness habits are built from repeatable actions. This feature story shows how simple scoop-based routines create better long-term outcomes for energy, digestion, immunity, and oral care.",
  image: "/OurStory/images/story-banner.jpg",
  route: "/science",
};

const categoryCards = [
  {
    title: "Nutrition Science",
    text: "Ingredient logic, formula thinking, and how wellness blends are built to solve multiple needs at once.",
    icon: Microscope,
  },
  {
    title: "Everyday Routines",
    text: "Practical feeding habits, scoop systems, and ways to make healthy support easier for busy dog parents.",
    icon: Sparkles,
  },
  {
    title: "Product Education",
    text: "Short reads that connect your product pages with deeper context shoppers can understand quickly.",
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
    image: "/Home/images/d1.jpg",
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
    image: "/Home/images/d2.jpg",
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
    image: "/Home/images/d3.jpg",
    route: "/dailyduo",
  },
  {
    id: "post-4",
    category: "Integrity",
    date: "March 28, 2026",
    readTime: "5 min read",
    title: "Ingredient integrity is not just a label, it is a trust system.",
    excerpt:
      "Shoppers do not only buy outcomes. They buy confidence in sourcing, manufacturing, and the standards behind the formula.",
    image: "/Integrity/images/no-filler.jpg",
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
    image: "/Glossary/images/banner.jpg",
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
    image: "/OurStory/images/nextstep.jpg",
    route: "/story",
  },
];

const quickNotes = [
  {
    label: "Fresh insights",
    value: "06",
    text: "Blog-style articles are already prepared in a card-based layout with hover interaction.",
  },
  {
    label: "Core themes",
    value: "03",
    text: "Science, routines, and education are highlighted so the page feels useful, not just decorative.",
  },
  {
    label: "Direct paths",
    value: "100%",
    text: "Each post card sends users to a relevant existing page in your project.",
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
          <span className="blog-eyebrow">Latest reads for the pack</span>
          <h1 className="blog-hero__title">A Blog Page That Feels Like The Rest Of Your Brand.</h1>
          <p className="blog-hero__text">
            Is page ko project ke current look and feel ke mutabiq design kiya gaya hai.
            React component hai, external CSS use ho rahi hai, aur layout playful green-yellow
            brand language ke saath blog style cards mein build hua hai.
          </p>

          <div className="blog-hero__actions">
            <a href="#latest-reads" className="blog-button blog-button--dark">
              Browse articles
              <ArrowRight size={16} />
            </a>
            <NavLink to="/science" className="blog-button blog-button--light">
              Explore science
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
              <img src={featuredPost.image} alt={featuredPost.title} className="blog-featured-card__image" />
            </div>

            <div className="blog-featured-card__content">
              <span className="blog-chip blog-chip--orange">{featuredPost.category}</span>
              <MetaLine date={featuredPost.date} readTime={featuredPost.readTime} />
              <h2 className="blog-featured-card__title">{featuredPost.title}</h2>
              <p className="blog-featured-card__text">{featuredPost.excerpt}</p>
              <NavLink to={featuredPost.route} className="blog-button blog-button--dark">
                Read featured post
                <ArrowRight size={16} />
              </NavLink>
            </div>
          </article>
        </div>
      </section>

      <section className="blog-section blog-section--categories">
        <div className="blog-container">
          <div className="blog-heading">
            <span className="blog-chip blog-chip--green">What the blog covers</span>
            <h2 className="blog-heading__title">Useful topics, not filler content.</h2>
            <p className="blog-heading__text">
              Blog page mein aise sections rakhe gaye hain jo brand, science, aur product education ko ek saath support karte hain.
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
            <span className="blog-chip blog-chip--lime">Latest reads</span>
            <h2 className="blog-heading__title">Fresh posts styled like clickable product cards.</h2>
            <p className="blog-heading__text">
              Hover effect, image-first layout, clear headings aur CTA buttons ke saath blog page ko same project energy di gayi hai.
            </p>
          </div>

          <div className="blog-post-grid">
            {blogPosts.map((post) => (
              <article key={post.id} className="blog-post-card">
                <div className="blog-post-card__media">
                  <img src={post.image} alt={post.title} className="blog-post-card__image" />
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
            <span className="blog-eyebrow blog-eyebrow--dark">Final section</span>
            <h2 className="blog-cta__title">Turn readers into product-aware shoppers.</h2>
            <p className="blog-cta__text">
              Blog page ko sirf articles tak limited nahi rakha gaya. Isay is tarah design kiya gaya hai ke user
              reading ke baad science, story, glossary, ya direct product pages ki taraf move kar sake.
            </p>

            <div className="blog-cta__actions">
              <NavLink to="/collection" className="blog-button blog-button--light">
                Visit collection
                <ArrowRight size={16} />
              </NavLink>
              <NavLink to="/story" className="blog-button blog-button--dark">
                Read our story
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
