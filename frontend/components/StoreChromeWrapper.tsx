"use client";

import { usePathname } from "next/navigation";
import { SiteHeader, SiteFooter, WhatsAppFloat } from "./SiteChrome";

export function StoreChromeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isExcluded =
    pathname === "/mango-experience" ||
    pathname?.startsWith("/admin-dashboard");

  if (isExcluded) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
      <WhatsAppFloat />
    </>
  );
}
