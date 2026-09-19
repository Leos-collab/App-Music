---
name: Sonic Precision
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363940'
  surface-container-lowest: '#0b0e14'
  surface-container-low: '#191c22'
  surface-container: '#1d2026'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e1e2eb'
  on-surface-variant: '#bbc9cf'
  inverse-surface: '#e1e2eb'
  inverse-on-surface: '#2e3037'
  outline: '#859399'
  outline-variant: '#3c494e'
  surface-tint: '#47d6ff'
  primary: '#a5e7ff'
  on-primary: '#003543'
  primary-container: '#00d2ff'
  on-primary-container: '#00566a'
  inverse-primary: '#00677f'
  secondary: '#ceffdf'
  on-secondary: '#003921'
  secondary-container: '#01f5a0'
  on-secondary-container: '#006b43'
  tertiary: '#ffd2d5'
  on-tertiary: '#670020'
  tertiary-container: '#ffaab3'
  on-tertiary-container: '#a00036'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#b6ebff'
  primary-fixed-dim: '#47d6ff'
  on-primary-fixed: '#001f28'
  on-primary-fixed-variant: '#004e60'
  secondary-fixed: '#50ffaf'
  secondary-fixed-dim: '#00e293'
  on-secondary-fixed: '#002111'
  on-secondary-fixed-variant: '#005232'
  tertiary-fixed: '#ffd9dc'
  tertiary-fixed-dim: '#ffb2ba'
  on-tertiary-fixed: '#400011'
  on-tertiary-fixed-variant: '#910030'
  background: '#10131a'
  on-background: '#e1e2eb'
  surface-variant: '#32353c'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-mono-lg:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.04em
  label-mono-md:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.05em
  label-mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 9px
    fontWeight: '500'
    lineHeight: 12px
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 0.75rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style
The design system targets audiophiles, sound engineers, music producers, and discerning listeners who manage extensive lossless audio libraries (FLAC, ALAC, DSD, WAV) directly on their mobile devices. The visual identity bridges professional mastering rack hardware with fluid, ultra-modern mobile ergonomics.

The visual style blends **Skeuomorphic Precision** with **Atmospheric Dark Minimalism**:
- Deep void backdrops reminiscent of high-end acoustic studios.
- Laser-sharp illuminated traces, active LED-grade status rings, and calibrated mechanical faders.
- Tactile feedback conveyed visually through recessed slots, luminescent indicator thumbs, and micro-grooved knurling.
- Purposeful instrumentation typography highlighting technical acoustic parameters (frequency bands, sample rates, decibel levels, and headroom clipping).

## Colors
The palette evokes an analog mastering console energized by digital electroluminescence:

- **Primary (`#00D2FF`)**: Electric Cyan. Used for active signal paths, frequency filter nodes, playback transport progression, and highlighted audio bands.
- **Secondary (`#00F5A0`)**: Neon Mint / Studio Lime. Employed for safe gain levels (0dB and below), stereo balance, active toggles, and lossless format badging (e.g., Hi-Res Audio, 24-bit/192kHz).
- **Tertiary (`#FF3B69`)**: Peak Crimson. Reserved strictly for audio clipping warnings (>0dB overload), limiter saturation, bypass alerts, and destructive file actions.
- **Neutral Palette**:
  - `Canvas / Background`: `#0B0E14` (Deep obsidian void)
  - `Surface Low / Well`: `#121824` (Recessed slider channels and track wells)
  - `Surface Card / Panel`: `#1A2232` (Console chassis surfaces)
  - `Surface High / Control`: `#242E42` (Elevated interactive buttons and knurled knobs)
  - `Border / Hairline`: `#2B3850` (Precision tick marks and divider rules)
  - `Text High-Contrast`: `#F1F5F9`
  - `Text Muted / Subdued`: `#64748B`

## Typography
The typographic architecture pairs geometric clarity with technical precision:

- **Display & Headings (Plus Jakarta Sans)**: Delivers smooth, confident song titles, artist names, and modal headlines.
- **Body & Metadata (Inter)**: Handles secondary metadata, album tracklists, settings descriptors, and file information with neutral legibility.
- **Technical Readouts (JetBrains Mono)**: Encodes numerical metrics, including frequency bands (`32Hz`, `1kHz`, `16kHz`), gain parameters (`+3.5 dB`), timecodes (`03:42 / 05:18`), and file bitrates (`DSD512`, `FLAC 9216 kbps`). This monospaced alignment prevents layout jitter during real-time decibel metering.

## Layout & Spacing
The layout implements an ergonomic, finger-optimized mobile touch schema:

