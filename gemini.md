# Project: THE_y-it_PRO

## Purpose
This project is configured to build and deploy a multi-page GitHub Pages website for the "y-it" brand.

## Key Directory Structure
The website source is located in the `C:\iiwii_db\THE_y-it_PRO\docs` directory. This directory contains the following pages, each in its own subdirectory:

- `docs/`: The main `index.html` (the primary landing page).
- `docs/chapter2-landing-v1/`: A version of the Chapter 2 landing page.
- `docs/chapter2-landing-v2/`: Another version of the Chapter 2 landing page.
- `docs/nano-book-generator/`: The "Nano-Book Generator" web application.

## Deployment
This repository uses a GitHub Actions workflow located at `.github/workflows/deploy.yml`. This workflow automatically deploys the contents of the `docs` directory to the `gh-pages` branch, which is then published as a live website.

Any changes pushed to the `main` branch will trigger this automated deployment, ensuring the live site is always up-to-date.

## Source Files
The original source files for the pages in the `docs` directory are located in other directories within the `C:\iiwii_db\` path, such as `C:\iiwii_db\y-it\Y-it_v1\`. The files in the `docs` directory are copies, organized for deployment.
