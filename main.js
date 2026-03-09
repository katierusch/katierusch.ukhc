console.log("i'm running")

// webp browser support detecting script 
function WebpIsSupported(callback){
    // If the browser doesn't has the method createImageBitmap, you can't display webp format
    if(!window.createImageBitmap){
        callback(false);
        return;
    }

    // Base64 representation of a white point image
    var webpdata = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoCAAEAAQAcJaQAA3AA/v3AgAA=';

    // Retrieve the Image in Blob Format
    fetch(webpdata).then(function(response){
        return response.blob();
    }).then(function(blob){
        // If the createImageBitmap method succeeds, return true, otherwise false
        createImageBitmap(blob).then(function(){
            callback(true);
        }, function(){
            callback(false);
        });
    });
}

WebpIsSupported(function(isSupported){
    if(isSupported){
        console.log("Supported");
        var body = document.body;
        body.classList.add("webp");
    }else{
        console.log("Not supported");
        var body = document.body;
        body.classList.add("no-webp");
    }
});

// pause/play button for video

const playPauseBtn = document.querySelector('.playpause');
const player = document.querySelector('video')

playPauseBtn.onclick = function() {
    if(player.paused) {
        player.play();
        playPauseBtn.textContent = 'Pause';
        playPauseBtn.classList.add("pause");
        playPauseBtn.classList.remove("play");
    } else {
        player.pause();
        playPauseBtn.textContent = 'Play';
        playPauseBtn.classList.add("play");
        playPauseBtn.classList.remove("pause");
    }
}


// carousel for patient stories

//grab all patient stories in one list
let allStories = document.querySelectorAll(".patient-story");

//grab all category buttons in one list
let allBtn = document.querySelectorAll(".story-button");

//counter for auto advancing carousel
let counter = 0;

function activeStory(index) {
    for (let i = 0; i < allStories.length; i++) {
        //if the story id matches the category of the button clicked
        if(allStories[i].getAttribute('data-index') == index) {
            //if the specific story is set to hide, show it
            if(allStories[i].classList.contains("d-none")) {
                allStories[i].classList.add("active");
                allStories[i].classList.remove("d-none");
                allStories[i].setAttribute("aria-hidden", "false");
            } 
        } 
        //for all other stories, hide them and remove active
        else {
            allStories[i].classList.add("d-none");
            allStories[i].classList.remove("active");
            allStories[i].setAttribute("aria-hidden", "true");
        }
    }
}

function btnClass (index) {
    for (let i = 0; i < allBtn.length; i++) {
        //if the id matches the button id
        if (allBtn[i].getAttribute('data-index') == index) {
            //if the button does not contain the class "active", add it
           if (allBtn[i].classList.contains("active") == false) {
               allBtn[i].classList.add("active");
               allBtn[i].setAttribute("aria-current", "true");
           }
        } 
        //remove active from all other buttons in the list
        else {
            allBtn[i].classList.remove("active");
            allBtn[i].removeAttribute("aria-current");
            allStories[i].removeAttribute("tabindex");
        }
    }
}

Array.from(allBtn).forEach(function(element,index) {
    let itemIndex = element.getAttribute('data-index');
    element.addEventListener('click', function() {
        counter = itemIndex;
        clearInterval(carouselInterval);
        activeStory(itemIndex);
        btnClass(itemIndex);
    });
  });


let carouselFunction = function () {
    counter++
    if (counter >= allBtn.length) {
        counter = 0;
    } 
    activeStory(counter);
    btnClass(counter);
}
  
let carouselInterval = setInterval(carouselFunction, 6000)

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

var id = getUrlVars()["id"];


if(id) {
    id = id.split('#')[0]
    let firstSlide = document.getElementById(id);
    let firstIndex = firstSlide.getAttribute('data-index');
 
    counter = firstIndex;
    activeStory(firstIndex);
    btnClass(firstIndex);
}

//video swap based on screen size

var video = document.querySelectorAll('video')

function addSourceToVideo(element, src) {
    var source = document.createElement('source');
    source.src= src;
    source.type = 'video/mp4';
    // console.log(src);
    element.appendChild(source);
}

function whichSizeVideo(element, src) {
    var windowWidth = window.innerWidth;
    if (windowWidth > 768) {
        addSourceToVideo(element, src.dataset.desktopVid); 
    } else {
        addSourceToVideo(element, src.dataset.mobileVid);
    }
}

function videoSize() {
    if (video !== undefined) {
        video.forEach(function(element, index) {
            whichSizeVideo( element, element);
        }) 
    }
}

videoSize();
window.addEventListener('resize', videoSize);
