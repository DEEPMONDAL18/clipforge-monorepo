# ClipForge Frontend Design Bible
**Version:** 1.0

**Status:** Draft

**Owner:** CTO

**Audience:** Lovable, Frontend Engineers, Product Designers

---

# 1. Introduction

## Purpose

This document is the single source of truth for the ClipForge frontend.

Every frontend implementation must follow the principles, layouts, interaction patterns and design language defined in this document.

This is **not** a UI inspiration document.

This is **not** a mood board.

This is the engineering specification that defines how ClipForge should look, feel and behave.

Whenever there is a conflict between generated UI and this document, this document always takes precedence.

---

# 2. Product Vision

ClipForge is a premium browser-based application for processing large videos.

It is **not** another online converter.

It is **not** a collection of random video tools.

Instead, ClipForge should feel like professional desktop software that happens to run inside a browser.

Examples of products that represent the desired quality include:

- Linear
- Vercel
- Notion
- Figma
- Raycast

The objective is to build confidence immediately.

Users should feel that the application is:

- Fast
- Reliable
- Professional
- Secure
- Premium

The interface should never look cluttered or overwhelming.

The application should always communicate exactly what is happening.

---

# 3. Product Philosophy

Every design decision should follow these principles.

## Principle 1 — One Workspace

The application should behave like software, not like a marketing website.

Users should never navigate through:

Upload Page

↓

Processing Page

↓

Downloads Page

Instead everything happens inside one intelligent workspace.

The workspace continuously changes state as the job progresses.

---

## Principle 2 — Clarity Before Beauty

Beautiful interfaces are useless if users become confused.

Every screen must answer three questions.

What is happening?

What has already happened?

What happens next?

---

## Principle 3 — Show Progress

Long-running operations should never appear frozen.

Every processing stage should be visible.

Examples:

✓ Upload Complete

✓ Metadata Extracted

● Segment Planning

○ Processing

○ ZIP Generation

○ Ready

The user should always understand the pipeline.

---

## Principle 4 — Progressive Disclosure

Do not overwhelm users.

Only show information that is useful at the current step.

Example:

Before upload

Only show upload controls.

After upload

Show metadata.

After metadata

Show clip settings.

After processing

Show downloads.

---

## Principle 5 — Minimal Friction

The user should reach processing in as few decisions as possible.

Do not require:

Accounts

Login

Email

Verification

Dashboard

Projects

Folders

None of these belong in the MVP.

---

# 4. Brand Identity

## Brand Name

ClipForge

---

## Tagline

Process large videos without compromising quality.

---

## Brand Personality

ClipForge should feel:

Professional

Modern

Technical

Minimal

Reliable

Transparent

Calm

It should never feel:

Flashy

Cartoonish

Playful

Cheap

Over-designed

---

# 5. Design Language

The interface should resemble productivity software.

Preferred inspirations:

Linear

Vercel

Raycast

Notion

Avoid copying online converter websites.

Avoid excessive gradients.

Avoid glassmorphism.

Avoid oversized illustrations.

The UI should prioritize readability over decoration.

---

# 6. Color System

## Background

Primary

#09090B

Secondary

#111113

---

## Surface

Cards

#18181B

Dialogs

#202024

Inputs

#27272A

---

## Accent

Blue

#3B82F6

Hover

#2563EB

---

## Success

Green

#22C55E

---

## Warning

Amber

#F59E0B

---

## Error

Red

#EF4444

---

## Text

Primary

White

Secondary

Zinc 400

Muted

Zinc 500

Disabled

Zinc 600

---

# 7. Typography

Primary Font

Geist

Fallback

Inter

Font Scale

Hero

48px

H1

36px

H2

30px

H3

24px

Body

16px

Small

14px

Caption

12px

All headings should use medium or semibold weight.

Paragraphs should prioritize readability over density.

---

# 8. Spacing System

Use an 8-point spacing grid.

Allowed spacing values

8

16

24

32

40

48

64

96

Avoid arbitrary spacing values.

Consistency is more important than creativity.

---

# 9. Border Radius

Cards

16px

Buttons

12px

Inputs

12px

Dialogs

20px

Badges

999px

---

# 10. Shadows

Shadows should be subtle.

Cards should appear elevated without looking floating.

Avoid dramatic shadows.

Focus should remain on content rather than decoration.

---

# 11. Icons