- **Mobile Viewport (Standard)**: 4-column fluid layout with `16px` (`1rem`) outer margins and `12px` (`0.75rem`) gutters.
- **Equalizer Fader Bank**: A horizontal scrolling or 10-band responsive rack. Each vertical slider column allocates a minimum touch target width of `36px` to prevent accidental adjacent band adjustments, with `4px` minimum fader tracks centered within.
- **Landscape / Tablet**: Switches to a split-screen 8-column layout: real-time spectrum visualizer and playback transport on the left, 10-band parametric fader strip and DSP effects chain (Limiter, Pitch, Spatial Audio) on the right.

## Elevation & Depth
Visual depth mirrors precision anodized aluminum panels inset with backlit controls:

- **Recessed / Wells (Sliders & Tracks)**: Inset drop shadow (`inset 0 2px 4px rgba(0, 0, 0, 0.8)`), bordered by a 1px stroke at `#2B3850` against `#121824`.
- **Card / Deck Level**: Surface `#1A2232` with a subtle 1px top highlight border (`rgba(255, 255, 255, 0.05)`) and bottom shadow (`0 4px 16px rgba(0, 0, 0, 0.4)`).
- **Interactive Knobs & Sliders**: Elevated metallic pill handles (`#FFFFFF` with metallic gradient overlays) throwing an ambient glow of primary Cyan (`0 0 12px rgba(0, 210, 255, 0.45)`).
- **Overdrive & Peak Alerts**: High-intensity luminescence (`0 0 14px rgba(255, 59, 105, 0.6)`).

## Shapes
A balanced aesthetic combining engineering precision with modern handheld ergonomics:
- **Base Components (Cards, Panels, Sheets)**: `0.5rem` (`8px`) corner radius to echo physical modular studio rack gear.
- **Fader Handles & Pill Chips**: Cylindrical thumb pads using full pills (`9999px`) or `0.25rem` (`4px`) champfered corners for tactile grip indication.
- **Album Art & Visualizer Portals**: Structured `0.75rem` (`12px`) radius with clean edge-to-edge glass framing.

## Components

### 1. Vertical Graphic Equalizer Faders
- **Track**: A vertical recessed groove (`width: 6px`, background `#121824`) with etched horizontal dB ticks on both sides (`+12dB`, `+6dB`, `0dB`, `-6dB`, `-12dB`) drawn in `#2B3850`. The center `0dB` mark features an extended tick in `#64748B`.
- **Active Fill**: Bottom-up fill to the thumb in `#00D2FF` (or dual-gradient transition to `#00F5A0` for values below `0dB`, transitioning to `#FF3B69` above `+6dB`).
- **Thumb Handle**: Tactile capsule (`width: 28px`, `height: 16px`), coated with a dual-tone white/silver brush effect, centered neon indicator line, and cyan glow upon touch engagement.
- **Frequency Label**: Fixed at the base in `label-mono-md`, e.g., `32`, `64`, `125`, `250`, `500`, `1k`, `2k`, `4k`, `8k`, `16k`.

### 2. Audio Spectrum & Waveform Visualizer
- Multi-bar FFT canvas rendering 32 to 64 reactive bars with gradient fills shifting from `#0084FF` at the root, `#00D2FF` mid-range, to `#00F5A0` at crests. Peak hold decay markers float in pure white for 300ms before falling.

### 3. Preset & DSP Chips
- Compact horizontal selector pills for modes: `Flat`, `Bass Boost`, `Vocal`, `Electronic`, `Acoustic`, `Custom`.
- Inactive state: `#1A2232` background with `#64748B` border and text.
- Active state: `#121824` with a vibrant outer stroke in `#00D2FF`, accompanied by a small illuminated LED dot.

### 4. Mini-Player Dock
- Persistent floating bottom sheet (`margin: 12px`, floating above safe area).
- Surface: Glassmorphic dark slate (`#1A2232` at 92% opacity with `backdrop-filter: blur(16px)`).
- Elements: Track thumbnail (`40x40px`, rounded-md), marquee title, format badge (`Hi-Res / FLAC`), continuous micro-scrubber line across the top edge in `#00F5A0`, and unified Play/Pause/Skip tactile buttons.

### 5. Push Buttons & Segmented Toggles
- **Reset / Bypass Buttons**: Low-profile tactile keys with distinct mechanical state changes (`#242E42` depressed to `#121824` when engaged).
- **Limiter / Pitch / Reverb Radios**: Radio buttons designed as circular LED toggles that ignite with `#00F5A0` luminescence when active.