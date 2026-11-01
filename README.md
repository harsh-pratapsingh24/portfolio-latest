# Harsh Pratap Singh — Portfolio

A Next.js portfolio with a dependency-light generative canvas hero. The portrait is recreated in code from layered point clouds, scanlines, noise, wireframe lines and tracking annotations; it does not use the supplied inspiration image in the site.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Customise content

Most editable portfolio content is centralised in `src/data/portfolio.ts`:

- `personal`: contact links, resume URL, GitHub URL and LeetCode profile.
- `experience`: roles, dates and tools.
- `projects`: descriptions, stacks and available live/repository URLs.
- `skills`: technical groups.

The following have deliberate TODOs instead of invented details:

- GitHub profile and activity integration.
- Resume file/link.
- VentureX dates.
- Any project repository or demo not confirmed in the supplied information.
- Contact-form delivery service.
- Profile photograph (the About section currently uses a styled placeholder).

The supplied resume is already available at `public/resume/harsh-pratap-singh-resume.pdf`, and both the navigation and hero buttons download it. The supplied ASCII portrait is in `public/images/profile/harsh-ascii-profile.png` and is used in the About panel.

The LeetCode activity module links to the configured profile but deliberately does not show fabricated submission or streak statistics. Replace it with API-backed data only when a verified data source is configured.

## Build

```bash
npm run build
```
