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
let orgStaffDb = loadData('orgStaffDb', []);

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

const applicationsTableBody = document.getElementById('applicationsTableBody');

const orgStaffForm = document.getElementById('orgStaffForm');
const orgStaffNameInput = document.getElementById('orgStaffName');
const orgStaffRoleInput = document.getElementById('orgStaffRole');
const orgStaffDetailsInput = document.getElementById('orgStaffDetails');
const orgStaffSearchInput = document.getElementById('orgStaffSearch');
const orgStaffTableBody = document.getElementById('orgStaffTableBody');

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
    refreshOrgStaffTable();
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
    jobs.push({ title, description });
  } else {
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
        <button class="action-btn" onclick="editApplication(${i})">Edit</button>
        <button class="action-btn delete-btn" onclick="deleteApplication(${i})">Delete</button>
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

window.editApplication = function(index) {
  const app = applications[index];
  const firstName = prompt('Edit First Name:', app.firstName);
  const lastName = prompt('Edit Last Name:', app.lastName);
  const age = prompt('Edit Age:', app.age);
  const country = prompt('Edit Country:', app.country);
  const discordUsername = prompt('Edit Discord Username:', app.discordUsername);
  const discordID = prompt('Edit Discord ID:', app.discordID);
  const robloxUsername = prompt('Edit Roblox Username:', app.robloxUsername);
  applications[index] = {
    ...app,
    firstName: firstName || app.firstName,
    lastName: lastName || app.lastName,
    age: age || app.age,
    country: country || app.country,
    discordUsername: discordUsername || app.discordUsername,
    discordID: discordID || app.discordID,
    robloxUsername: robloxUsername || app.robloxUsername,
  };
  saveData('applications', applications);
  refreshApplicationsTable();
};

window.deleteApplication = function(index) {
  if (confirm('Delete this application?')) {
    applications.splice(index, 1);
    saveData('applications', applications);
    refreshApplicationsTable();
  }
};

// ======== Org Staff Database ========
orgStaffForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = orgStaffNameInput.value.trim();
  const role = orgStaffRoleInput.value.trim();
  const details = orgStaffDetailsInput.value.trim();
  if (!name || !role || !details) {
    alert('Please fill out all fields for staff record.');
    return;
  }
  orgStaffDb.push({ name, role, details });
  saveData('orgStaffDb', orgStaffDb);
  orgStaffForm.reset();
  refreshOrgStaffTable();
});

function refreshOrgStaffTable() {
  orgStaffTableBody.innerHTML = '';
  const query = orgStaffSearchInput.value.toLowerCase();
  const filtered = orgStaffDb.filter(s =>
    s.name.toLowerCase().includes(query) ||
    s.role.toLowerCase().includes(query)
  );
  filtered.forEach((staff, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${staff.name}</td>
      <td>${staff.role}</td>
      <td>${staff.details}</td>
      <td><button class="delete-btn" onclick="deleteOrgStaff(${i})">Delete</button></td>
    `;
    orgStaffTableBody.appendChild(tr);
  });
}

window.deleteOrgStaff = function(index) {
  if (confirm('Delete this staff member from database?')) {
    orgStaffDb.splice(index, 1);
    saveData('orgStaffDb', orgStaffDb);
    refreshOrgStaffTable();
  }
};

orgStaffSearchInput.addEventListener('input', refreshOrgStaffTable);

// ======== Initial Load ========
document.addEventListener('DOMContentLoaded', () => {
  // Page setup on load
});
