<!--
  README.md - how this website is organised, how to preview it while editing,
  and how to publish it on GitHub Pages at software.sumtrol.uk.
-->

# software.sumtrol.uk

Static website for Ian Packer's apps. Plain HTML and CSS, no build step, no
third-party code or fonts.

## Layout

```
index.html                      Home: one card per app
about/index.html                About and contact
<app>/index.html                App page for non-technical users
<app>/technical/index.html      Technical page (only place linking to the repository)
404.html                        Shown for addresses that don't exist
assets/css/site.css             All styling, light and dark colours
assets/js/site.js               Light/Dark/System switch, "recommended download" hint
assets/img/                     App icons and screenshots
sitemap.xml, robots.txt         For search engines (add new pages to sitemap.xml)
CNAME                           Tells GitHub Pages the custom domain
.nojekyll                       Tells GitHub Pages to serve the files exactly as they are
```

Draft wording is marked with `<!-- DRAFT -->` comments. The header (including
the Apps menu list) and footer are repeated on every page; when adding an app,
add it to the Apps menu on each page as well as a card on the home page.

The About pop-up shows whatever is inside `data-about-content` on
`about/index.html`, so About text is only written once. The pop-up needs the
site to be served (see below); opening files directly falls back to the page.

## Preview while editing

From this folder:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> and refresh after each save. (Opening the
files directly also works, but links to folders such as `ballisto/` show a file
listing instead of the page.)

To check on a phone on the same network, use `http://<this-PC's-IP>:8000`.

## Updating download links

Download buttons link straight to files on GitHub Releases, for example:

```
https://github.com/ianp5uk/<repo>/releases/download/<tag>/<file>
```

Version-specific links are used because Blighter is a pre-release and
XTweetDelete has separate releases per platform; GitHub's `releases/latest`
link skips pre-releases. Update the links, version numbers and file sizes on
the app page and its technical page for each release.

## Going live

1. Make this repository public.
2. Settings → Pages → Source: *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. Route 53: add a CNAME record `software.sumtrol.uk` → `ianp5uk.github.io`.
4. Settings → Pages: wait for the DNS check to pass, then tick **Enforce HTTPS**.
