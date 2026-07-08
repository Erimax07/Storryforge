
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
                <p>Genre: ${convertGenre(element.genre)}</p>
                <p>Length: ${element.nodes}</p>
            </button>
            `
        document.getElementById("content").innerHTML = html;

    } catch (error) {
         document.getElementById("content").innerHTML =
                    '<div class="error">Error: ' + error.message + "</div>";
    }
}

function convertGenre(key){
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
    <form>
    <h2>Create Your Story</h2>
        <h3>storyname</h3><input type="text" name="storyname" id="storyname" placeholder="myStory" required>
        <h3>describtion</h3><input type="text" name="describtion" id="describtion" placeholder="This is my story" required>
        <h3>author</h3><input type="text" name="author" id="author" placeholder="Max Mustermann" required>
        <h3>gnere</h3><select name="genre" id="genre" required>
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
        </div>
        <div class="storyButtonWropper">
            <button class="storyButton" onclick="addStoryelement()">add storyelement</button>
            <button class="storyButton" onclick="calcelStory()">cancel</button>
            <button type="submit" class="storyButton" onclick="submitStory()">submit</button>
        </div>
        </form>
    `
    document.getElementById("content").innerHTML = html;
}

function addStoryelement(){
    selectionIDCounter[elementIdCounter] = 0;
    html = 
    `
        <div class="storyElement" id="${elementIdCounter}">

                <label for="story">Name:</label>
                <input type="text" class="story-name" placeholder="Enter name" required>
                <label for="story">Content:</label>
                <input type="text" class="story-content" placeholder="Enter content" required>
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
    document.getElementById("storyWrapper").insertAdjacentHTML("beforeend", html);
}


function addSelectionElement(elementIdCounter){
    let selectionId = selectionIDCounter[elementIdCounter];
    html = 
    `
        <div class="selectionElement" id="${elementIdCounter}/${selectionId}">
            <input type="text" class="display-text" placeholder="Choice text" required>
            <input type="text" class="next-element" placeholder="Next node ID" required>
            <button type="button" onclick="removeSelection('${elementIdCounter}/${selectionId}')" class="remove-selection">Remove</button>
        </div>
    `
    selectionIDCounter[elementIdCounter]++;
    document.getElementById(elementIdCounter).querySelector(".selection").insertAdjacentHTML("beforeend", html);
}

async function submitStory(){
    try {
        const id = await fetch(api + '/getFreeId');
        
    } catch (error) {
        return
    }
    const title = document.getElementById("storyname").value;
    const describtion = document.getElementById("describtion").value;
    const author = document.getElementById("author").value;
    const creation = new Date().toISOString();
    const genre = convertGenre(document.getElementById('genre').value);
    let storyElements = {};
    document.querySelectorAll(".storyElement").forEach((element)=>{
        let options = []
        element.querySelectorAll(".selectionElement").forEach((selection)=>{
            const op = {
                displayText: selection.querySelector(".display-text").value,
                storryLink: selection.querySelector(".next-element").value
            }
            options.push(op);
        })
        const key = element.querySelector(".story-name").value;
        const el = {
            content: element.querySelector(".story-content").value,
            options: options
            }
        
        storyElements[key] = el;
    })
    
    const story = {
        id: id,
        title: title,
        describtion: describtion,
        author: author,
        creation: creation,
        genre, genre,
        storyElements: storyElements
    }

    const json = JSON.stringify(story);
    console.log(json);
    postMessage(json, api + "/submitStory")

}

function calcelStory(){
    loadHome();
    elementIdCounter = 0;
    selectionIDCounter = [];
}
function moveUp(id) {
    // const elements = document.querySelectorAll(".storyElement");

    // elements.forEach((element, index) => {
    //     if (element.id === id && index > 0) {
    //         const previous = elements[index - 1];
    //         element.parentNode.insertBefore(element, previous);
    //     }
    // });
}
function moveDown(id){
    
}
function deleteStoryelement(id){
    document.getElementById(id).outerHTML = '';
}


function removeSelection(id){
    document.getElementById(id).outerHTML = '';
}



