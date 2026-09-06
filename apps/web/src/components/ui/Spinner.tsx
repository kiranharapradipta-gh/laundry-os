interface SpinnerProps {
  size?: "small" | "medium" | "large";
}

export default function Spinner({
  size = "medium",
}: SpinnerProps) {
  return (
    <span
      className={`spinner spinner-${size}`}
      aria-label="Loading"
    />
  );
}