
//api Endpoint CHANGE!
const api = "http://localhost:5124"


let story;
let currentElement;

let elementIdCounter = 0;
let selectionIDCounter = [];


document.addEventListener("DOMContentLoaded", () => {
    loadHome();
});


async function loadData() {
    try {
        const response = await fetch(api + "/storyList");
        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        let html = '<div class="storyList">';

        data.info.forEach(element => {
            html += 
            `
            <button onclick="loadStory(${element.id})" class="story">
                <span>Title: ${element.title}     Author: ${element.author}</span><br>
                Desctiption: ${element.description}
            </button>
            `
        });

        html += "</div>";
        document.getElementById("content").innerHTML = html;

    } catch (error) {
         document.getElementById("content").innerHTML =
                    '<div class="error">Error: ' + error.message + "</div>";
    }
}


function loadHome() {
    let html = 
    `
    <div class="home">
    <p>Storyforge is a dynamic Story Engine developed by Erik Matschke wich allows you to create dynamic storys. The unser can choose the paph.</p>
    </div>
    `

    document.getElementById("content").innerHTML = html;
}


async function loadStory(id){
     try {
        const response = await fetch(api + `/story/${id}`);
        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const element = await response.json();
        story = element;

        let html =  
            `
            <button onclick="updateStory(null)" class="story">
                <h2>${element.title}</h2>
                <p>${element.description}</p>
                <p>Author: ${element.author}</p>
                <p>Genre: ${genre(element.genre)}</p>
                <p>Length: ${element.nodes}</p>
            </button>
            `
        document.getElementById("content").innerHTML = html;

    } catch (error) {
         document.getElementById("content").innerHTML =
                    '<div class="error">Error: ' + error.message + "</div>";
    }
}

function genre(key){
    let enumVal = 
    [
    "Horror",
    "Fantasy",
    "SciFi",
    "Mystery",
    "Romance",
    "Thriller",
    "Adventure",
    "Drama",
    "Comedy",
    "Historical"
    ]
    return enumVal[key]
}

function updateStory(next){

    if(next == null) next = "start";
    
    try {
        console.log(story)
        currentElement = story.storyElements[next]
        let options = "";
        currentElement.options.forEach(element => {
            options += 
            `
                <button class="option" onclick="updateStory('${element.storryLink}')"><p>${element.displayText}</p></button>
            `
        });

        let html = 
        `
        <div class="storyElement">
            <h2>${currentElement.content}</h2>
            ${options}
        </div>
        `;
        document.getElementById("content").innerHTML = html;

        
    } catch (error) {
         document.getElementById("content").innerHTML =
                    '<div class="error">Error: ' + error.message + "</div>";
    }
}

function createStory(){
    counter = 0;
    html = 
    `
    <h2>Create Your Story</h2>
        <h3>storyname</h3><input type="text" name="storyname" id="storyname" placeholder="myStory">
        <h3>describtion</h3><input type="text" name="describtion" id="describtion" placeholder="This is my story">
        <h3>author</h3><input type="text" name="author" id="author" placeholder="Max Mustermann">
        <h3>gnere</h3><select name="genre" id="genre">
            <option value="0">Horror</option>
            <option value="1">Fantasy</option>
            <option value="2">SciFi</option>
            <option value="3">Mystery</option>
            <option value="4">Romance</option>
            <option value="5">Thriller</option>
            <option value="6">Adventure</option>
            <option value="7">Drama</option>
            <option value="8">Comedy</option>
            <option value="9">Historical</option>
        </select>
        <div class="storyWrapper" id="storyWrapper">
            
            <div class="storyButtonWropper">
                <button class="storyButton" onclick="addStoryelement()">add storyelement</button>
                <button class="storyButton" onclick="calcelStory()">cancel</button>
                <button class="storyButton" onclick="submitStory()">submit</button>
            </div>
        </div>
    `
    document.getElementById("content").innerHTML = html;
}

function addStoryelement(){
    selectionIDCounter[elementIdCounter] = 0;
    html = 
    `
        <div class="storyElement" id="${elementIdCounter}">

                <label for="story">Content:</label>
                <input type="text" class="story-content" placeholder="Enter content">
                <div class="selection">
                    
                </div>

                <div class="storyActions">
                    <button type="button" onclick="addSelectionElement(${elementIdCounter})" class="add-selection">Add selection</button>
                    <button type="button" onclick="moveUp(${elementIdCounter})" class="move-up">Up</button>
                    <button type="button" onclick="moveDown(${elementIdCounter})" class="move-down">Down</button>
                    <button type="button" onclick="deleteStoryelement(${elementIdCounter})" class="delete">Delete</button>
                </div>

            </div>
    `
    elementIdCounter++;
    document.getElementById("storyWrapper").innerHTML += html;
}


function addSelectionElement(elementIdCounter){
    let selectionId = selectionIDCounter[elementIdCounter];
    html = 
    `
        <div class="selectionElement" id="${elementIdCounter}/${selectionId}">

            <input type="text" class="display-text" placeholder="Choice text">
            <input type="text" class="next-element" placeholder="Next node ID">
            <button type="button" onclick="removeSelection()" class="remove-selection">Remove</button>

        </div>
    `
    selectionIDCounter[elementIdCounter]++;
    document.getElementById(elementIdCounter).innerHTML += html;
}

function submitStory(){

}

function calcelStory(){

}

function moveUp(){

}
function moveDown(){

}
function deleteStoryelement(){
    
}