Use Lucide Icons.

Icons should communicate meaning.

Avoid decorative icons.

Icons should never replace text.

---

# 12. Navigation

The navigation bar should remain minimal.

Contents:

• Logo

• GitHub

• Theme Toggle

Nothing else for the MVP.

Do not include:

Pricing

About

Blog

Contact

Dashboard

Settings

The focus should remain on the application.

---

# 13. Application Layout

The layout consists of three sections.

Navbar

↓

Workspace

↓

Footer

The Workspace occupies nearly all available vertical space.

The interface should feel like an application rather than a website.

---

# 14. Footer

The footer should remain minimal.

Include:

Privacy

Terms

GitHub

Version

Copyright

Avoid unnecessary marketing links.

---

# 15. Accessibility

Every interactive element must support keyboard navigation.

Visible focus states are mandatory.

Contrast ratios should meet WCAG AA guidelines.

Animations should respect reduced-motion preferences.

---

# End of Part 1

# 16. Workspace Experience

## Philosophy

The Workspace is the heart of ClipForge.

Every meaningful user interaction occurs inside this single view.

The user should never feel like they are navigating between different pages.

Instead, the Workspace continuously adapts as the processing job progresses.

Think of the Workspace as a living application rather than a collection of pages.

---

# 17. Landing Experience

## First Impression

Within five seconds, a first-time visitor should understand:

• What ClipForge does

• What action they should take

• That the application is trustworthy

The primary action must always be immediately visible.

Users should never have to search for where to begin.

---

## Landing Layout

------------------------------------------------

Navigation

------------------------------------------------

Hero Section

------------------------------------------------

Upload Card

------------------------------------------------

Features

------------------------------------------------

Frequently Asked Questions

------------------------------------------------

Footer

------------------------------------------------

The Upload Card is the primary call-to-action.

Avoid secondary CTAs competing for attention.

---

# 18. Hero Section

## Headline

Process Large Videos Without Compromising Quality

## Supporting Text

Upload long videos, split them into perfectly sized clips while preserving original quality and audio, then download everything as individual files or a ZIP archive.

## Primary Action

Drag & Drop Video

## Secondary Action

Browse Files

Do not include "Get Started."

Uploading is getting started.

---

# 19. Upload State

When no file has been selected, the Workspace should display a large upload card.

The upload card should communicate:

• Supported formats

• Maximum upload size

• Drag & Drop support

• Browse Files

A subtle illustration or icon is acceptable, but the upload interaction should remain the visual focus.

---

# 20. Uploading State

Once a file is selected, the upload card transforms into an upload monitor.

Display:

Filename

File Size

Upload Speed

Progress Percentage

Uploaded Bytes

Estimated Time Remaining

Pause (future)

Cancel

Never navigate away.

The workspace evolves.

---

# 21. Metadata Extraction

After upload completes:

Replace upload controls with video information.

Display:

Filename

Duration

Resolution

Codec

Frame Rate

Estimated Number of Clips

Estimated Processing Time

Only after metadata has been extracted should the user configure processing options.

---

# 22. Clip Configuration

Display a simple processing configuration card.

Options:

Clip Length

• 2 Minutes

• 3 Minutes

• 5 Minutes

• Custom

Estimated Clips

Estimated Processing Time

Process Button

Avoid exposing FFmpeg terminology.

Users should never see technical implementation details.

---

# 23. Queue State

When processing begins:

Display

Current Status

Queued

Estimated Wait

Queue Position (optional)

Activity Timeline

The user should understand that the upload succeeded and processing will begin shortly.

---

# 24. Processing State

The Processing View becomes the primary focus.

Layout

------------------------------------------------

Progress Card

------------------------------------------------

Pipeline Timeline

------------------------------------------------

Activity Feed

------------------------------------------------

Job Details

------------------------------------------------

Downloads (Disabled)

------------------------------------------------

The layout should remain stable throughout processing.

Avoid moving components around.

---

# 25. Progress Card

Always display:

Overall Progress

Current Stage

Elapsed Time

Estimated Remaining Time

Current Clip Number

Total Clips

Example

Generating Clip

18 / 61

The progress card is the primary focal point.

---

# 26. Pipeline Timeline

Represent the backend pipeline visually.

Example

✓ Upload

✓ Metadata

✓ Queue

● Processing

○ ZIP Generation

○ Ready

Completed stages display a checkmark.

