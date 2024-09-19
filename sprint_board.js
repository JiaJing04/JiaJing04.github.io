
 var modal = document.getElementById("sprintModal");

 var btn = document.getElementById("openFormBtn");
 
 var span = document.getElementsByClassName("close")[0];
 
 var container = document.querySelector('.container');
 
 // When the user clicks the button, open the modal and apply the blur effect to the container
 btn.onclick = function() {
    console.log('hihihi')
     modal.style.display = "block";
     container.classList.add("modal-active"); // Blur the container
 }
 
 span.onclick = function() {
     modal.style.display = "none";
     container.classList.remove("modal-active"); // Unblur the container
 }
 
 window.onclick = function(event) 
 {
     if (event.target == modal) {
         modal.style.display = "none";
         container.classList.remove("modal-active"); // Unblur the container
     }
 }

// A function to create the title bar
function createTitleBar(){
    let title_bar = document.createElement('div');
    title_bar.className = 'title-box'

    let sprintContent = document.createElement('div');
    sprintContent.className = 'sprint-content';
 
    let sprintName = document.createElement('span');
    sprintName.className = 'sprint-name';
    sprintName.textContent = "Sprint Name";

    let startTime = document.createElement('span');
    startTime.className = 'normal-info';
    startTime.textContent = "Start Time";

    let endTime = document.createElement('span');
    endTime.className = 'normal-info';
    endTime.textContent = "End Time"

    let status = document.createElement('span');
    status.className = 'normal-info';
    status.textContent = "Status"

    // Ensure the correct indetation in the title bar
    let forcedStart = document.createElement('div');
    forcedStart.className = 'title-sprint-button';

    sprintContent.appendChild(sprintName);
    sprintContent.appendChild(startTime);
    sprintContent.appendChild(endTime);
    sprintContent.appendChild(status);
    sprintContent.appendChild(forcedStart)

    title_bar.appendChild(sprintContent);
    return title_bar
} 

let currentSprintsStatus = []

// Function to create sprint boxes dynamically
function createSprintCard(sprint, key) {

    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');;
    let day = String(today.getDate()).padStart(2, '0');
    let completeDay = `${year}-${month}-${day}`
 
    // Create sprint box container
    let sprintBox = document.createElement('div');
    sprintBox.className = 'sprint-box';
 
    // Create sprint content container
    let sprintContent = document.createElement('div');
    sprintContent.className = 'sprint-content';
 
    // Sprint name
    let sprintName = document.createElement('span');
    sprintName.className = 'sprint-name';
    sprintName.textContent = sprint.name

    //sprint start time
    let startTime = document.createElement('span');
    startTime.className = 'normal-info';
    startTime.textContent = sprint.start

    //sprint 
    let endTime = document.createElement('span');
    endTime.className = 'normal-info';
    endTime.textContent = sprint.end

    let status = document.createElement('span');
    status.className = 'normal-info';
    if (new Date(sprint.start) > new Date(completeDay)){
        status.textContent = "Not Started"
    }
    else if (new Date(completeDay) > new Date(sprint.end)){
        status.textContent = "Completed"
    }
    else{
        status.textContent = "Active"
    }

    // The case of forced start
    if (sprint.status == "Active" && status.textContent != "Completed"){
        status.textContent = "Active"
    }

    sprintDB.child(key).update({
        status: status.textContent
    });

    // Create the main container for the force start button
    const forceStartButton = document.createElement('div');
    forceStartButton.classList.add('sprint-button')

    const button = document.createElement('button');
    button.textContent = 'Force Start'
    button.classList.add('inner-button');

    forceStartButton.appendChild(button);
    
    forceStartButton.addEventListener('click', (e) =>
    {
        e.stopPropagation(); // Prevent the sprint box click from triggering
        
        // The sprint can only be forced start if there is no 'Active' sprint.
        if (! currentSprintsStatus.includes('Active')){

            sprintDB.child(key).update({
                start: completeDay,
                status: "Active"
            }); 

        }        
    });
    
    sprintContent.appendChild(sprintName);
    sprintContent.appendChild(startTime);
    sprintContent.appendChild(endTime);
    sprintContent.appendChild(status);
    sprintContent.appendChild(forceStartButton)

    sprintBox.appendChild(sprintContent);
    
    sprintBox.addEventListener('click', (e) => {
        
        // Store the selected sprint key
        localStorage.setItem("selectedSprint", key);
        if (status.textContent == "Not Started"){
            localStorage.setItem('sprintID', key);
            window.location.replace("pb_sprint_backlog.html");
        }
        else{
            window.location.replace("sprint_backlog.html");
        }
    });
    document.getElementById('backlog').appendChild(sprintBox);
 };

 // Initialise Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCSzTbYhygkAEratuYSLjziC8dAHxm_0kM",
    authDomain: "primetask-3b148.firebaseapp.com",
    databaseURL: "https://primetask-3b148-default-rtdb.firebaseio.com",
    projectId: "primetask-3b148",
    storageBucket: "primetask-3b148.appspot.com",
    messagingSenderId: "914891090322",
    appId: "1:914891090322:web:832ef0efe1205b8f33f94b"
};
firebase.initializeApp(firebaseConfig);

