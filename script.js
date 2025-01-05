let processes = [];
let editIndex = null;

function addProcess() {
    const name = document.getElementById("processName").value;
    const arrival = parseInt(document.getElementById("arrivalTime").value);
    const burst = parseInt(document.getElementById("burstTime").value);
    const priority = parseInt(document.getElementById("priority").value) || null;

    if (!name || isNaN(arrival) || isNaN(burst)) {
        alert("Please fill out all required fields!");
        return;
    }

    if (editIndex !== null) {
        processes[editIndex] = { name, arrival, burst, priority };
        editIndex = null;
    } else {
        processes.push({ name, arrival, burst, priority });
    }

    updateProcessTable();
    clearInputFields();
}

function updateProcessTable() {
    const tbody = document.querySelector("#processTable tbody");
    tbody.innerHTML = "";

    processes.forEach((process, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${process.name}</td>
            <td>${process.arrival}</td>
            <td>${process.burst}</td>
            <td>${process.priority || "N/A"}</td>
            <td>
                <button onclick="editProcess(${index})">Edit</button>
                <button onclick="deleteProcess(${index})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editProcess(index) {
    const process = processes[index];
    document.getElementById("processName").value = process.name;
    document.getElementById("arrivalTime").value = process.arrival;
    document.getElementById("burstTime").value = process.burst;
    document.getElementById("priority").value = process.priority || "";

    editIndex = index;
}

function deleteProcess(index) {
    processes.splice(index, 1);
    updateProcessTable();
}

function clearAllProcesses() {
    processes = [];
    updateProcessTable();
    document.getElementById("ganttChart").innerHTML = "";
    document.querySelector("#statsTable tbody").innerHTML = "";
}

function calculateScheduling() {
    if (processes.length === 0) {
        alert("No processes added!");
        return;
    }

    const selectedAlgorithm = document.getElementById("algorithm").value;

    switch (selectedAlgorithm) {
        case "FCFS":
            scheduleFCFS();
            break;
        case "SJF":
            scheduleSJF();
            break;
        case "RR":
            scheduleRR();
            break;
        case "Priority":
            schedulePriority();
            break;
        case "LJF":
            scheduleLJF();
            break;
        default:
            alert("Invalid scheduling algorithm!");
            return;
    }
}

function scheduleFCFS() {
    processes.sort((a, b) => a.arrival - b.arrival);
    generateResults();
}

function scheduleSJF() {
    processes.sort((a, b) => a.burst - b.burst);
    generateResults();
}

function scheduleRR() {
    alert("Round Robin scheduling not implemented yet.");
}

function schedulePriority() {
    processes.sort((a, b) => (a.priority || Infinity) - (b.priority || Infinity));
    generateResults();
}

function scheduleLJF() {
    processes.sort((a, b) => b.burst - a.burst);
    generateResults();
}

function generateResults() {
    const ganttChart = document.getElementById("ganttChart");
    const statsTable = document.querySelector("#statsTable tbody");

    ganttChart.innerHTML = "";
    statsTable.innerHTML = "";

    let currentTime = 0;
    processes.forEach(process => {
        const waitingTime = Math.max(0, currentTime - process.arrival);
        const turnaroundTime = waitingTime + process.burst;

        const div = document.createElement("div");
        div.style.width = `${process.burst * 20}px`;
        div.style.backgroundColor = `hsl(${(Math.random() * 360)}, 70%, 50%)`;
        div.textContent = process.name;
        ganttChart.appendChild(div);

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${process.name}</td>
            <td>${waitingTime}</td>
            <td>${turnaroundTime}</td>
        `;
        statsTable.appendChild(row);

        currentTime += process.burst;
    });
}

function clearInputFields() {
    document.getElementById("processName").value = "";
    document.getElementById("arrivalTime").value = "";
    document.getElementById("burstTime").value = "";
    document.getElementById("priority").value = "";
}
