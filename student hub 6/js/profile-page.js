/**
 * Profile Page Dynamic Controller
 * Reads & renders registered student JSON from localStorage,
 * fetches campus student directory from data/students.json with search, filter, sort & pagination,
 * and allows JSON export/editing.
 */

let allDirectoryStudents = [];
let filteredDirectoryStudents = [];
let directoryPage = 1;
const DIRECTORY_PAGE_SIZE = 4;
let directorySearchQuery = '';
let directoryDepartment = 'all';
let directorySortOrder = 'name-asc';

// Load and render the current logged-in/registered user profile
async function loadCurrentProfile() {
    let currentUser = null;
    const storedUserJson = localStorage.getItem('student_hub_current_user');

    if (storedUserJson) {
        try {
            currentUser = JSON.parse(storedUserJson);
        } catch (e) {
            console.error('Error parsing stored user JSON:', e);
        }
    }

    // If no user is registered yet, load default from data/students.json
    if (!currentUser) {
        try {
            const res = await fetch('../data/students.json');
            const data = await res.json();
            if (data && data.length > 0) {
                currentUser = {
                    ...data[0],
                    course: data[0].course || 'B.Tech',
                    year: data[0].year || 'Third Year',
                    mobile: data[0].mobile || '+91 9876543210',
                    gender: data[0].gender || 'Male',
                    bio: data[0].bio || 'Enrolled student exploring software engineering and web technologies.',
                    skills: data[0].skills || ['HTML5', 'CSS3', 'JavaScript', 'Python']
                };
                localStorage.setItem('student_hub_current_user', JSON.stringify(currentUser));
            }
        } catch (e) {
            console.warn('Could not fetch default student:', e);
        }
    }

    if (currentUser) {
        renderProfileData(currentUser);
    }

    // Load registered events for this user
    loadRegisteredEvents();
}

function renderProfileData(user) {
    // Top summary
    const nameEls = document.querySelectorAll('.profile-name-display');
    nameEls.forEach(el => el.textContent = user.name || 'Student Name');

    const courseEls = document.querySelectorAll('.profile-course-display');
    courseEls.forEach(el => {
        el.textContent = `${user.course || 'B.Tech'} in ${user.department || 'Computer Science'} (${user.year || '3rd Year'})`;
    });

    // ID Badge
    const idEl = document.getElementById('profile-id-display');
    if (idEl) idEl.textContent = user.id || 'STU-1001';

    // Info fields
    const emailEl = document.getElementById('profile-email-display');
    if (emailEl) emailEl.textContent = user.email || 'student@university.edu';

    const mobileEl = document.getElementById('profile-mobile-display');
    if (mobileEl) mobileEl.textContent = user.mobile || '+91 9876543210';

    const deptEl = document.getElementById('profile-dept-display');
    if (deptEl) deptEl.textContent = user.department || 'Computer Science';

    const semEl = document.getElementById('profile-sem-display');
    if (semEl) semEl.textContent = `Semester ${user.semester || '3'}`;

    const genderEl = document.getElementById('profile-gender-display');
    if (genderEl) genderEl.textContent = user.gender || 'Not Specified';

    const cityEl = document.getElementById('profile-city-display');
    if (cityEl) cityEl.textContent = user.city || 'Campus Resident';

    const dateEl = document.getElementById('profile-date-display');
    if (dateEl) dateEl.textContent = user.registeredDate || new Date().toISOString().split('T')[0];

    const bioEl = document.getElementById('profile-bio-display');
    if (bioEl) bioEl.textContent = user.bio || `Student enrolled in ${user.course || 'B.Tech'} (${user.year || 'Third Year'}).`;

    // Avatar initials
    const initials = (user.name || 'S H').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const avatarTextEls = document.querySelectorAll('.profile-avatar-initials');
    avatarTextEls.forEach(el => el.textContent = initials);

    // Skills
    const skillsContainer = document.getElementById('profile-skills-display');
    if (skillsContainer && user.skills && Array.isArray(user.skills)) {
        skillsContainer.innerHTML = user.skills.map(s => 
            `<span style="display: inline-block; background: var(--primary-light); color: var(--primary-color); font-weight: 600; font-size: 0.8rem; padding: 0.3rem 0.75rem; border-radius: 20px; margin-right: 0.5rem; margin-bottom: 0.5rem;">${s}</span>`
        ).join('');
    }

    // Update global header/sidebar name displays
    const navUserNames = document.querySelectorAll('.user-display-name');
    navUserNames.forEach(el => el.textContent = user.name || 'Student');

    const navUserRoles = document.querySelectorAll('.user-display-role');
    navUserRoles.forEach(el => el.textContent = `${user.course || 'B.Tech'} · ${user.year || '3rd Year'}`);
}