// Reference to Firebase 
let sprintDB = firebase.database().ref("sprints");

// Event listener for form submission to create a new sprint
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent default form submission

    let sprintName = document.getElementById('sprintName').value;
    let startDate = document.getElementById('startDate').value;
    let endDate = document.getElementById('endDate').value;

    // Get today's date in YYYY-MM-DD format
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');  // Add leading zero
    let day = String(today.getDate()).padStart(2, '0');  // Add leading zero
    let completeToday = `${year}-${month}-${day}`;

    // Validate start date is not in the past
    if (new Date(startDate) < new Date(completeToday)) {
        alert("Start date cannot be in the past.");
        return;
    }

    // Validate that the end date is after the start date
    if (new Date(endDate) <= new Date(startDate)) {
        alert("End date cannot be earlier than or equal to the start date.");
        return;
    }

    // Check for overlapping sprints
    sprintDB.once("value", function(snapshot) {
        let sprints = snapshot.val();
        let overlapExists = false;

        // Loop through all sprints to check for overlap with the new sprint
        for (let key in sprints) {
            let existingSprint = sprints[key];
            let existingStart = new Date(existingSprint.start);
            let existingEnd = new Date(existingSprint.end);

            let newStart = new Date(startDate);
            let newEnd = new Date(endDate);

            // Check if the new sprint overlaps with any existing sprint
            if ((newStart <= existingEnd) && (newEnd >= existingStart)) {
                overlapExists = true;
                break;
            }
        }

        if (overlapExists) {
            alert("There is already a sprint active during this time period. Please choose a different time.");
            return;
        }

        // If no overlap exists, proceed to create a new sprint
        let newSprint = {
            name: sprintName,
            start: startDate,
            end: endDate,
            status: 'Not Started'  
        };

        // Generate a new key for the sprint and store it in the 'sprints' node
        let newSprintKey = sprintDB.push().key;

        // Save the new sprint under the 'sprints' node with the generated key
        sprintDB.child(newSprintKey).set(newSprint, function(error) {
            if (error) {
                console.error('Error saving new sprint:', error);
            } else {
                alert("Sprint created successfully!");
                window.location.href = "sprint_board.html";  
            }
        });
    });
});



// retrieve data from Firebase
sprintDB.on("value", function(snapshot) {
    let sprints = snapshot.val();
    
    // Clear the backlog element
    let backlogElement = document.getElementById('backlog');
    backlogElement.innerHTML = '';

    // Create title bar
    let title_bar = createTitleBar()
    backlogElement.appendChild(title_bar)

    // Collect the current status of all sprints.
    currentSprintsStatus = Object.values(sprints).map(sprint => sprint.status);

    // Get the keys of the sprints
    if (sprints) {
        let keys = Object.keys(sprints);

        // Loop through each sprint and create sprint cards
        keys.forEach((key) => {
            createSprintCard(sprints[key], key);
        });
    }
});

// // add event listener to the sprint box
// document.getElementById('backlog').addEventListener('click', function(event) {
//     event.preventDefault();
//     let sprintName = document.getElementById('sprintName').value.trim();
//     let startDate = document.getElementById('startDate').value.trim();
//     let endDate = document.getElementById('endDate').value.trim();
// 
// });