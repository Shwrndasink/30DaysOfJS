const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo(){
    navigator.mediaDevices.getUserMedia({ video: true, audio: false})
        .then(localMediaStream => {
            console.log(localMediaStream);
            video.src = window.URL.createObjectURL(localMediaStream);
            video.play();
        })
        .catch(err => {
            console.error('Oh no!!!', err);
        });
}

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    console.log(width, height);
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        //take pixels out
        let pixels = ctx.getImageData(0, 0, width, height);
        // mess with them
        pixels = greenScreen(pixels);
        ctx.globalAlpha = 0.2;
        // put pixels back
        ctx.putImageData(pixels, 0, 0);
    }, 16);
}

function redEffect(pixels) {
    for(let i = 0; i < pixels.data.length; i+=4){
        pixels.data[i + 0] = pixels.data[i + 0] + 100; //red
        //pixels.data[i + 1] = pixels.data[i + 1] -50; //green
        //pixels.data[i + 2] = pixels.data[i + 2] * 20; //blue
    }
    return pixels;
}
function rgbSplit(pixels) {
    for(let i = 0; i < pixels.data.length; i+=4){
        pixels.data[i -150] = pixels.data[i + 0]; //red
        pixels.data[i + 100] = pixels.data[i + 1]; //green
        pixels.data[i -150] = pixels.data[i + 2]; //blue
    }
    return pixels;
}

function greenScreen(pixels) {
    const levels = {};

    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.value;
    });

    for(i = 0; i < pixels.data.length; i+=4){
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];
    }
    if(red >= levels.rmin
    && green >= levels.gmin
    && blue >= levels.bmin
    && red <= levels.rmax
    && green <= levels.gmax
    && blue <= levels.bmax) {
        pixels.data[i + 3] = 0;
    }
    return pixels;
}

function takePhoto() {
    //Play sound
    snap.currentTime = 0;
    snap.play();

    //Take data out of canvas
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="Myalt-text" />`;
    strip.insertBefore(link, strip.firstChild);
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
