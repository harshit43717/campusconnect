# CampusConnect 🎓

> **Unified College Event Management & Discovery Platform**  
> Built with React, Vite, Tailwind CSS, Lucide Icons, and React Router.

---

## 🌟 Overview & Key Features

CampusConnect solves campus event communication fragmentation by providing a central hub for students and organizers:

### 👨‍🎓 For Students
* **Live Discovery Feed:** Filter events across Technical, Cultural, Sports, Workshops, Academic, and Gaming categories.
* **Instant Full-Text Search:** Search by event title, organizer name, tags, venue, or keywords.
* **Sorting & Status:** Sort by date (earliest/latest), popularity (attendee registrations), or alphabetical.
* **Deep-Linked Event Details (`/events/:id`):** View comprehensive agenda schedules, venue maps/virtual links, seat capacity progress meters, and organizer contacts.
* **One-Click Event Registration:** Pre-filled student credentials, atomic capacity enforcement, and downloadable attendee passes with unique ticket codes (`CC-XXXXXX`).
* **Personalized Bookmark Watchlist (`/saved`):** Bookmark events to track them without registering.
* **My Registrations Dashboard (`/my-registrations`):** View confirmed digital passes and cancel registrations with automatic seat re-opening.

### 🛡️ For Campus Administrators
* **Admin Control Center (`/admin/dashboard`):** Real-time analytics on total events, student seats booked, occupancy rates, and virtual rooms.
* **Event CRUD:** Add new campus events with rich metadata and form validation; edit details; or delete events with cascade cleanup.
* **Attendee Inspection & CSV Export:** View registered student rosters per event and export attendee CSV files.
* **Role Switcher Pill:** Seamlessly toggle between "Student" and "Admin" views from the navbar to test both experiences.

---

## 🚀 Getting Started

### 1. Start the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` (or the port displayed in terminal).

### 2. Build for Production
```bash
npm run build
```

### 3. Preview Production Build
```bash
npm run preview
```

---

## 🏗️ Architecture & Decoupled Data Access Layer

CampusConnect is engineered with a **Repository Pattern** (`src/services/storageService.js`) to decouple UI components from the underlying persistence layer.
* **MVP Implementation:** Uses `localStorage` with initial fallback to rich seed data (`INITIAL_EVENTS`), automatic schema versioning, and atomic capacity checking.
* **Future Supabase Integration:** Replace `storageService.js` methods with Supabase JavaScript client calls (`@supabase/supabase-js`) without modifying UI components.

---

## 🗄️ Database Schema for Future Supabase Integration

The SQL schema is ready for migration to PostgreSQL / Supabase with Row Level Security (RLS):

```sql
-- Profiles table extending Supabase auth.users
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  roll_number text unique,
  department text,
  role text check (role in ('student', 'admin')) default 'student',
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Events table
create table public.events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  short_description text,
  category text not null,
  date date not null,
  time text not null,
  venue text not null,
  is_virtual boolean default false,
  meeting_link text,
  max_capacity integer not null check (max_capacity > 0),
  registered_count integer default 0 check (registered_count >= 0),
  poster_url text,
  organizer text not null,
  organizer_contact text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Registrations table
create table public.registrations (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  student_name text not null,
  student_id text not null,
  student_email text not null,
  department text,
  ticket_code text not null unique,
  registered_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (event_id, student_email)
);

-- Bookmarks table
create table public.bookmarks (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (event_id, user_id)
);
```
