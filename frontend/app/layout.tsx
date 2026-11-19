import "./globals.css";
import { StoreProvider } from "@/components/StoreProvider";
import { StoreChromeWrapper } from "@/components/StoreChromeWrapper";

export const metadata = {
  title: "Shiv Samarth Hapus | Authentic Devgad Hapus",
  description: "Discover mangoes, farm stories and Konkan heritage with Shiv Samarth Hapus."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <StoreChromeWrapper>{children}</StoreChromeWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}
