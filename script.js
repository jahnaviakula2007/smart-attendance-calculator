let subjects = [];

function addSubject() {
    let subjectName = document.getElementById("subject").value.trim();
    let total = Number(document.getElementById("total").value);
    let attended = Number(document.getElementById("attended").value);

    if (subjectName === "" || total <= 0 || attended < 0 || attended > total) {
        alert("Please enter valid details");
        return;
    }

    let percentage = ((attended / total) * 100).toFixed(2);
    let requiredClasses = Math.ceil(0.75 * total);
    let status = "";
    let extraInfo = "";

    if (percentage >= 75) {
        status = "Eligible ✅";
        let canSkip = attended - requiredClasses;
        extraInfo = `Can skip ${canSkip} class(es)`;
    } else {
        status = "Not Eligible ❌";
        let mustAttend = requiredClasses - attended;
        extraInfo = `Must attend ${mustAttend} class(es)`;
    }

    subjects.push({ subject: subjectName, total, attended, percentage, status, extraInfo });

    updateTable();

    // Clear inputs
    document.getElementById("subject").value = "";
    document.getElementById("total").value = "";
    document.getElementById("attended").value = "";
}

function updateTable() {
    let tableBody = document.getElementById("subjectsTable").getElementsByTagName('tbody')[0];
    tableBody.innerHTML = "";

    let latestPercentage = 0;

    subjects.forEach((sub, index) => {
        let row = tableBody.insertRow();
        row.innerHTML = `<td>${sub.subject}</td>
                         <td>${sub.total}</td>
                         <td>${sub.attended}</td>
                         <td>${sub.percentage}%</td>
                         <td>${sub.status}</td>
                         <td>${sub.extraInfo}</td>
                         <td>
                             <button class="editBtn" onclick="editSubject(${index})">Edit</button>
                             <button class="deleteBtn" onclick="deleteSubject(${index})">Delete</button>
                         </td>`;
        if (index === subjects.length - 1) latestPercentage = sub.percentage;
    });

    // Update last subject progress bar
    let progressBar = document.getElementById("progressBar");
    if (subjects.length > 0) {
        let lastStatus = subjects[subjects.length - 1].status.includes("✅");
        progressBar.style.width = latestPercentage + "%";
        progressBar.innerText = latestPercentage + "%";
        progressBar.style.background = lastStatus ? "linear-gradient(90deg,#43e97b,#38f9d7)" : "linear-gradient(90deg,#ff416c,#ff4b2b)";
        document.getElementById("result").innerHTML = `<b>Subject:</b> ${subjects[subjects.length-1].subject}<br>
                                                       <b>Attendance:</b> ${latestPercentage}%<br>
                                                       Status: ${subjects[subjects.length-1].status}<br>
                                                       ${subjects[subjects.length-1].extraInfo}`;
    }

    updateOverall();
}

function editSubject(index) {
    let sub = subjects[index];
    document.getElementById("subject").value = sub.subject;
    document.getElementById("total").value = sub.total;
    document.getElementById("attended").value = sub.attended;

    subjects.splice(index, 1); // remove old entry
    updateTable();
}

function deleteSubject(index) {
    subjects.splice(index, 1);
    updateTable();
}

function updateOverall() {
    let totalClassesAll = 0;
    let attendedClassesAll = 0;

    subjects.forEach(sub => {
        totalClassesAll += sub.total;
        attendedClassesAll += sub.attended;
    });

    let overallPercentage = totalClassesAll ? ((attendedClassesAll / totalClassesAll) * 100).toFixed(2) : 0;
    let overallBar = document.getElementById("overallBar");
    let overallText = `<b>Overall Attendance:</b> ${overallPercentage}%`;

    if (overallPercentage >= 75) {
        overallText += " (Eligible ✅)";
        overallBar.style.background = "linear-gradient(90deg,#43e97b,#38f9d7)";
    } else {
        overallText += " (Not Eligible ❌)";
        overallBar.style.background = "linear-gradient(90deg,#ff416c,#ff4b2b)";
    }

    document.getElementById("overallResult").innerHTML = overallText;
    overallBar.style.width = overallPercentage + "%";
}

function resetAll() {
    subjects = [];
    document.getElementById("result").innerHTML = "";
    document.getElementById("overallResult").innerHTML = "No data yet";
    document.getElementById("progressBar").style.width = "0%";
    document.getElementById("overallBar").style.width = "0%";
    document.getElementById("subjectsTable").getElementsByTagName('tbody')[0].innerHTML = "";

    document.getElementById("subject").value = "";
    document.getElementById("total").value = "";
    document.getElementById("attended").value = "";
}
