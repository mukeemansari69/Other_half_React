import { forwardRef, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const joinClasses = (...classes) => classes.filter(Boolean).join(" ");

const isPromiseLike = (value) =>
  Boolean(value) && typeof value.then === "function";

const isModifiedClick = (event) =>
  event.button !== 0 ||
  event.metaKey ||
  event.altKey ||
  event.ctrlKey ||
  event.shiftKey;

const LoadingSpinner = ({ className = "" }) => (
  <span
    aria-hidden="true"
    className={joinClasses(
      "inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent",
      className
    )}
  />
);

const LoadingLabel = ({
  children,
  loading,
  loadingText,
  spinnerPosition = "start",
  spinnerClassName = "",
}) => {
  if (!loading) {
    return children;
  }

  const hasLoadingText = typeof loadingText === "string" && loadingText.length > 0;
  const spinner = <LoadingSpinner className={spinnerClassName} />;

  return (
    <>
      {spinnerPosition === "start" ? spinner : null}
      {hasLoadingText ? <span>{loadingText}</span> : null}
      {spinnerPosition === "end" ? spinner : null}
    </>
  );
};

const useSafeLockState = () => {
  const mountedRef = useRef(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    mountedRef,
    timeoutRef,
  };
};

export const LoadingButton = forwardRef(function LoadingButton(
  {
    children,
    className = "",
    disabled = false,
    loading = false,
    loadingText = "",
    lockMs = 1200,
    lockOnClick = false,
    onClick,
    spinnerClassName = "",
    spinnerPosition = "start",
    type = "button",
    ...rest
  },
  ref
) {
  const [localLoading, setLocalLoading] = useState(false);
  const lockedRef = useRef(false);
  const { mountedRef, timeoutRef } = useSafeLockState();
  const isLoading = loading || localLoading;

  const releaseLock = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    lockedRef.current = false;

    if (mountedRef.current) {
      setLocalLoading(false);
    }
  };

  const handleClick = async (event) => {
    if (disabled || isLoading || lockedRef.current) {
      event.preventDefault();
      return;
    }

    if (!lockOnClick || typeof onClick !== "function") {
      onClick?.(event);
      return;
    }

    lockedRef.current = true;
    setLocalLoading(true);

    try {
      const result = onClick(event);

      if (isPromiseLike(result)) {
        await result;
      } else if (!event.defaultPrevented) {
        timeoutRef.current = window.setTimeout(releaseLock, lockMs);
        return;
      }
    } finally {
      if (!timeoutRef.current) {
        releaseLock();
      }
    }
  };

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      onClick={handleClick}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={joinClasses(
        className,
        isLoading && "cursor-not-allowed opacity-70"
      )}
    >
      <LoadingLabel
        loading={isLoading}
        loadingText={loadingText}
        spinnerPosition={spinnerPosition}
        spinnerClassName={spinnerClassName}
      >
        {children}
      </LoadingLabel>
    </button>
  );
});

export const LoadingLink = forwardRef(function LoadingLink(
  {
    children,
    className = "",
    disabled = false,
    loadingText = "",
    lockMs = 1200,
    onClick,
    spinnerClassName = "",
    spinnerPosition = "start",
    target,
    ...rest
  },
  ref
) {
  const [loading, setLoading] = useState(false);
  const lockedRef = useRef(false);
  const { mountedRef, timeoutRef } = useSafeLockState();

  const releaseLock = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    lockedRef.current = false;

    if (mountedRef.current) {
      setLoading(false);
    }
  };

  const handleClick = (event) => {
    if (disabled || loading || lockedRef.current) {
      event.preventDefault();
      return;
    }

    onClick?.(event);

    if (event.defaultPrevented || isModifiedClick(event) || target === "_blank") {
      return;
    }

    lockedRef.current = true;
    setLoading(true);
    timeoutRef.current = window.setTimeout(releaseLock, lockMs);
  };

  return (
    <Link
      {...rest}
      ref={ref}
      target={target}
      onClick={handleClick}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      className={joinClasses(
        className,
        (disabled || loading) && "pointer-events-none opacity-70"
      )}
    >
      <LoadingLabel
        loading={loading}
        loadingText={loadingText}
        spinnerPosition={spinnerPosition}
        spinnerClassName={spinnerClassName}
      >
        {children}
      </LoadingLabel>
    </Link>
  );
});
