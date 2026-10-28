import "./bq.css"; // Soft Floral stylesheet (globals.css kept for the later React/Tailwind port)
import { Noto_Serif, Noto_Sans } from "next/font/google";
// Noto covers every Kazakh letter: ә і ң ғ ү ұ қ ө һ
const serif = Noto_Serif({ subsets: ["cyrillic", "cyrillic-ext", "latin"], variable: "--font-serif", weight: ["500", "600"] });
const sans = Noto_Sans({ subsets: ["cyrillic", "cyrillic-ext", "latin"], variable: "--font-sans" });
export const metadata = { title: "IRIS | Білімің гүлдей берсін.", description: "Оқу материалдарыңыздан сапалы тесттер құрастырыңыз." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="kk" className={`${serif.variable} ${sans.variable}`}><body>{children}</body></html>;
}
