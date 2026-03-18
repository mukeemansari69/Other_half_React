import { useEffect, useRef, useState } from "react";
import "/public/Home/css/trustedSection.css";

export default function TrustedSection() {

  const desktopVideosRef = useRef([]);
  const mobileVideosRef = useRef([]);

  const [playing, setPlaying] = useState({});
  const [muted, setMuted] = useState({});

  const videos = [
    "/Home/images/dog1.mp4",
    "/Home/images/dog1.mp4",
    "/Home/images/dog1.mp4",
    "/Home/images/dog1.mp4",
    "/Home/images/dog1.mp4",
    "/Home/images/dog1.mp4",
    "/Home/images/dog1.mp4",
    "/Home/images/dog1.mp4",
    "/Home/images/dog1.mp4",
    "/Home/images/dog1.mp4",
  ];

  useEffect(() => {
    let index = 0;

    const playNext = () => {
      const vids = desktopVideosRef.current;

      vids.forEach(v => v && v.pause());

      const current = vids[index];
      if (!current) return;

      current.currentTime = 0;
      current.play();

      setPlaying({ [index]: true });

      current.onended = () => {
        index = (index + 1) % vids.length;
        playNext();
      };
    };

    playNext();
  }, []);

  const togglePause = (i, type) => {
    const video =
      type === "desktop"
        ? desktopVideosRef.current[i]
        : mobileVideosRef.current[i];

    if (!video) return;

    if (video.paused) {
      video.play();
      setPlaying(prev => ({ ...prev, [i]: true }));
    } else {
      video.pause();
      setPlaying(prev => ({ ...prev, [i]: false }));
    }
  };

  const toggleMute = (i, type) => {
    const video =
      type === "desktop"
        ? desktopVideosRef.current[i]
        : mobileVideosRef.current[i];

    if (!video) return;

    video.muted = !video.muted;

    setMuted(prev => ({
      ...prev,
      [i]: video.muted
    }));
  };

  return (
    <section className="w-full flex justify-center">

      {/* ✅ 1920 CONTAINER */}
      <div className="w-full max-w-[1920px] trusted-container">

        <h2 className="trusted-heading">
          TRUSTED BY VETS. LOVED BY PETS.
        </h2>

        {/* DESKTOP */}
        <div className="desktop-videos hidden md:flex">
          {videos.map((src, i) => (
            <div className="video-card" key={i}>

              <video
                ref={el => desktopVideosRef.current[i] = el}
                src={src}
                muted
                playsInline
                className="video-element"
              />

              <div className="video-controls">

                <button onClick={() => togglePause(i,"desktop")}>
                  {playing[i] ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#0F4A12">
                      <rect x="6" y="4" width="4" height="16"/>
                      <rect x="14" y="4" width="4" height="16"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#0F4A12">
                      <polygon points="5,3 19,12 5,21"/>
                    </svg>
                  )}
                </button>

                <button onClick={() => toggleMute(i,"desktop")}>
                  {muted[i] ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#0F4A12">
                      <path d="M3 9V15H7L12 20V4L7 9H3Z"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#0F4A12">
                      <path d="M16 7L9 12L16 17V7Z"/>
                    </svg>
                  )}
                </button>

              </div>
            </div>
          ))}
        </div>

        {/* MOBILE */}
        <div className="mobile-videos flex md:hidden">
          {videos.map((src, i) => (
            <div className="mobile-card" key={i}>

              <video
                ref={el => mobileVideosRef.current[i] = el}
                src={src}
                muted
                playsInline
                className="mobile-video"
              />

              <div className="mobile-controls">

                <button onClick={() => togglePause(i,"mobile")}>
                  {playing[i] ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#0F4A12">
                      <rect x="6" y="4" width="4" height="16"/>
                      <rect x="14" y="4" width="4" height="16"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#0F4A12">
                      <polygon points="5,3 19,12 5,21"/>
                    </svg>
                  )}
                </button>

                <button onClick={() => toggleMute(i,"mobile")}>
                  {muted[i] ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#0F4A12">
                      <path d="M3 9V15H7L12 20V4L7 9H3Z"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#0F4A12">
                      <path d="M16 7L9 12L16 17V7Z"/>
                    </svg>
                  )}
                </button>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}