Current stage glows.

Future stages remain muted.

---

# 27. Activity Timeline

Every major backend event should appear.

Examples

Upload Complete

SHA256 Verified

Merge Complete

Metadata Extracted

Worker Assigned

Segment Planning

Clip 1 Generated

Clip 2 Generated

ZIP Generated

Processing Complete

Events should appear chronologically.

Newest events appear at the top.

---

# 28. Job Details

Display technical information without overwhelming the user.

Fields

Video Name

Duration

Resolution

Codec

FPS

Clip Length

Estimated Clips

Current Stage

Processing Time

This panel should remain visible throughout processing.

---

# 29. Completion State

When processing finishes:

Replace the progress card with a success card.

Display

Processing Complete

Total Clips Generated

Total Processing Time

ZIP Size

Buttons

Download ZIP

Browse Individual Clips

Process Another Video

Avoid celebratory animations.

Professional software should feel calm and confident.

---

# 30. Download Section

Display every generated clip.

Each card contains:

Clip Number

Duration

Resolution

File Size

Download Button

Cards should support keyboard navigation.

ZIP download should remain pinned above the list.

---

# 31. Expiration Notice

Files remain available for one hour.

Display a countdown.

Example

Files will be automatically deleted in

58m 42s

The timer should update live.

When time expires:

Disable downloads.

Replace actions with

Files have expired.

Upload again to create new clips.

---

# 32. Error States

Every error should explain:

What happened

Why it happened (when possible)

How to recover

Examples

Unsupported Format

Upload Failed

Processing Failed

Connection Lost

Job Expired

Never show raw stack traces.

Never expose backend internals.

---

# 33. Empty States

Examples

No Upload

No Downloads

No Recent Jobs

Every empty state should encourage the next logical action.

Avoid generic illustrations.

---

# 34. Loading States

Prefer Skeleton Loaders over spinners.

Skeletons communicate layout and reduce perceived waiting time.

Use spinners only when no meaningful placeholder exists.

---

# 35. Success States

Every successful action should provide subtle confirmation.

Examples

✓ Upload Complete

✓ ZIP Ready

✓ Download Started

Avoid excessive animations or notifications.

Professional software should feel confident rather than celebratory.

---

# End of Part 2

# 36. Component Library

## Philosophy

Every component in ClipForge should be reusable.

Components must solve one responsibility only.

Avoid creating page-specific components whenever a reusable alternative exists.

Every component should have:

• Clear purpose

• Predictable behaviour

• Consistent styling

• Accessibility support

• Responsive layout

No component should directly call backend APIs.

Business logic belongs in hooks or services.

---

# 37. Application Hierarchy

Application

├── Navbar

├── Workspace

│   ├── UploadCard

│   ├── VideoMetadataCard

│   ├── ClipSettingsCard

│   ├── ProgressCard

│   ├── PipelineTimeline

│   ├── ActivityTimeline

│   ├── JobDetailsCard

│   ├── DownloadPanel

│   ├── ExpiryCard

│   └── ErrorPanel

└── Footer

---

# 38. Navbar

Purpose

Provide global navigation.

Contents

Logo

GitHub

Theme Toggle

Rules

Height should remain consistent.

Never become visually dominant.

Remain sticky while scrolling.

---

# 39. Upload Card

Purpose

Primary interaction point.

States

Idle

Drag Over

Uploading

Upload Complete

Disabled

Contents

Drag Area

Browse Button

Supported Formats

Maximum File Size

Visual Behaviour

Large drop zone.

Soft hover animation.

Border highlight while dragging.

Accessibility

Keyboard accessible.

Paste support can be added later.

---

# 40. Video Metadata Card

Purpose

Present information extracted using FFprobe.

Fields

Filename

Duration

Resolution

Codec

Frame Rate

Estimated Clips

Estimated Processing Time

Design Rules

Read-only.

Never editable.

---

# 41. Clip Settings Card

Purpose

Configure processing.

Controls

Clip Length

Custom Duration

Process Button

Validation

Disable Process until valid input.

Never allow invalid durations.

---

# 42. Progress Card

Purpose

Primary feedback during processing.

Contains

Progress Bar

Current Stage

Current Clip

Elapsed Time

Remaining Time

Visual Priority

Highest.

This card should naturally attract attention.

---

# 43. Pipeline Timeline

Purpose

