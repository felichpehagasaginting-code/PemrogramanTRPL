export function generateStaticParams() {
  return ["M0", "M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8"].map((moduleId) => ({ moduleId }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
