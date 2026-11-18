// @vitest-environment jsdom

import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "test-utils/render-with-providers";

// Stub Menu primitives to always render children (keeps tests deterministic).
vi.mock("@headlessui/react", () => {
  function Menu({ as: As = "div", children, ...props }) {
    return <As {...props}>{children}</As>;
  }
  function MenuButton(props) {
    return <button type="button" {...props} />;
  }
  function MenuItems({ anchor, transition, ...props }) {
    return <div data-testid="menu-items" {...props} />;
  }
  function MenuItem({ children }) {
    return <>{children}</>;
  }

  return { Menu, MenuButton, MenuItems, MenuItem };
});

vi.mock("components/resolvedicon", () => ({
  default: function ResolvedIconMock({ icon }) {
    return <div data-testid="resolved-icon">{icon}</div>;
  },
}));

import LinksMenu from "./links-menu";

const service = {
  name: "Fortinet",
  description: "Security",
  icon: "fortinet.png",
  links: [
    { name: "FortiGate", href: "https://fgt.example", icon: "fortigate.png", description: "Firewall" },
    { name: "FortiManager", href: "https://fmg.example", target: "_self" },
  ],
};

describe("components/services/links-menu", () => {
  it("renders the service as a menu button with its name, description and icon", () => {
    renderWithProviders(<LinksMenu service={service} />, { settings: {} });

    const button = screen.getAllByRole("button")[0];
    expect(button).toHaveTextContent("Fortinet");
    expect(button).toHaveTextContent("Security");
    expect(screen.getByText("fortinet.png")).toBeInTheDocument();
  });

  it("renders every link with its href and resolves the target from link, service, then settings", () => {
    renderWithProviders(<LinksMenu service={{ ...service, target: "_top" }} />, { settings: { target: "_parent" } });

    const fgt = screen.getByRole("link", { name: /FortiGate/ });
    expect(fgt).toHaveAttribute("href", "https://fgt.example");
    expect(fgt).toHaveAttribute("target", "_top");
    expect(fgt).toHaveTextContent("Firewall");
    expect(screen.getByText("fortigate.png")).toBeInTheDocument();

    const fmg = screen.getByRole("link", { name: /FortiManager/ });
    expect(fmg).toHaveAttribute("href", "https://fmg.example");
    expect(fmg).toHaveAttribute("target", "_self");
  });

  it("falls back to settings.target and then _blank", () => {
    const { unmount } = renderWithProviders(<LinksMenu service={service} />, { settings: { target: "_parent" } });
    expect(screen.getByRole("link", { name: /FortiGate/ })).toHaveAttribute("target", "_parent");
    unmount();

    renderWithProviders(<LinksMenu service={service} />, { settings: {} });
    expect(screen.getByRole("link", { name: /FortiGate/ })).toHaveAttribute("target", "_blank");
  });
});
