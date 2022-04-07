import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import { Header, ImagensFrame, AdicionarEnviarBotoes, EdicaoImagem } from "./style"

const Input = styled('input')({
    display: 'none',
});

interface IModalInstragramFrame {
    open: boolean;
    OpenClose: () => void;
    FrameSelecionado: (imagem: string) => void
    temaRedeSocial: string
}


function ModalInstragramFrame({ open, OpenClose, FrameSelecionado, temaRedeSocial }: IModalInstragramFrame) {

    const [imagemFrameSelecionado, setImagemFrameSelecionado] = useState<any>("")

    function SelecionaFrame(imagem: any) {
        setImagemFrameSelecionado(imagem.target.files[0])
    }

    function EnviaFrameParaEdicao() {
        FrameSelecionado(imagemFrameSelecionado)
        OpenClose()
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
                    position: "absolute" as "absolute",
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

                <Header temaRedeSocial={temaRedeSocial}>
                    <div>
                        <h1>Selecione o Frame</h1>
                        <p onClick={() => OpenClose()}>X</p>
                    </div>
                </Header>


                {imagemFrameSelecionado &&
                    <ImagensFrame>
                        <div>
                            <img src={URL.createObjectURL(imagemFrameSelecionado)}></img>
                        </div>

                    </ImagensFrame>
                }

                <AdicionarEnviarBotoes>
                    <div>
                        <label htmlFor="contained-button-files">
                            <Input accept="image/*" id="contained-button-files" multiple={false} type="file"
                                onChange={(event) => SelecionaFrame(event)}
                            />
                            <Button variant="contained" component="span"
                                style={{ backgroundColor: temaRedeSocial }}
                            >
                                Adicionar Frame
                            </Button>
                        </label>
                        <Button variant="contained" component="span"
                            style={{ backgroundColor: temaRedeSocial }}
                            onClick={() => EnviaFrameParaEdicao()}
                            disabled={!imagemFrameSelecionado}
                        >
                            Enviar foto
                        </Button>
                    </div>
                </AdicionarEnviarBotoes>

            </div>
        </Modal >

    );
}

export { ModalInstragramFrame }