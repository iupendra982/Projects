// Insert new user
document.getElementById("dataForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    if (!name || !email) {
        document.getElementById("message").textContent = "Please fill in all fields.";
        return;
    }

    const response = await fetch("/insertData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
    });

    const messageElement = document.getElementById("message");
    const responseData = await response.text();

    messageElement.textContent = responseData;
    if (response.ok) {
        document.getElementById("dataForm").reset();
        fetchData();
    }
});

// Fetch user data
async function fetchData() {
    try {
        const response = await fetch("/fetchData");
        const data = await response.json();

        const tableBody = document.getElementById("tableBody");
        tableBody.innerHTML = "";

        data.forEach((item) => {
            const row = tableBody.insertRow();
            row.insertCell(0).innerHTML = item.name;
            row.insertCell(1).innerHTML = item.email;
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Fetch host information
async function hostinfo() {
    try {
        const response = await fetch("/hostinfo");
        const hostinfo = await response.json();

        document.getElementById("hostinfo").innerHTML = `Host: <b>${hostinfo.hostname}</b>, Private IP: <b>${hostinfo.privateIp}</b>, Public IP: <b>${hostinfo.publicIpAddress}</b>`;
    } catch (error) {
        console.error("Error fetching host info:", error);
    }
}

// Load data on page load
hostinfo();
fetchData();
