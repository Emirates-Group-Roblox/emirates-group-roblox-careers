// --- Sample HR accounts (you can expand this list or later store them in a JSON/db) ---
const hrAccounts = [
  { username: "admin", password: "admin123" },
  { username: "hrmanager", password: "egroblox2025" }
];

// --- Handle Login ---
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  const validUser = hrAccounts.find(
    user => user.username === username && user.password === password
  );

  if (validUser) {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
  } else {
    alert("Invalid username or password.");
  }
});

// --- Switch Between Sections ---
function showSection(sectionId) {
  const sections = document.querySelectorAll('.hr-section');
  sections.forEach(sec => sec.style.display = 'none');

  document.getElementById(sectionId).style.display = 'block';
}

// --- Logout ---
function logout() {
  document.getElementById('dashboard-section').style.display = 'none';
  document.getElementById('login-section').style.display = 'block';
  document.getElementById('loginForm').reset();
}
