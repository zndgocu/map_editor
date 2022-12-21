let upload = undefined;
let ok = undefined;
let result = undefined;
window.onload = function () {
    upload = document.querySelector('#upload-path');
    upload.addEventListener('change', self.GetImageFile);

    ok = document.querySelector('#ok');
    ok.addEventListener('click', self.StateOk);
}


const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};

function StateOk() {
    var imagePath = $('#upload-path').val();
    var imageSize = $('#upload-size').val();
    var imageSegment = $('upload-segment').val();

    console.log(String(imagePath) + String(imageSize) + String(imageSegment));
}

async function GetImageFile(event) {
    const file = event.target.files[0];
    const base64 = await convertBase64(file);
    self.result = base64;
}
