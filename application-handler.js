function loadJobs() {
  const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
  const jobContainer = document.getElementById('job-listings');
  jobContainer.innerHTML = '';

  if (jobs.length === 0) {
    jobContainer.innerHTML = '<p>No roles are currently open.</p>';
    return;
  }

  jobs.forEach(job => {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.innerHTML = `
      <h3>${job.title}</h3>
      <p>${job.description}</p>
      <button onclick="openForm('${job.title}')">Apply</button>
    `;
    jobContainer.appendChild(card);
  });
}

function filterRoles() {
  const search = document.getElementById('roleSearch').value.toLowerCase();
  const cards = document.querySelectorAll('.job-card');
  cards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    card.style.display = title.includes(search) ? 'block' : 'none';
  });
}

function openForm(roleTitle) {
  document.getElementById('applicationModal').style.display = 'flex';
  document.getElementById('applyRole').value = roleTitle;
  document.getElementById('formTitle').textContent = `Apply for ${roleTitle}`;
}

function closeForm() {
  document.getElementById('applicationModal').style.display = 'none';
  document.getElementById('applyForm').reset();
}

document.getElementById('applyForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {
    role: document.getElementById('applyRole').value,
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    age: formData.get('age'),
    country: formData.get('country'),
    discordUsername: formData.get('discordUsername'),
    discordID: formData.get('discordID'),
    robloxUsername: formData.get('robloxUsername'),
    submittedAt: new Date().toISOString(),
    status: 'Pending'
  };

  const apps = JSON.parse(localStorage.getItem('applications') || '[]');
  apps.push(data);
  localStorage.setItem('applications', JSON.stringify(apps));

  alert("Your application has been submitted!");
  closeForm();
});

document.addEventListener('DOMContentLoaded', loadJobs);
