// Task details variables
const taskName = document.getElementById("name-of-task");
const taskDescription = document.getElementById("description-of-task");
const taskType = document.getElementById("type-of-task");
const taskPriority = document.getElementById("priority-of-task");
const taskStoryPoint = document.getElementById("story-point-of-task");
const taskProjectStage = document.getElementById("project-stage-of-task");
const taskTag = document.getElementById("tag-of-task");
const taskAssignees = document.getElementById("assignees-of-task");

// Retrieve the target task card key
const retrievedDetails = localStorage.getItem("taskDetails")

// Initialize Firebase 
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

// Reference the Firebase database
let primeTaskDB = firebase.database().ref('task-details-form/' + retrievedDetails).once('value');

primeTaskDB.then((snapshot) => {
    let value = snapshot.val()
    
    taskName.innerText = value.taskName
    taskDescription.innerText = value.taskDescription
    taskType.innerText = value.taskType
    taskPriority.innerText = value.taskPriority
    taskStoryPoint.innerText = value.taskStoryPoint
    taskProjectStage.innerText = value.taskProjectStage
    taskTag.innerText = value.taskTag
    taskAssignees.innerText = value.assigneeSelected
})





