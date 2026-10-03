import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { CreatorBadge, CreatorIcon } from "@/components/ui";

describe("LoadingSpinner", () => {
  it("should render with default text", () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.firstChild).toBeTruthy();
  });

  it("should render with custom text", () => {
    render(<LoadingSpinner text="Memuat..." />);
    expect(screen.getByText("Memuat...")).toBeTruthy();
  });
});

describe("Button", () => {
  it("should render children", () => {
    render(<Button>Klik Saya</Button>);
    expect(screen.getByText("Klik Saya")).toBeTruthy();
  });

  it("should render as link when href provided", () => {
    render(<Button href="/test">Link Button</Button>);
    const link = screen.getByText("Link Button");
    expect(link.closest("a")).toBeTruthy();
  });

  it("should handle click events", () => {
    let clicked = false;
    render(<Button onClick={() => { clicked = true; }}>Click</Button>);
    screen.getByText("Click").click();
    expect(clicked).toBe(true);
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByText("Disabled");
    expect(btn.closest("button")?.disabled).toBe(true);
  });
});

describe("Skeleton Components", () => {
  it("should render atomic Skeleton with shimmer element", async () => {
    const { Skeleton } = await import("@/components/ui/Skeleton");
    const { container } = render(<Skeleton width="200px" height="30px" />);
    expect(container.querySelector(".sk-item")).toBeTruthy();
    expect(container.querySelector(".sk-shimmer")).toBeTruthy();
  });

  it("should render SkeletonDashboard preset layout", async () => {
    const { SkeletonDashboard } = await import("@/components/ui/Skeleton");
    const { container } = render(<SkeletonDashboard />);
    expect(container.querySelectorAll(".sk-item").length).toBeGreaterThan(10);
  });

  it("should render SkeletonLeaderboard preset layout", async () => {
    const { SkeletonLeaderboard } = await import("@/components/ui/Skeleton");
    const { container } = render(<SkeletonLeaderboard />);
    expect(container.querySelectorAll(".sk-item").length).toBeGreaterThan(5);
  });

  it("should render SkeletonEditor preset layout", async () => {
    const { SkeletonEditor } = await import("@/components/ui/Skeleton");
    const { container } = render(<SkeletonEditor />);
    expect(container.querySelectorAll(".sk-item").length).toBeGreaterThan(5);
  });

  it("should render SkeletonProfile preset layout", async () => {
    const { SkeletonProfile } = await import("@/components/ui/Skeleton");
    const { container } = render(<SkeletonProfile />);
    expect(container.querySelectorAll(".sk-item").length).toBeGreaterThan(5);
  });
});

describe("LoadingScreen with GSAP Skeleton", () => {
  it("should render LoadingScreen fullPage with custom text badge", async () => {
    const { LoadingScreen } = await import("@/components/ui/LoadingScreen");
    const { container } = render(<LoadingScreen text="Memuat Halaman TRPL..." fullPage={true} />);
    expect(screen.getByText("Memuat Halaman TRPL...")).toBeTruthy();
    expect(container.querySelectorAll(".sk-item").length).toBeGreaterThan(5);
  });
});

describe("CreatorBadge & CreatorIcon", () => {
  it("should render CreatorIcon as SVG with accessibility title", () => {
    const { container } = render(<CreatorIcon size={20} title="Platform Creator" ariaHidden={false} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute("width")).toBe("20");
    expect(svg?.getAttribute("height")).toBe("20");
  });

  it("should render CreatorBadge with label and icon", () => {
    render(<CreatorBadge size="sm" variant="pill" label="Creator" />);
    expect(screen.getByText("Creator")).toBeTruthy();
  });

  it("should support hero variant for profile view", () => {
    render(<CreatorBadge size="md" variant="hero" label="Platform Creator & Lead Architect" />);
    expect(screen.getByText("Platform Creator & Lead Architect")).toBeTruthy();
  });
});

