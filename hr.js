function loadApplications() {
  const applications = JSON.parse(localStorage.getItem("applications") || "[]");
  const appTable = document.getElementById("applicationsTableBody");
  appTable.innerHTML = "";

  applications.forEach((app, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${app.role}</td>
      <td>${app.firstName} ${app.lastName}</td>
      <td>${app.age}</td>
      <td>${app.country}</td>
      <td>${app.discordUsername || "N/A"}</td>
      <td>${app.discordID || "N/A"}</td>
      <td>${app.robloxUsername}</td>
      <td>${app.status}</td>
      <td>
        ${app.status === "Pending" ? `
          <button onclick="updateStatus(${index}, 'accepted')">Accept</button>
          <button onclick="updateStatus(${index}, 'denied')">Deny</button>
        ` : ""}
      </td>
    `;

    appTable.appendChild(row);
  });
}

async function updateStatus(index, status) {
  const applications = JSON.parse(localStorage.getItem("applications") || "[]");
  const app = applications[index];

  if (!app || !app.discordID) {
    alert("Cannot process: missing Discord ID.");
    return;
  }

  // Update the status locally
  applications[index].status = status;
  localStorage.setItem("applications", JSON.stringify(applications));
  loadApplications();

  // Send DM request to bot
  const result = await fetch("https://15a92bd6-f20f-4c2e-82b9-3ffea95d2701-00-3c059wh445v4x.riker.replit.dev/send-dm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "eg-secret-2025" // Replace this if you used a different secret
    },
    body: JSON.stringify({
      discordID: app.discordID,
      role: app.role,
      status: status
    })
  });

  const resJson = await result.json();
  if (resJson.success) {
    alert(`Application ${status} and DM sent.`);
  } else {
    alert(`Status updated, but DM failed: ${resJson.error || "Unknown error"}`);
  }
}

document.addEventListener("DOMContentLoaded", loadApplications);
