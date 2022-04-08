import Resizer from "react-image-file-resizer";
import mergeImagesV2 from 'merge-images-v2'


export async function IdentificaDimensoesImagem(imagem) {
    const promise = new Promise((resolve) => {
        var reader = new FileReader();
        //le o conteudo da imagem file
        reader.onload = function (e) {

            //cria o obj Imgaem.
            var image = new Image();

            //ao carregar a imagem, pega altura  e largura
            image.onload = function () {
                var height = this.height;
                var width = this.width;
                resolve({ width, height })
            };
            //conf para base64 string retorno do FIleReader como origem
            image.src = e.target.result;
            image.onerror = function (e) { console.log("Image failed!" + e); };
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

export async function AlteraFiltro(imagemMergeOriginal, valorFiltro) {
    async function Filtro(imgObj) {
        console.log(imgObj[0].src)
        var canvas = document.createElement('canvas');
        var canvasContext =  canvas.getContext('2d');
        var imgW = await imgObj[0].width;
        var imgH = await imgObj[0].height;
        canvas.width = imgW;
        canvas.height = imgH;
        canvasContext.filter = await valorFiltro;
        canvasContext.drawImage(await imgObj[0], 0, 0, await imgObj[0].width, await imgObj[0].height)
        return canvas.toDataURL()
    }
    var imgObj = document.getElementsByClassName('imagemFinal');
    imgObj[0].src = await imagemMergeOriginal

    return new Promise((resolve) =>
        resolve(Filtro(imgObj))
    )
}

