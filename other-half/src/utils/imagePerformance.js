import imageMetadata from "../generated/image-metadata.json";

const metadataByOptimizedSrc = Object.fromEntries(
  Object.values(imageMetadata).map((metadata) => [metadata.src, metadata])
);

export const getImageMetadata = (src) => {
  return imageMetadata[src] || metadataByOptimizedSrc[src] || null;
};

export const getImagePerformanceProps = (src, options = {}) => {
  const metadata = getImageMetadata(src);

  return {
    src: metadata?.src || src,
    width: metadata?.width,
    height: metadata?.height,
    loading: options.loading || "lazy",
    decoding: "async",
    fetchPriority: options.fetchPriority,
  };
};