Visualise backend stages.

Stages

Upload

Metadata

Queue

Processing

ZIP

Ready

Completed

Green Check

Current

Blue Glow

Future

Muted

Animation

Current stage transitions smoothly.

---

# 44. Activity Timeline

Purpose

Display chronological events.

Newest first.

Each entry contains

Icon

Timestamp

Description

Examples

Upload Complete

Metadata Extracted

Clip Generated

ZIP Complete

Processing Finished

---

# 45. Job Details Card

Purpose

Display technical details.

Fields

Video

Codec

FPS

Resolution

Duration

Clip Size

Current Stage

Should remain visible throughout processing.

---

# 46. Download Panel

Purpose

Provide downloads.

Buttons

Download ZIP

Download Individual Clip

Each clip card

Clip Number

Duration

File Size

Download Button

ZIP button remains pinned.

---

# 47. Expiry Card

Purpose

Communicate temporary storage.

Display

Countdown Timer

Expiry Time

Message

Files are automatically deleted after one hour.

Behaviour

Turns warning colour during last five minutes.

---

# 48. Error Panel

Purpose

Display recoverable failures.

Contains

Title

Explanation

Recovery Action

Retry Button (when possible)

Never expose stack traces.

---

# 49. Empty State

Examples

No Upload

No Downloads

No Recent Jobs

Design

Simple icon.

Clear explanation.

Primary action button.

---

# 50. Loading Skeletons

Every major card should have a skeleton version.

Avoid blank screens.

Avoid layout shifts.

---

# 51. Motion Philosophy

Animation communicates state.

Never animate purely for decoration.

Animation should answer:

What changed?

Where did it go?

What should the user focus on?

---

# 52. Motion Durations

Hover

150ms

Card Expansion

250ms

Dialogs

250ms

Progress Updates

Smooth

Page Load

300ms Fade

Avoid animations longer than 400ms.

---

# 53. Hover Behaviour

Buttons

Subtle elevation.

Cards

Slight border emphasis.

Icons

Opacity transition.

Never use exaggerated scaling.

---

# 54. Focus Behaviour

Every interactive element requires visible focus.

Keyboard navigation must feel first-class.

---

# 55. Responsive Behaviour

Desktop

Primary experience.

Laptop

Identical layout.

Tablet

Stack secondary panels vertically.

Mobile

Single column layout.

Pipeline collapses.

Activity becomes accordion.

Downloads remain accessible.

---

# 56. Accessibility

Minimum touch target

44px

Semantic HTML

Required

ARIA labels

Required

Keyboard navigation

Required

Reduced motion

Supported

Contrast

WCAG AA

---

# 57. Performance Rules

Avoid unnecessary re-renders.

Lazy load heavy components.

Virtualize long activity timelines.

Avoid blocking animations.

Images should be optimized.

---

# 58. Component Naming

PascalCase.

Examples

UploadCard

ProgressCard

DownloadPanel

PipelineTimeline

ExpiryCard

Never use vague names like

Card1

ComponentA

MainPanel

---

# 59. Design Consistency

Every spacing value follows the 8-point grid.

Every border radius follows design tokens.

Every colour comes from the theme.

No hardcoded colours.

No inline styles.

No duplicated components.

---

# End of Part 3

# 60. Frontend Architecture

## Philosophy

The frontend architecture should prioritize:

- Simplicity
- Maintainability
- Reusability
- Scalability
- Separation of concerns

The frontend should remain independent from backend implementation details.

Changing backend endpoints should require minimal frontend modifications.

---

# 61. Technology Stack

Framework

React 19

Language

TypeScript

Styling

TailwindCSS

Component Library

ShadCN UI

Icons

Lucide Icons

Animations

Framer Motion

Server State

TanStack Query

Forms

React Hook Form

Validation

Zod

Notifications

Sonner

Theme

next-themes (or equivalent)

---

# 62. Folder Structure

frontend/

src/

app/

components/

layout/

workspace/

upload/

processing/

download/

common/

hooks/

services/

api/

types/

constants/

utils/

styles/

assets/

public/

Every folder should have one clear responsibility.

Avoid deep nesting.

---

# 63. Component Rules

Every UI element belongs inside components.

Components should be:

Reusable

Independent

Predictable

Avoid large monolithic files.

If a component exceeds approximately 250 lines, consider splitting it.

---

# 64. State Management

