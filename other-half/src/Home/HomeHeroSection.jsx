import "/public/Home/css/HomeHeroSection.css";
import { LoadingLink } from "../Components/LoadingControl.jsx";
import HomeSearchSpotlight from "./HomeSearchSpotlight.jsx";

export default function HomeHeroSection() {
  return (
    <section className="home-hero-section">
      <div className="home-hero-container">
        <div className="hero-content flex flex-col">
          
          <h1 className="hero-title">
            Smarter Pet Care Starts with AI.
            Because Your Dog Deserves More Than Guesswork.
          </h1>

          <p className="hero-text">
            Tell us your dog’s problem — our AI understands, analyzes, and builds a personalized daily routine with the perfect health products to keep your pup happy, active, and thriving
            <br />
            From diet to dental care, from energy to immunity — everything tailored to your dog’s breed, age, and real needs.
          </p>

          <div className="flex gap-[12px] justify-center lg:justify-start flex-wrap">
            
            <LoadingLink
              to="/ai-pet-health#describe-your-dog"
              state={{ focusDescription: true }}
              className="btn-primary"
              loadingText="Opening..."
            >
              Talk to AI About Your Dog
            </LoadingLink>

            <LoadingLink to="/collection" className="btn-secondary" loadingText="Opening...">
              Shop Now
            </LoadingLink>

          </div>

          <HomeSearchSpotlight />
        </div>
      </div>
    </section>
  );
}
