// Load job listings from jobs.json
fetch('jobs.json')
  .then(response => response.json())
  .then(jobs => {
    const jobListings = document.getElementById('job-listings');
    jobs.forEach((job, index) => {
      const jobCard = document.createElement('div');
      jobCard.className = 'job-card';
      jobCard.innerHTML = `
        <h3>${job.title}</h3>
        <p>${job.description}</p>
        <button onclick="openForm('${job.title}')">Apply</button>
      `;
      jobListings.appendChild(jobCard);
    });
  });

function openForm(roleName) {
  document.getElementById('application-form').style.display = 'block';
  document.getElementById('selected-role-name').textContent = roleName;
  document.getElementById('applyForm').setAttribute('data-role', roleName);
}

function closeForm() {
  document.getElementById('application-form').style.display = 'none';
}

document.getElementById('applyForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {
    role: e.target.getAttribute('data-role'),
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    age: formData.get('age'),
    country: formData.get('country'),
    discordUsername: formData.get('discordUsername'),
    discordID: formData.get('discordID'),
    robloxUsername: formData.get('robloxUsername'),
    whyJoin: formData.get('whyJoin'),
    submittedAt: new Date().toISOString()
  };

  // For now, just log the data
  console.log("Application Submitted:", data);
  alert("Your application has been submitted!");

  // Later: send this to backend or save to applications.json

  e.target.reset();
  closeForm();
});
