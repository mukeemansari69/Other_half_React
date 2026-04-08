import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bone,
  Compass,
  HeartHandshake,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import "/public/Default/css/notFoundPage.css";

const dogModes = [
  {
    key: "sniff",
    label: "Trail check",
    title: "Our pup is sniffing out the right path for you.",
    copy:
      "This page wandered off, but your search still points toward something good for your dog's routine. Let's guide you back to a page that actually helps.",
    bubble: "Sniff...",
    noteLabel: "Gentle redirect",
    noteCopy: "Every wrong click can still lead back to a healthier bowl, happier breath, and a calmer routine.",
  },
  {
    key: "bark",
    label: "Pack alert",
    title: "Wrong URL. Right mission: helping dogs feel their best.",
    copy:
      "Whether you came looking for daily wellness, dental support, or account help, you're still only one good click away from the page your dog would pick for you.",
    bubble: "Woof!",
    noteLabel: "Attention needed",
    noteCopy: "When your dog needs care, even small next steps matter. We kept the best recovery links close.",
  },
  {
    key: "wag",
    label: "Tail-wag mode",
    title: "Your dog's next better day is still close.",
    copy:
      "The best routines are simple, consistent, and full of heart. Let's get you back to the products, quiz, or support pages that make everyday care feel easier.",
    bubble: "Let's go!",
    noteLabel: "Back on track",
    noteCopy: "Real dog care is emotional too. Behind every search is someone trying to do right by the pup waiting at home.",
  },
];

const reassuranceCards = [
  {
    title: "Dog-first formulas",
    text: "Daily wellness and oral care made for routines that actually stick in real homes.",
    icon: ShieldCheck,
  },
  {
    title: "Simple next steps",
    text: "Go straight back to shopping, the quiz, or support without guessing where to click next.",
    icon: Sparkles,
  },
  {
    title: "Care with heart",
    text: "Because for most people here, their dog is family and every healthy habit matters.",
    icon: HeartHandshake,
  },
];

const recoveryCards = [
  {
    title: "Shop The Collection",
    text: "Jump back into the complete wellness lineup, from daily multivitamins to dental support and bundled routines.",
    to: "/collection",
    image: "/Default/images/col3.png",
    imageAlt: "Other Half product collection",
    kicker: "Most visited",
    icon: ShoppingBag,
  },
  {
    title: "Take The Quiz",
    text: "Answer a few quick questions and find a routine that fits your dog's size, goals, and everyday rhythm.",
    to: "/quiz",
    image: "/Home/images/q4.png",
    imageAlt: "Dog routine quiz illustration",
    kicker: "Find the fit",
    icon: Search,
  },
  {
    title: "Contact The Pack",
    text: "If you were looking for order help, subscription support, or product guidance, this is the fastest way back.",
    to: "/contact",
    image: "/Default/images/dogs3.jpg",
    imageAlt: "Dog looking toward the camera",
    kicker: "Need help?",
    icon: HeartHandshake,
  },
];

