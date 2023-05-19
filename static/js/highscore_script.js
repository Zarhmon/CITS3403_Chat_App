document.getElementById("back-button").addEventListener("click", function () {
    window.location.href = '/main';
});


// Wait for the document to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Get all the table rows
    var tableRows = document.querySelectorAll(".highscores-table tbody tr");

    // Disable hover effect for each row
    tableRows.forEach(function (row) {
        row.style.backgroundColor = "transparent";
        row.style.transition = "none";
        row.style.cursor = "default";
    });
});