---
phase: 7
title: Comprehensive Profile & Onboarding Expansion
status: planned
---

# Phase 7: Comprehensive Profile & Onboarding Expansion

## Goal
Massively expand the user profile model to include exhaustive demographic, lifestyle, and dating intention fields. Update the onboarding flow to collect these (or allow skipping), update the profile edit screen, and integrate the new schema into the backend `profiles` table.

## Requirements
Add the following fields to the user profile:
- **Contact & Auth**: Phone number, email address, third-party logins, device verification code.
- **Basic Info**: Legal first name, display nickname, DOB, age, biological sex, gender identity (cisgender, transgender, non-binary, genderqueer, custom), pronouns.
- **Sexual Orientation**: straight, gay, lesbian, bisexual, pansexual, asexual, queer, etc.
- **Dating Preferences**: Target gender preference, target age preference, preferred discovery radius, relationship goals (long-term, marriage, short-term, casual, ENM, new friends).
- **Media**: Profile photos (headshots, full-body), short video clips, live video/selfie poses for photo verification, voice audio prompts.
- **Location**: Live GPS location (already handled), home city, neighborhood, work location.
- **Physical Traits**: Height, body type.
- **Education & Work**: Educational attainment, university/college, graduation year, current occupation/job title, employer/company, industry.
- **Lifestyle & Habits**: Languages spoken, religious beliefs, political views, ethnicity, family plans, pet ownership, drinking, smoking, weed, other drugs, workout habits, dietary lifestyle, sleep schedule.
- **Personality & Quirks**: Zodiac sign, MBTI personality type, love language.
- **Interests**: Personal interests/passions/hobby tags.
- **Prompts & Bio**: Freeform bio text, structured prompt answers/icebreakers.
- **Integrations**: Spotify favorite artists/anthem, Instagram account feed.

## Implementation Steps

### 1. 🪚 Database Schema Expansion
- Update the `profiles` table and create a related `profile_details` table to accommodate all these fields using ENUMs or strict constraints where appropriate.
- Create migrations for the expanded schema.

### 2. 🪚 Onboarding Flow Updates
- Expand the existing onboarding screens (`src/app/onboarding.tsx` or create a stack) to incorporate the new fields sequentially.
- Group questions logically (e.g., Basics -> Demographics -> Lifestyle -> Dating Preferences -> Media).
- Ensure "Skip for now" is available on non-essential fields to prevent drop-off.

### 3. 🪚 Profile Edit Screen
- Build a comprehensive `edit-profile.tsx` screen where users can view and update all these attributes.
- Use distinct sections (About Me, Lifestyle, Work & Education, Prompts).

### 4. 🪚 Discover Feed Enhancements
- Update the Discover card to display these rich attributes dynamically.
- Render prompts on the profile card.

### 5. 🧪 Verification & Bug Fixing
- Recursively resolve all TypeScript errors and UI alignment issues.
- Ensure all fields read and write correctly to Supabase.
