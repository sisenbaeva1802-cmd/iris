# IRIS — Білімің гүлдей берсін.

AI quiz website built with Next.js 15, Prisma/PostgreSQL and Anthropic. Kazakh UI, Google Sign-In (basic profile only), PDF/DOCX/PPTX/TXT extraction, source-grounded quiz generation, editor, attempts, results history, and mistakes practice. Google Forms integration intentionally removed. Original hero artwork is at `public/images/iris-hero.jpeg`.

## Deploy on Vercel
1. Create a Supabase PostgreSQL project and obtain its database connection URL.
2. Create a Google Cloud OAuth web client; set Authorized JavaScript origin to `https://YOUR-PROJECT.vercel.app` and Authorized redirect URI to `https://YOUR-PROJECT.vercel.app/api/auth/callback/google`. Only basic Google Sign-In is needed.
3. Get an Anthropic API key. Never paste keys into chat or commit `.env.local`.
4. Import this repository into Vercel; configure all values from `.env.example` in Vercel Project Settings → Environment Variables. Set `NEXTAUTH_URL` to your actual Vercel URL.
5. Apply schema to Supabase from a secure terminal using `npx prisma db push` with `DATABASE_URL` configured. This project has no migration files yet.
6. Deploy. The `build` and `postinstall` scripts generate Prisma Client.
7. Check `/api/health`, then test Google login, extraction, AI generation, save, quiz attempt, and history on the live site.

**Important:** A public live URL cannot be supplied until Vercel deployment and account authorizations have actually occurred. AI generation needs a valid paid Anthropic API key and can be constrained by Vercel function duration/plan limits.

## Production caveats
- Full production build is unverified: dependency installation timed out in this environment.
- The in-memory limiter is not a distributed quota or cost-control mechanism.
- Long AI generations may exceed Vercel plan function duration limits; test on your actual plan.
- Apply schema (`npx prisma db push`) before first sign-in. Configure secrets only in Vercel.
