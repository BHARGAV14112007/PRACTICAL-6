# Student Hub 6 - College Data Dashboard & Student Portal

> **B.Tech Semester 3 · Practical 6**  
> Dynamic Data Rendering with Fetch API, Search, Filter, Sorting, Pagination, JSON Storage & Profile Management.

---

## 🌟 Key Features Implemented

### 1. Dynamic Data Fetching via Fetch API
- **Events Dataset (`data/events.json`)**: 16 categorized campus events (Workshops, Technical, Cultural, Sports, Seminars) with venue, timings, organizers, capacity, and descriptions.
- **Student Profiles Dataset (`data/students.json`)**: Detailed student records across departments (CSE, IT, Mechanical, Civil, ECE, BCA, BBA) with semesters, skills, and bio.
- **FAQs Dataset (`data/faqs.json`)**: 15 campus FAQs categorized by Academics, Library, Facilities, Sports, Examinations, and Administration.

### 2. Events Page (`pages/event.html`)
- **4 Items Per Page Pagination**: Clean, accessible pagination with `Previous` and `Next` buttons.
- **Real-Time Search**: Instant filtering by event title, venue, organizer, description, or category.
- **Category Filter Pills & Dropdown**: Filter by All, Workshop, Technical, Cultural, Sports, and Seminar.
- **Sorting**: Sort by Date (Earliest / Latest) and Title (A-Z / Z-A).
- **Interactive Registration**: Click "Register Now" to save confirmation into `localStorage`.

### 3. Student Registration & JSON Profile Persistence
- **Form Validation (`pages/register.html` & `js/script.js`)**: Real-time RegEx validation for Name, Email, Mobile (`/^[6-9][0-9]{9}$/`), Course, Year, and Password strength meter.
- **JSON Profile Saving**: On valid registration, the full user record is structured as JSON and persisted in `localStorage` (`student_hub_current_user` and `student_hub_students`).
- **Dynamic Profile Page (`pages/profile.html` & `js/profile-page.js`)**:
  - Dynamically populates registered student details, ID badge, email, contact, department, avatar, and bio.
  - Lists the student's registered campus events.
  - **Edit Profile**: In-page modal allowing users to edit and save profile changes to JSON.
  - **Export JSON**: One-click download of the user's profile as `student_profile.json`.
  - **Campus Student Directory**: Dynamic student directory with live search, department filter, and pagination.

### 4. Interactive FAQs Page (`pages/faq.html`)
- Fetches FAQ records dynamically.
- Interactive HTML5 `<details>` and `<summary>` accordion cards.
- Live search across questions and answers.
- Quick topic filter pills.

### 5. College Data Dashboard (`index.html`)
- Tabbed switcher for Events, Students, and FAQs.
- Live search across multiple fields.
- Dynamic category/department filter dropdowns.
- Multi-column sorting and pagination.

---

## 📁 Project Structure

```
student hub 6/
├── index.html            # College Data Dashboard (Practical 6 main interface)
├── style.css             # Main dashboard styles
├── css/
│   └── style.css         # Complete design system & interactive component styles
├── data/
│   ├── events.json       # 16 campus events with full metadata
│   ├── students.json     # Student records
│   └── faqs.json         # Categorized FAQs
├── js/
│   ├── api.js            # Fetch API loader & validator
│   ├── ui.js             # Card rendering & pagination templates
│   ├── main.js           # Practical 6 dashboard controller
│   ├── events-page.js    # Events page controller (4 per page, search, filter, sort)
│   ├── profile-page.js   # Profile controller (JSON load/edit/export & directory)
│   ├── faq-page.js       # FAQ dynamic accordion controller
│   ├── script.js         # Form validation & JSON registration persistence
│   └── header.js         # Navigation, dark mode & user session sync
└── pages/
    ├── home.html         # Portal homepage
    ├── event.html        # Dynamic Events page
    ├── profile.html      # Dynamic Student Profile & Directory
    ├── faq.html          # Dynamic FAQ page
    ├── register.html     # Registration form with live validation & JSON save
    ├── login.html        # Login page
    ├── dashboard.html    # Student dashboard
    ├── admin.html        # Admin dashboard
    ├── about.html        # About page
    └── contact.html      # Contact form
```
