// ==========================
// ----- HR DASHBOARD JS -----
// ==========================

// ======== Utility for localStorage ========
function loadData(key, defaultValue) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}
function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ======== Initial Data Setup ========
let hrUsers = loadData('hrUsers', [
  { username: 'admin', password: 'admin123' },
  { username: 'hrmanager', password: 'egroblox2025' }
]);
let jobs = loadData('jobs', []);
let applications = loadData('applications', []);

// ======== Elements ========
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logout-btn');

const jobsTableBody = document.querySelector('#jobsTable tbody');
const jobForm = document.getElementById('jobForm');
const jobTitleInput = document.getElementById('jobTitle');
const jobDescInput = document.getElementById('jobDescription');
const jobEditIndexInput = document.getElementById('jobEditIndex');

const applicationsTableBody = document.querySelector('#applicationsTable tbody');

const staffTableBody = document.querySelector('#staffTable tbody');
const staffForm = document.getElementById('staffForm');
const staffUsernameInput = document.getElementById('staffUsername');
const staffPasswordInput = document.getElementById('staffPassword');
const staffEditIndexInput = document.getElementById('staffEditIndex');

let currentUser = null;

// ======== Login Handling ========
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const username = e.target.username.value.trim();
  const password = e.target.password.value.trim();

  const user = hrUsers.find(u => u.username === username && u.password === password);
  if (user) {
    currentUser = user;
    loginSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    showSection('jobs');
    refreshJobsTable();
    refreshApplicationsTable();
    refreshStaffTable();
    loginForm.reset();
  } else {
    alert('Invalid username or password.');
  }
});

logoutBtn.addEventListener('click', () => {
  currentUser = null;
  dashboardSection.style.display = 'none';
  loginSection.style.display = 'block';
});

// ======== Section Navigation ========
function showSection(sectionId) {
  document.querySelectorAll('.hr-section').forEach(section => {
    section.style.display = (section.id === sectionId) ? 'block' : 'none';
  });
}

// ======== Jobs CRUD ========
jobForm.addEventListener('submit', e => {
  e.preventDefault();
  const title = jobTitleInput.value.trim();
  const description = jobDescInput.value.trim();
  if (!title || !description) {
    alert('Please fill in all job fields.');
    return;
  }
  const editIndex = jobEditIndexInput.value;
  if (editIndex === '') {
    // Add new job
    jobs.push({ title, description });
  } else {
    // Update job
    jobs[editIndex] = { title, description };
  }
  saveData('jobs', jobs);
  refreshJobsTable();
  jobForm.reset();
  jobEditIndexInput.value = '';
});

function refreshJobsTable() {
  jobsTableBody.innerHTML = '';
  jobs.forEach((job, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${job.title}</td>
      <td>${job.description}</td>
      <td>
        <button class="action-btn" onclick="editJob(${i})">Edit</button>
        <button class="action-btn delete-btn" onclick="deleteJob(${i})">Delete</button>
      </td>
    `;
    jobsTableBody.appendChild(tr);
  });
}

window.editJob = function(index) {
  const job = jobs[index];
  jobTitleInput.value = job.title;
  jobDescInput.value = job.description;
  jobEditIndexInput.value = index;
};

window.deleteJob = function(index) {
  if (confirm('Delete this job?')) {
    jobs.splice(index, 1);
    saveData('jobs', jobs);
    refreshJobsTable();
  }
};

// ======== Applications Handling ========
function refreshApplicationsTable() {
  applicationsTableBody.innerHTML = '';
  if (applications.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="8" style="text-align:center; font-style: italic;">No applications yet.</td>`;
    applicationsTableBody.appendChild(tr);
    return;
  }
  applications.forEach((app, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${app.role}</td>
      <td>${app.firstName} ${app.lastName}</td>
      <td>${app.age}</td>
      <td>${app.country}</td>
      <td>${app.discordUsername} (${app.discordID})</td>
      <td>${app.robloxUsername || '-'}</td>
      <td>${app.status || 'Pending'}</td>
      <td>
        ${app.status === 'Pending' ? `
          <button class="action-btn accept-btn" onclick="acceptApplication(${i})">Accept</button>
          <button class="action-btn deny-btn" onclick="denyApplication(${i})">Deny</button>
        ` : ''}
      </td>
    `;
    applicationsTableBody.appendChild(tr);
  });
}

window.acceptApplication = function(index) {
  if (confirm('Accept this application?')) {
    applications[index].status = 'Accepted';
    saveData('applications', applications);
    refreshApplicationsTable();
  }
};

window.denyApplication = function(index) {
  if (confirm('Deny this application?')) {
    applications[index].status = 'Denied';
    saveData('applications', applications);
    refreshApplicationsTable();
  }
};

// ======== HR Staff Management ========
staffForm.addEventListener('submit', e => {
  e.preventDefault();
  const username = staffUsernameInput.value.trim();
  const password = staffPasswordInput.value.trim();
  if (!username || !password) {
    alert('Please fill in both username and password.');
    return;
  }
  const editIndex = staffEditIndexInput.value;
  // Check if username already exists (if adding new)
  if (editIndex === '') {
    if (hrUsers.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      alert('Username already exists.');
      return;
    }
    hrUsers.push({ username, password });
  } else {
    // Update existing
    if (
      hrUsers.some((u, i) => i !== Number(editIndex) && u.username.toLowerCase() === username.toLowerCase())
    ) {
      alert('Username already exists.');
      return;
    }
    hrUsers[editIndex].username = username;
    hrUsers[editIndex].password = password;
  }
  saveData('hrUsers', hrUsers);
  refreshStaffTable();
  staffForm.reset();
  staffEditIndexInput.value = '';
});

function refreshStaffTable() {
  staffTableBody.innerHTML = '';
  hrUsers.forEach((user, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.username}</td>
      <td>
        <button class="action-btn" onclick="editStaff(${i})">Edit</button>
        <button class="action-btn delete-btn" onclick="deleteStaff(${i})">Delete</button>
      </td>
    `;
    staffTableBody.appendChild(tr);
  });
}

window.editStaff = function(index) {
  const user = hrUsers[index];
  staffUsernameInput.value = user.username;
  staffPasswordInput.value = user.password;
  staffEditIndexInput.value = index;
};

window.deleteStaff = function(index) {
  if (confirm('Delete this staff account?')) {
    // Prevent deleting current logged in user
    if (hrUsers[index].username === currentUser.username) {
      alert("You can't delete your own logged-in account.");
      return;
    }
    hrUsers.splice(index, 1);
    saveData('hrUsers', hrUsers);
    refreshStaffTable();
  }
};

// ======== Initial Load ========
document.addEventListener('DOMContentLoaded', () => {
  // If you want auto-login session persist, add here later
  // For now show login form only
});