async function loadRegisteredEvents() {
    const regContainer = document.getElementById('profile-registered-events');
    if (!regContainer) return;

    try {
        const storedIds = JSON.parse(localStorage.getItem('student_hub_registered_events') || '[]');
        const res = await fetch('../data/events.json');
        const allEvents = await res.json();

        const registeredEvents = allEvents.filter(e => storedIds.includes(e.id));

        if (registeredEvents.length === 0) {
            regContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; border: 1px dashed var(--border-color); border-radius: 8px; color: var(--text-muted);">
                    <p style="margin-bottom: 0.75rem;">You have not registered for any campus events yet.</p>
                    <a href="event.html" class="btn btn-sm btn-primary">Browse & Register for Events</a>
                </div>`;
        } else {
            regContainer.innerHTML = registeredEvents.map(event => `
                <div class="card mb-2" style="padding: 1rem 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; border-left: 4px solid var(--primary-color);">
                    <div>
                        <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 600; color: var(--primary-color); background: var(--primary-light); padding: 0.15rem 0.5rem; border-radius: 4px;">
                            ${event.category}
                        </span>
                        <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin: 0.35rem 0 0.2rem;">
                            ${event.title}
                        </h4>
                        <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">
                            📅 ${event.date} · 📍 ${event.venue} · 👤 ${event.organizer}
                        </p>
                    </div>
                    <span style="font-size: 0.8rem; font-weight: 600; color: #16a34a; background: #dcfce7; padding: 0.3rem 0.75rem; border-radius: 20px;">
                        ✓ Confirmed
                    </span>
                </div>
            `).join('');
        }
    } catch (e) {
        console.error('Error loading registered events:', e);
    }
}

// Download profile JSON
window.downloadProfileJson = function () {
    const storedUserJson = localStorage.getItem('student_hub_current_user');
    if (!storedUserJson) {
        alert('No profile data available to download.');
        return;
    }

    const blob = new Blob([storedUserJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student_profile_${JSON.parse(storedUserJson).id || 'data'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

// Edit Profile Modal Handling
window.openEditProfileModal = function () {
    const stored = localStorage.getItem('student_hub_current_user');
    if (!stored) return;
    const user = JSON.parse(stored);

    document.getElementById('edit-name').value = user.name || '';
    document.getElementById('edit-email').value = user.email || '';
    document.getElementById('edit-mobile').value = user.mobile || '';
    document.getElementById('edit-course').value = user.course || 'B.Tech';
    document.getElementById('edit-year').value = user.year || 'Third Year';
    document.getElementById('edit-dept').value = user.department || 'Computer Science';
    document.getElementById('edit-city').value = user.city || '';
    document.getElementById('edit-bio').value = user.bio || '';
    document.getElementById('edit-skills').value = (user.skills || []).join(', ');

    const modal = document.getElementById('edit-profile-modal');
    if (modal) modal.style.display = 'flex';
};

window.closeEditProfileModal = function () {
    const modal = document.getElementById('edit-profile-modal');
    if (modal) modal.style.display = 'none';
};

window.saveProfileChanges = function (e) {
    if (e) e.preventDefault();

    const stored = localStorage.getItem('student_hub_current_user') || '{}';
    const existing = JSON.parse(stored);

    const skillsRaw = document.getElementById('edit-skills').value;
    const skillsArr = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);

    const updatedUser = {
        ...existing,
        name: document.getElementById('edit-name').value.trim() || existing.name,
        email: document.getElementById('edit-email').value.trim() || existing.email,
        mobile: document.getElementById('edit-mobile').value.trim() || existing.mobile,
        course: document.getElementById('edit-course').value,
        year: document.getElementById('edit-year').value,
        department: document.getElementById('edit-dept').value.trim() || existing.department,
        city: document.getElementById('edit-city').value.trim() || existing.city,
        bio: document.getElementById('edit-bio').value.trim() || existing.bio,
        skills: skillsArr.length > 0 ? skillsArr : existing.skills
    };

    localStorage.setItem('student_hub_current_user', JSON.stringify(updatedUser));
    renderProfileData(updatedUser);
    closeEditProfileModal();

    // Show temporary feedback toast
    const alertBox = document.getElementById('profile-saved-toast');
    if (alertBox) {
        alertBox.style.display = 'block';
        setTimeout(() => { alertBox.style.display = 'none'; }, 3000);
    }
};

// ==========================================
// CAMPUS STUDENT DIRECTORY (JSON Fetch API)
// ==========================================
async function fetchDirectoryStudents() {
    const container = document.getElementById('student-directory-container');
    const loading = document.getElementById('directory-loading');

    if (loading) loading.style.display = 'block';

    try {
        const res = await fetch('../data/students.json');
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        
        let jsonStudents = await res.json();
        
        // Merge with any locally registered users
        const localStudents = JSON.parse(localStorage.getItem('student_hub_students') || '[]');
        const existingEmails = new Set(jsonStudents.map(s => s.email));
        
        localStudents.forEach(ls => {
            if (!existingEmails.has(ls.email)) {
                jsonStudents.unshift(ls);
            }
        });

        allDirectoryStudents = jsonStudents;
        populateDepartmentOptions();
        applyDirectoryFilters();
    } catch (err) {
        console.error('Failed to load student directory:', err);
        if (container) {
            container.innerHTML = `
                <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #b42318;">
                    <p>Unable to load student directory.</p>
                </div>`;
        }
    } finally {
        if (loading) loading.style.display = 'none';
    }
}

function populateDepartmentOptions() {
    const deptSelect = document.getElementById('directory-dept-select');
    if (!deptSelect) return;
    const depts = Array.from(new Set(allDirectoryStudents.map(s => s.department))).sort();
    deptSelect.innerHTML = '<option value="all">All Departments</option>' +
        depts.map(d => `<option value="${d}">${d}</option>`).join('');
}

function renderStudentCard(student) {
    const initials = (student.name || 'S').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    return `
        <div class="card student-card" style="text-align: left; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between; border-radius: 10px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
            <div>
                <div style="display: flex; align-items: center; gap: 0.85rem; margin-bottom: 0.85rem;">
                    <div style="width: 44px; height: 44px; border-radius: 50%; background: #2563d9; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1rem; flex-shrink: 0;">
                        ${initials}
                    </div>
                    <div>
                        <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--navy); margin: 0;">
                            ${student.name}
                        </h4>
                        <span style="font-size: 0.75rem; background: var(--primary-light); color: var(--primary-color); font-weight: 600; padding: 0.15rem 0.5rem; border-radius: 12px;">
                            ${student.department}
                        </span>
                    </div>
                </div>

                <div style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 0.85rem;">
                    <p>📚 <strong>Course:</strong> ${student.course || 'B.Tech'} (Sem ${student.semester || '3'})</p>
                    <p>✉️ <strong>Email:</strong> ${student.email}</p>
                    <p>📍 <strong>City:</strong> ${student.city || 'Campus'}</p>
                </div>
            </div>

            <button type="button" class="btn btn-sm btn-outline btn-block" onclick="window.viewStudentDetails('${student.email}')">
                View Full Profile
            </button>
        </div>
    `;
}

function applyDirectoryFilters() {
    const q = directorySearchQuery.toLowerCase().trim();

    filteredDirectoryStudents = allDirectoryStudents.filter(s => {
        const matchesDept = directoryDepartment === 'all' || s.department === directoryDepartment;
        const matchesSearch = !q ||
            s.name.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q) ||
            (s.city && s.city.toLowerCase().includes(q)) ||
            (s.department && s.department.toLowerCase().includes(q));

        return matchesDept && matchesSearch;
    });

    // Sorting
    filteredDirectoryStudents.sort((a, b) => {
        if (directorySortOrder === 'name-asc') {
            return a.name.localeCompare(b.name);
        } else if (directorySortOrder === 'name-desc') {
            return b.name.localeCompare(a.name);
        }
        return 0;
    });

    // Pagination (4 items per page)
    const totalPages = Math.max(1, Math.ceil(filteredDirectoryStudents.length / DIRECTORY_PAGE_SIZE));
    if (directoryPage > totalPages) directoryPage = 1;

    const startIndex = (directoryPage - 1) * DIRECTORY_PAGE_SIZE;
    const pageItems = filteredDirectoryStudents.slice(startIndex, startIndex + DIRECTORY_PAGE_SIZE);

    const countEl = document.getElementById('directory-result-count');
    if (countEl) {
        countEl.textContent = `Showing ${filteredDirectoryStudents.length === 0 ? 0 : startIndex + 1}-${Math.min(startIndex + DIRECTORY_PAGE_SIZE, filteredDirectoryStudents.length)} of ${filteredDirectoryStudents.length} students`;
    }

    const container = document.getElementById('student-directory-container');
    if (container) {
        if (pageItems.length === 0) {
            container.innerHTML = `
                <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 2rem; background: var(--bg-card);">
                    <p style="color: var(--text-muted);">No student profiles match your search.</p>
                </div>`;
        } else {
            container.innerHTML = pageItems.map(renderStudentCard).join('');
        }
    }

    renderDirectoryPagination(totalPages);
}

function renderDirectoryPagination(totalPages) {
    const pagContainer = document.getElementById('directory-pagination');
    if (!pagContainer) return;

    if (totalPages <= 1) {
        pagContainer.innerHTML = '';
        return;
    }

    let html = `
        <button class="page-button" type="button" ${directoryPage === 1 ? 'disabled' : ''} onclick="window.goToDirectoryPage(${directoryPage - 1})">
            &laquo; Prev
        </button>
    `;

    for (let p = 1; p <= totalPages; p++) {
        html += `
            <button class="page-button ${p === directoryPage ? 'active' : ''}" type="button" onclick="window.goToDirectoryPage(${p})">
                ${p}
            </button>
        `;
    }

    html += `
        <button class="page-button" type="button" ${directoryPage === totalPages ? 'disabled' : ''} onclick="window.goToDirectoryPage(${directoryPage + 1})">
            Next &raquo;
        </button>
    `;

    pagContainer.innerHTML = html;
}

window.goToDirectoryPage = function (page) {
    directoryPage = page;
    applyDirectoryFilters();
};

window.viewStudentDetails = function (email) {
    const student = allDirectoryStudents.find(s => s.email === email);
    if (!student) return;

    // Load selected student into primary profile view
    renderProfileData(student);
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Initialization on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    loadCurrentProfile();
    fetchDirectoryStudents();

    const searchInput = document.getElementById('directory-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            directorySearchQuery = e.target.value;
            directoryPage = 1;
            applyDirectoryFilters();
        });
    }

    const deptSelect = document.getElementById('directory-dept-select');
    if (deptSelect) {
        deptSelect.addEventListener('change', (e) => {
            directoryDepartment = e.target.value;
            directoryPage = 1;
            applyDirectoryFilters();
        });
    }

    const sortSelect = document.getElementById('directory-sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            directorySortOrder = e.target.value;
            applyDirectoryFilters();
        });
    }

    const editForm = document.getElementById('edit-profile-form');
    if (editForm) {
        editForm.addEventListener('submit', window.saveProfileChanges);
    }
});
