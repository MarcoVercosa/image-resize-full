import Resizer from "react-image-file-resizer";
import mergeImagesV2 from 'merge-images-v2'


export async function IdentificaDimensoesImagem(imagem) {
    //console.log(imagem.target.files[0])
    const promise = new Promise((resolve) => {
        var reader = new FileReader();
        //Read the contents of Image File.
        reader.onload = function (e) {

            //Initiate the JavaScript Image object.
            var image = new Image();
            //Validate the File Height and Width.
            image.onload = function () {
                var height = this.height;
                var width = this.width;
                resolve({ width, height })
            };
            //Set the Base64 string return from FileReader as source.
            image.src = e.target.result;
            image.onerror = function (e) { console.log("Image failed!"); };
        };
        reader.readAsDataURL(imagem);
    })
    return promise
}
export function MergeImagens(imagemMergeFinal, ImagemFrameRecebida) {

    return new Promise((resolve) => {
        mergeImagesV2([imagemMergeFinal, ImagemFrameRecebida])
            .then(b64 => resolve(b64))
    })
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

