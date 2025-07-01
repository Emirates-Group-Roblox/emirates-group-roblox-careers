// Load jobs from localStorage instead of static JSON
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

// Live search filter
function filterRoles() {
  const search = document.getElementById('roleSearch').value.toLowerCase();
  const cards = document.querySelectorAll('.job-card');
  cards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    card.style.display = title.includes(search) ? 'block' : 'none';
  });
}

// Example form logic (customize as needed)
function openForm(roleTitle) {
  alert(`Application form should open for role: ${roleTitle}`);
  // You can expand this to show a modal form
}

document.addEventListener('DOMContentLoaded', loadJobs);