Separate state into categories.

Local UI State

Component state only.

Examples

Dialog open

Dropdown

Hover

Server State

Managed by TanStack Query.

Examples

Job Status

Metadata

Downloads

Upload Progress

Global State

Use only when absolutely necessary.

Avoid unnecessary global stores.

---

# 65. API Layer

No component should call fetch() directly.

Every backend request goes through:

services/api/

Example

UploadService

JobService

DownloadService

QueueService

Components consume hooks.

Hooks consume services.

Services communicate with backend.

---

# 66. Data Fetching

Use TanStack Query.

Responsibilities

Caching

Retries

Background Refresh

Loading States

Error States

Never manually synchronize server state.

---

# 67. Mock API Strategy

During frontend development:

Every backend endpoint should have a mock implementation.

Mock responses should mirror production API contracts.

Switching from mock to production should require changing only the API base configuration.

---

# 68. Environment Variables

All environment-specific values belong in environment files.

Examples

API Base URL

Application Name

Version

Feature Flags

Never hardcode URLs.

---

# 69. Error Handling

Every API request should handle:

Loading

Success

Failure

Expired Session

Unexpected Response

Display user-friendly messages.

Never expose internal backend errors.

---

# 70. Upload Integration

The Upload component should support:

Chunked Uploads

Progress Updates

Retry

Cancellation

Future Pause/Resume

The UI must remain responsive during upload.

---

# 71. Processing Integration

Polling or WebSocket implementation should be isolated.

The Workspace should never know how updates arrive.

It only reacts to state changes.

This allows polling to be replaced with WebSockets later.

---

# 72. Download Integration

Support:

ZIP Download

Individual Clip Download

Expiry Detection

Automatic Refresh

Disable unavailable downloads gracefully.

---

# 73. Performance

Use lazy loading where appropriate.

Memoize expensive calculations.

Avoid unnecessary re-renders.

Virtualize long lists.

Optimize bundle size.

Avoid blocking the main thread.

---

# 74. Security

Never trust frontend validation alone.

Always validate user input.

Escape user-provided content.

Never expose secrets.

Never expose internal identifiers unnecessarily.

---

# 75. Accessibility

Keyboard navigation required.

Visible focus indicators required.

Screen reader support required.

ARIA labels required.

Reduced motion supported.

Touch targets minimum 44px.

---

# 76. Coding Standards

Strict TypeScript.

No any.

Prefer composition over inheritance.

Avoid duplicated logic.

Avoid magic numbers.

Use descriptive names.

Follow consistent formatting.

No commented-out code.

No dead code.

---

# 77. Logging

Development logging only.

Remove unnecessary console output before production.

Errors should be centralized.

---

# 78. Testing

Future implementation should support:

Unit Tests

Component Tests

Integration Tests

End-to-End Tests

Design components to be testable.

---

# 79. Backend Compatibility

The frontend must remain compatible with:

Chunk Upload System

Background Queue

Job Status State Machine

FFprobe Metadata

Lossless Processing Engine

ZIP Generation

One-Hour Expiration

Avoid assumptions about backend internals.

---

# 80. Future Expansion

The architecture should allow future tools without redesign.

Examples

Video Splitter

Video Trimmer

Video Merger

Video Compressor

Video Converter

Audio Extraction

Thumbnail Generator

Subtitle Extraction

The Workspace should be reusable.

Only the tool configuration changes.

---

# 81. Definition of Done

The frontend is considered complete when:

✓ Upload works

✓ Metadata displays

✓ Processing configuration works

✓ Job status updates correctly

✓ Progress is visible

✓ Downloads function

✓ Expiration works

✓ Responsive design works

✓ Accessibility requirements met

✓ Backend integration complete

---

# 82. Final Instructions for Lovable

You are building a production-quality SaaS application.

Do not generate placeholder designs.

Do not prioritize flashy animations.

Prioritize usability, maintainability, and consistency.

The generated application should feel comparable to modern productivity software such as Linear, Vercel, Notion, or Raycast.

Respect the design system defined in this document.

Respect component hierarchy.

Respect responsive rules.

Respect accessibility.

Keep the code clean.

Keep components reusable.

Avoid unnecessary abstraction.

Generate an interface that can be connected to the existing backend with minimal modifications.

---

# End of Document

ClipForge Frontend Design Bible

Version 1.0

Status: Approved for MVP Development