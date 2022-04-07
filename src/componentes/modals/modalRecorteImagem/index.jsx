import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import Slider from '@mui/material/Slider';
import { Header, ImagensFrame, AdicionarEnviarBotoes, EdicaoImagem } from "./style"
import Cropper from 'react-easy-crop'
import mergeImagesV2 from 'merge-images-v2'

import RecortarImagem from './recorteImagem'

const Input = styled('input')({
    display: 'none',
});

function ModalRecorteImagem({ open, OpenClose, imagemParaRecorte, SalvarImagemRecortada, temaRedeSocial }) {

    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [rotation, setRotation] = useState(0)

    const [croppedAreaPixels, setCroppedAreaPixels] = useState()

    let ImagemASerRecortada = imagemParaRecorte

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }

    async function Finalizar() {
        try {
            const croppedImage = await RecortarImagem(
                ImagemASerRecortada,
                croppedAreaPixels,
                rotation
            )
            SalvarImagemRecortada(croppedImage)
            OpenClose()
        } catch (e) {
            console.error(e)
        }
    }
    return (
        <Modal
            open={open}
            onClose={OpenClose}
            aria-OpenClose="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: 'translate(-50%, -50%)',
                    width: '90vw',
                    height: "90vh",
                    backgroundColor: "white",
                    border: '2px solid #000',
                    boxShadow: "24",
                    borderRadius: 7,
                    overflowX: "scroll"
                }}
            >
                <div>
                    {imagemParaRecorte &&
                        <Cropper
                            image={ImagemASerRecortada}
                            crop={crop}
                            zoom={zoom}
                            aspect={2 / 2}
                            rotation={rotation}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    }
                </div>
                <div style={{ width: "200px", marginLeft: "50px" }}>
                    <p style={{ fontSize: "25px" }}>Rotação</p>
                    <Slider
                        value={typeof rotation === 'number' ? rotation : 0}
                        onChange={(_, novoValor) => setRotation(novoValor)}
                        aria-labelledby="input-slider"
                        min={0}
                        max={360}
                    />
                </div>
                <AdicionarEnviarBotoes>
                    <div>
                        <Button variant="contained" component="span"
                            style={{ backgroundColor: temaRedeSocial }}
                            onClick={Finalizar}
                        >
                            Recortar
                        </Button>

                        <Button variant="contained" component="span"
                            style={{ backgroundColor: temaRedeSocial, color: "white" }}
                            onClick={OpenClose}
                        >
                            Cancelar
                        </Button>
                    </div>
                </AdicionarEnviarBotoes>
            </div>
        </Modal >
    );
}
export { ModalRecorteImagem }