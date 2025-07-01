// main.js
fetch('jobs.json')
  .then(response => response.json())
  .then(jobs => {
    const jobList = document.getElementById('job-list');
    jobs.forEach(job => {
      const div = document.createElement('div');
      div.className = 'job-card';
      div.innerHTML = `
        <h2>${job.title}</h2>
        <p><strong>Location:</strong> ${job.location}</p>
        <p>${job.description}</p>
        <a href="apply.html?job=${encodeURIComponent(job.title)}" class="apply-btn">Apply</a>
      `;
      jobList.appendChild(div);
    });
  });
