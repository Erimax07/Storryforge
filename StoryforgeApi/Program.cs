using System.Text.Json;
using System.Text.Json.Serialization;
using System;

var builder = WebApplication.CreateBuilder(args);

var options = new JsonSerializerOptions
{
    Converters = { new JsonStringEnumConverter() }
};

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// app.UseHttpsRedirection();



//creating the stories
string storysPath = "../Data/Storys";
Dictionary<string, Story> storys = new Dictionary<string, Story>();
foreach (string file in Directory.GetFiles(storysPath, "*.json"))
{
    Story story = System.Text.Json.JsonSerializer.Deserialize<Story>(System.IO.File.ReadAllText(file), options);
    if(story != null) storys.Add(story.title, story);
}



//for /stroyList
string storyListJsonPath = "../Data/storylist.json";
calculateStorylist();
string storyListString = File.ReadAllText(storyListJsonPath);
StoryInfoList storyList = System.Text.Json.JsonSerializer.Deserialize<StoryInfoList>(storyListString, options);



app.MapGet("/storyList", () =>
{
    return storyListString;
})
.WithName("storyList");

app.MapGet("/getStory", () =>
{
    return storyListString;
})
.WithName("storyList");

app.MapGet("/storyList", () =>
{
    return storyListString;
})
.WithName("storyList");

app.Run();


void calculateStorylist()
{
    StoryInfoList content = new StoryInfoList();
    foreach (StoryInfo storyInfo in storys.Values)
    {
        content.info.Add(storyInfo);
    }
    string json = System.Text.Json.JsonSerializer.Serialize<StoryInfoList>(content);
    File.WriteAllText(storyListJsonPath, json);
}


public enum Genre
{
    Horror,
    Fantasy,
    SciFi,
    Mystery,
    Romance,
    Thriller,
    Adventure,
    Drama,
    Comedy,
    Historical
}
public class StoryInfo
{
    public string title { get; set; } = "";
    public string description { get; set; } = "";
    public DateTime creation { get; set; } = new();
    public string author { get; set; } = "";
    public Genre genre { get; set; } = new();
    public int nodes { get; set; } = new();

    public StoryInfo() { }

    public StoryInfo(string title, string description, DateTime creation, string author, Genre genre, int nodes)
    {
        this.title = title;
        this.description = description;
        this.creation = creation;
        this.author = author;
        this.genre = genre;
        this.nodes = nodes;
    }
}

class StoryInfoList
{
    public List<StoryInfo> info {get; set; } = new();
    public StoryInfoList(){}
}

class Story:StoryInfo
{
    public Dictionary<string, StoryNode> storyElements { get; set; } = new();
    public List<string> state { get; set; } = new();

    public Story()
    {
        storyElements = new Dictionary<string, StoryNode>();
        state = new List<string>();
    }
    public StoryNode getStoryElement(string key)
    {
        if(storyElements.TryGetValue(key, out StoryNode node))
        {
            return node;
        }
        return null;
    }
    public void addStoryElement(string key, StoryNode toAdd)
    {
        storyElements.Add(key, toAdd);
    }
    public bool containsState(string value)
    {
        return state.Contains(value);
    }
    public void addState(string value)
    {
        state.Add(value);
    }
    public void removeState(string value)
    {
        if (state.Contains(value))
        {
            state.Remove(value);
        }
    }


}
class StoryNode
{
    public string content { get; set; }
    public Selection[] options { get; set; }
    public StoryNode() { }
    public StoryNode(string _content, Selection[] _options)
    {
        content = _content;
        options = _options;
    }
 
}
class Selection
{
    public string displayText { get; set; }
    public string storryLink { get; set; }
    public string stateAdd { get; set; } = string.Empty;
    public string requiredState { get; set; } = string.Empty;
    public Selection() { }
    public Selection(string _displayText, string _storryLink)
    {
        displayText = _displayText;
        storryLink = _storryLink;
    }
    public Selection(string _displayText, string _storryLink, string _stateChange)
    {
        displayText = _displayText;
        storryLink = _storryLink;
        stateAdd = _stateChange;
    }
    public Selection(string _displayText, string _storryLink, string _stateChange, string _requiredState)
    {
        displayText = _displayText;
        storryLink = _storryLink;
        stateAdd = _stateChange;
        requiredState = _requiredState;
    }
}


