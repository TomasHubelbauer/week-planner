export default function calculateColor(string) {
  const hash = [...string].reduce((hash, char) => hash + char.charCodeAt(0), 0);
  return `hsl(${hash % 360}, 100%, 87.5%)`;
}
