import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";

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
