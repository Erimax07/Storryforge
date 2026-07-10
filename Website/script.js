
//api Endpoint CHANGE!
const api = "http://localhost:5124"

// variables
let story;
let currentElement;

let elementIdCounter = 0;
let selectionIDCounter = [];


// document.addEventListener("submit", function (event) {
//     if (event.target.id === "storyForm") {
//         event.preventDefault();
//         submitStory(event);
//     }
// });

document.addEventListener("DOMContentLoaded", loadHome);



async function loadData() {
    try {
        const response = await fetch(api + "/storyList");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        let html = '<div class="storyList">';

        data.info.forEach(element => {
            html +=
                `
            <button onclick="loadStory(${element.id})" class="story">
                <h3>Title: ${element.title}</h3><br>
                Author: ${element.author}<br>
                Desctiption: ${element.description}<br>
                Length: ${element.nodes}
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
            <h2>Welcone to Storyforge</h2>
            <p>Storyforge is a dynamic Story Engine developed by Erik Matschke wich allows you to create and play dynamic storys. The main idea is to give a simmilar feel to old Storytelling games like Monkey Island but with only text-elements. To accieve that the user is presented with a explanaition and different options what to do next. The user can then choose one of these options and is presented by the next part of the story taking into acount his decition.</p>
            <hr>
            <h2>How to play</h2>
            <p>You want to try out the storys click on the sotries tab on the top and choose one story.</p>
            <hr>
            <h2>How to create a story</h2>
            <p>Id you want to create your own story you can clixk on the createstroy button on the top. <b>IMPORTANT: your story is stores on my server and can be seen by anybody opening this wepsite. If you dont want that you canot create a story here!</b><br>The storys are made out of nodes wich each have a name wich is only for routing purpuses, a content this is what the user sees as the story and it has one or more options where the user can select the next node. For the story to work you need a start node wich is named 'start'. also each storylink needs to point to a different node.</p>
            <hr>
            <h2>Feedback</h2>
            <p>If you encounter any bugs, have questions or feature requesets you can sent me a email <a class="email" href="mailto:gawerimax@gmail.com">gawerimax@gmail.com</a>. your feedfack is highly anticipated</p>
        </div>
    `

    document.getElementById("content").innerHTML = html;
}


async function loadStory(id) {
    try {
        const response = await fetch(api + `/story/${id}`);
        if (!response.ok) {
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


function updateStory(next) {

    if (next == null) next = "start";

    try {
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

function createStory() {
    counter = 0;
    if(loadStory()){
        document.querySelectorAll("storyElement").forEach((el)=>{
            if(el.id > counter) counter = el.id;
        })
        return
    }

    html =
        `
    <form id="storyForm">
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
            <button type="button" class="storyButton" onclick="addStoryelement()">add storyelement</button>
            <button type="button" class="storyButton" onclick="calcelStory()">cancel</button>
            <button type="button" class="storyButton" onclick="saveStory()">saveStory</button>
            <button type="button" class="storyButton" onclick="loadStory()">loadStory</button>
            <button type="button" class="storyButton" onclick="clearLocalStorage()">clearStory</button>
            <button type="submit" class="storyButton">submit</button>
        </div>
        </form>
    `
    document.getElementById("content").innerHTML = html;

    addStoryelement();
    document.querySelector(".story-name").value = "start";

    const form = document.getElementById("storyForm");
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        submitStory(event).catch(err => {
            console.error("submitStory failed:", err);
            document.getElementById("content").insertAdjacentHTML(
                "beforeend",
                `<div class="error">Error: ${err.message}</div>`
            );
        });
    });


}

function addStoryelement() {
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
    saveStory();
}


function addSelectionElement(elementIdCounter) {
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




async function submitStory(event) {


    const form = event.target;

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const idResponse = await fetch(api + "/getFreeId");
    const id = await idResponse.json();
    const title = document.getElementById("storyname").value;
    const describtion = document.getElementById("describtion").value;
    const author = document.getElementById("author").value;
    const creation = new Date().toISOString();
    const genre = convertGenre(document.getElementById('genre').value);
    let storyElements = {};

    document.querySelectorAll(".storyElement").forEach((element) => {
        let options = []

        element.querySelectorAll(".selectionElement").forEach((selection) => {

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
        description: describtion,
        author: author,
        creation: creation,
        genre: genre,
        storyElements: storyElements
    }

    const json = JSON.stringify(story);
    
    const storyStatusResponse = await fetch(api + "/validateStory", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: json
    });

    

    if (!storyStatusResponse.ok) {
        document.getElementById("content").innerHTML = "We had a Problem - story not added to server";
        return
    }

    const storyStatus = await storyStatusResponse.text()
    console.log(storyStatus);

    if(storyStatus != "Story OK"){
        return
    }

    const response = await fetch(api + "/submitStory", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: json
    });

    if (!response.ok) {
        document.getElementById("content").innerHTML = "We had a Problem - story not added to server";
        return
    }

    const result = await response.json();
    if (result == -1) {
        document.getElementById("content").innerHTML = "Data Invalid - story not added to server";
        return
    }
    else if(result == -2){
        document.getElementById("content").innerHTML = "Story Invalid - story not added to server";
        return
    }
    else {
        localStorage.removeItem("story");
        loadStory(id);
        return
    }
}



function calcelStory() {
    loadHome();
    elementIdCounter = 0;
    selectionIDCounter = [];
}


function moveUp(id) {

}
function moveDown(id) {

}
function deleteStoryelement(id) {
    document.getElementById(id).outerHTML = '';
}


function removeSelection(id) {
    document.getElementById(id).outerHTML = '';
}

function convertGenre(key) {
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

function saveStory(){
    const html = document.getElementById("content").innerHTML
    localStorage.setItem("story", html)
}

function loadStory(){
    const html = localStorage.getItem("story");
    if(html == null) return false
    document.getElementById("content").innerHTML = html;
    document.querySelector(".story-name").value = "start";
    return true
}

function clearLocalStorage(){
    localStorage.clear();
}







