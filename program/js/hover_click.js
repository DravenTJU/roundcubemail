// Used to store hover start time and number of clicks
let hoverStartTime = {};
let clickCounts = {};
let userIP = '';

// Get user IP address
function getUserIP() {
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            userIP = data.ip;
            console.log(`The user's IP address is: ${userIP}`);
        })
        .catch(error => {
            console.error('The user"s IP address is', error);
        });
}

// Initialising link events
function initLinkEvents() {
    // Query all <a> tags on the page
    const links = document.querySelectorAll('a');

    // Iterate over each link and bind events
    links.forEach((link, index) => {
        const linkId = `link${index}`; 
        const linkurl = link.href;
        hoverStartTime[linkurl] = 0;
        clickCounts[linkurl] = 0;

        // Listen to mouse hover
        link.addEventListener('mouseover', () => {
            hoverStartTime[linkurl] = new Date().getTime(); // Record hover start time
        });

        // Listen for mouseover
        link.addEventListener('mouseout', () => {
            if (hoverStartTime[linkurl] > 0) {
                const hoverEndTime = new Date().getTime();
                const hoverDuration = (hoverEndTime - hoverStartTime[linkurl]) / 1000; // Hover duration in seconds
                console.log(`link ${linkurl} hovertime: ${hoverDuration} s`);
                sendDataToServer(linkurl, "hover", hoverDuration); // Send data to the server
                hoverStartTime[linkurl] = 0; // Reset start time
            }
        });

        // Listening to click events
        link.addEventListener('click', () => {
            clickCounts[linkurl]++;
            console.log(`link ${linkurl} click_counts: ${clickCounts[linkurl]}`);
            sendDataToServer(linkurl, "click", clickCounts[linkurl]); // Send click data to the server
        });
    });
}

// Functions to send data to the server
function sendDataToServer(linkurl, eventType, data) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://roundcube.draven.best/program/api/receive_data.php", true); 
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("send successful");
        }
    };

    // Constructing the sent data
    const payload = {
        linkurl: linkurl,
        eventType: eventType,
        data: data,
        ip: userIP, // add user ip
        timestamp: new Date().toISOString()
    };

    xhr.send(JSON.stringify(payload));
}

document.addEventListener('DOMContentLoaded', function () {
    getUserIP(); 
    initLinkEvents();
});
