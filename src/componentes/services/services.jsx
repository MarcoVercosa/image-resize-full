import Resizer from "react-image-file-resizer";
import mergeImagesV2 from 'merge-images-v2'


export async function IdentificaDimensoesImagem(imagem) {
    console.log(imagem)
    // let resultado = await ImagemParaBlob(imagem)
    // let resultadobase64 = await blobToBase64(resultado)



    var reader = new FileReader();
    //Read the contents of Image File.
    reader.onload = function (e) {
        console.log(e.target.result)
        //Initiate the JavaScript Image object.
        var image = new Image();
        //Validate the File Height and Width.
        image.onload = function () {
            var height = this.height;
            var width = this.width;
            console.log(height, width)
            if (height > 100 || width > 100) {
                alert("Height and Width must not exceed 100px.");
                return false;
            }
            alert("Uploaded image has valid Height and Width.");
            return true;
        };
        //Set the Base64 string return from FileReader as source.
        image.src = e.target.result;
        image.onerror = function (e) { console.log("Image failed!"); };
    };
    reader.readAsDataURL(imagem.target.files[0]);


}

export async function BlobParaBase64(imagemBlob) { // imagem blob
    return await blobToBase64(imagemBlob);
}

const blobToBase64 = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});


export async function ImagemParaBlob(imagem) {
    const base64 = await fetch(imagem);
    const imagemMergeOriginalBlob = await base64.blob();
    return imagemMergeOriginalBlob
}


export const ImagemFileParaBase64 = (width, height, file) =>
    new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            width,
            height,
            "PNG",
            100,
            0,
            (uri) => {
                resolve(uri)
            },
            "base64",
        );
    });


export const AlterarDimensaoImagem = (width, height, imagem) =>
    new Promise((resolve) => {
        mergeImagesV2([{ src: imagem, width, height }])
            .then(b64 => resolve(b64));
    })

export const MoverImagensEOpacidade = (imagemFundo, imagemFrame, dados) =>
    new Promise((resolve) => {
        mergeImagesV2([
            { src: imagemFundo, x: dados.XImagem, y: dados.YImagem, opacity: dados.opacityImagem },
            { src: imagemFrame, x: dados.XFrame, y: dados.YFrame, opacity: dados.opacityFrame },
        ]).then(b64 => {
            resolve(b64)
        })
    })

