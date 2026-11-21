# `ffmpeg-commander`

A simple web UI for generating common FFmpeg encoding operations.

## Overview & Deployment

**Live Deployment:** [ffmpeg.dakta.website](https://ffmpeg.dakta.website)

This repository is a modernized, ad-free personal fork of `ffmpeg-commander`, tailored for fast, practical encoding workflows. While `FFmpeg` provides powerful options, it can be intimidating to use. This tool offers a streamlined interface inspired by HandBrake, making it easy to generate commands for both simple and complex media tasks.

<img width="735" height="426" alt="FFmpeg Commander Simple Mode Screenshot (dark)" src="https://github.com/user-attachments/assets/30afebfd-1d00-4cf4-946d-16690eea14fe" />

<img width="1064" height="943" alt="FFmpeg Commander Screenshot (dark)" src="https://github.com/user-attachments/assets/f557a03b-1a3e-4833-836f-af4b009d5a1d" />

<img width="1064" height="943" alt="FFmpeg Commander Screenshot (light)" src="https://github.com/user-attachments/assets/78b70459-60d6-4172-84bb-72cfd4a4f6df" />

## Core Enhancements

This fork introduces several improvements and customizations compared to the upstream project:

- **Stream Copy Priority**: Added instant container remuxing (`-c copy`) without re-encoding overhead.
- **Modern Codec Stack**: Upgraded AV1 support from legacy `libaom-av1` to `libsvtav1` and added hardware-accelerated `av1_nvenc`.
- **Refined Presets & Options**: Updated presets with optimized CRF/preset values for SVT-AV1, expanded container compatibility (MP4/MKV/WebM), and clarified UI labels.
- **Simplified / Quick Mode**: Refactored user-friendly workflows alongside the advanced parametric mode.
- **Clean Interface**: Completely removed third-party commercial banners, promotional links, and dead code.

## Development & Build

`ffmpeg-commander` is built with [React](https://react.dev), [Vite](https://vite.dev), and [Tailwind CSS](https://tailwindcss.com).

Requires Node 20 or newer. [NVM](https://github.com/nvm-sh/nvm) is recommended for managing versions.

### Install & Run

```bash
npm install
npm run dev