const NotFoundPage = () => {
  const [modeIndex, setModeIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setModeIndex((currentIndex) => (currentIndex + 1) % dogModes.length);
    }, 3200);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const activeMode = dogModes[modeIndex];

  return (
    <main className="not-found-page">
      <section className="not-found-hero">
        <div className="not-found-hero__banner">
          <p className="not-found-hero__code">404</p>
          <h1 className="not-found-hero__heading">404 Page Not Found</h1>
          <p className="not-found-hero__subheading">
            The page you are looking for is missing, but we can still help you find the
            right path for your dog.
          </p>
        </div>

        <div className="not-found-hero__inner">
          <div className="not-found-copy">
            <span className="not-found-chip">404 / Sniffed The Wrong Trail</span>

            <h2 className="not-found-title">Looks like this trail went cold.</h2>

            <p className="not-found-copy__lead">
              The page you were trying to reach is not here anymore, but the care behind
              your search still matters. Somewhere between better digestion, cleaner teeth,
              and a happier tail wag, this link wandered off. We can still get you back to
              something genuinely helpful for your dog.
            </p>

            <div className="not-found-actions">
              <Link to="/" className="not-found-button not-found-button--primary">
                <span>Back Home</span>
                <ArrowRight size={18} />
              </Link>

              <Link to="/collection" className="not-found-button not-found-button--secondary">
                <span>Shop Collection</span>
                <ArrowRight size={18} />
              </Link>

              <Link to="/faqPage" className="not-found-button not-found-button--ghost">
                Browse FAQ
              </Link>
            </div>

            <article className="not-found-status-card">
              <div className="not-found-status-card__pill">
                <Compass size={16} />
                <span>{activeMode.label}</span>
              </div>

              <h2 className="not-found-status-card__title">{activeMode.title}</h2>
              <p className="not-found-status-card__copy">{activeMode.copy}</p>
            </article>

            <div className="not-found-reassurance-grid">
              {reassuranceCards.map(({ title, text, icon: Icon }) => (
                <article key={title} className="not-found-reassurance-card">
                  <div className="not-found-reassurance-card__icon">
                    <Icon size={18} />
                  </div>
                  <h3 className="not-found-reassurance-card__title">{title}</h3>
                  <p className="not-found-reassurance-card__text">{text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="not-found-visual">
            <div className={`not-found-scene not-found-scene--${activeMode.key}`}>
              <div className="not-found-scene__glow not-found-scene__glow--one" aria-hidden="true" />
              <div className="not-found-scene__glow not-found-scene__glow--two" aria-hidden="true" />
              <div className="not-found-scene__orbit not-found-scene__orbit--one" aria-hidden="true" />
              <div className="not-found-scene__orbit not-found-scene__orbit--two" aria-hidden="true" />
              <div className="not-found-scene__watermark" aria-hidden="true">
                404
              </div>

              <div className="not-found-scene__photo-card">
                <span className="not-found-scene__photo-label">Dog-first recovery mode</span>
                <img
                  src="/Default/images/dogs4.avif"
                  alt="Happy dog waiting for the right page"
                  className="not-found-scene__photo-image"
                />
              </div>

              <article className="not-found-product-card not-found-product-card--one">
                <span className="not-found-product-card__badge">Everyday wellness</span>
                <img
                  src="/Default/images/col1.png"
                  alt="Everyday Daily Multivitamin"
                  className="not-found-product-card__image"
                />
              </article>

              <article className="not-found-product-card not-found-product-card--two">
                <span className="not-found-product-card__badge">Fresh breath support</span>
                <img
                  src="/Default/images/col2.png"
                  alt="Doggie Dental Powder"
                  className="not-found-product-card__image"
                />
              </article>

              <article className="not-found-scene__note-card">
                <div className="not-found-scene__note-icon">
                  <Bone size={18} />
                </div>
                <div>
                  <p className="not-found-scene__note-label">{activeMode.noteLabel}</p>
                  <p className="not-found-scene__note-copy">{activeMode.noteCopy}</p>
                </div>
              </article>

              <div className="not-found-scene__floor" aria-hidden="true" />

              <div className="not-found-bowl" aria-hidden="true">
                <span className="not-found-bowl__food" />
              </div>

              <div className="not-found-dog-actor" aria-hidden="true">
                <div className="not-found-dog">
                  <span className="not-found-dog__shadow" />
                  <span className="not-found-dog__body" />
                  <span className="not-found-dog__chest" />
                  <span className="not-found-dog__tail" />
                  <span className="not-found-dog__leg not-found-dog__leg--front" />
                  <span className="not-found-dog__leg not-found-dog__leg--rear" />
                  <span className="not-found-dog__leg not-found-dog__leg--back" />
                  <span className="not-found-dog__neck" />
                  <span className="not-found-dog__head">
                    <span className="not-found-dog__ear not-found-dog__ear--back" />
                    <span className="not-found-dog__ear not-found-dog__ear--front" />
                    <span className="not-found-dog__muzzle" />
                    <span className="not-found-dog__nose" />
                    <span className="not-found-dog__eye" />
                    <span className="not-found-dog__collar" />
                  </span>
                </div>
              </div>

              <div className="not-found-scene__bubble" aria-live="polite">
                {activeMode.bubble}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="not-found-guides">
        <div className="not-found-guides__inner">
          <div className="not-found-guides__header">
            <span className="not-found-chip not-found-chip--soft">Where To Sniff Next</span>
            <h2 className="not-found-guides__title">
              A few pages dog parents usually need right after this.
            </h2>
            <p className="not-found-guides__copy">
              We kept the next stops practical: the main shop, the routine quiz, and direct
              support if you were trying to fix an order, subscription, or product question.
            </p>
          </div>

          <div className="not-found-guide-grid">
            {recoveryCards.map(({ title, text, to, image, imageAlt, kicker, icon: Icon }) => (
              <article key={title} className="not-found-guide-card">
                <div className="not-found-guide-card__media">
                  <img src={image} alt={imageAlt} className="not-found-guide-card__image" />
                </div>

                <div className="not-found-guide-card__body">
                  <div className="not-found-guide-card__top">
                    <span className="not-found-guide-card__kicker">{kicker}</span>
                    <div className="not-found-guide-card__icon">
                      <Icon size={18} />
                    </div>
                  </div>

                  <h3 className="not-found-guide-card__title">{title}</h3>
                  <p className="not-found-guide-card__text">{text}</p>

                  <Link to={to} className="not-found-guide-card__link">
                    <span>Open page</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default NotFoundPage;
