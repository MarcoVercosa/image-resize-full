import React from 'react';
import { AdicionarEnviarBotoes } from "./style"
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const Input = styled('input')({
    display: 'none',
});

interface IAdicionarEnviar {
    AdicionaImagemFundo: (imagem: any) => void;
    temaRedeSocial: string;
    OpenModalFrameSelecionar: () => void;
    imagemMergeFinal: any
}

function AdicionarEnviar(
    {
        AdicionaImagemFundo,
        temaRedeSocial,
        OpenModalFrameSelecionar,
        imagemMergeFinal

    }: IAdicionarEnviar
): JSX.Element {
    return (
        <AdicionarEnviarBotoes>
            <div>
                <label htmlFor="contained-button-file">
                    <Input accept="image/*" id="contained-button-file" multiple={false} type="file"
                        onChange={(event) => AdicionaImagemFundo(event)}
                    />
                    <Button
                        style={{ color: temaRedeSocial, border: "1px solid", borderColor: temaRedeSocial }}
                        variant="outlined" component="span">
                        Adicionar foto
                    </Button>
                </label>
                <Button variant="outlined"
                    style={{ color: temaRedeSocial, border: "1px  solid", borderColor: temaRedeSocial }}
                    component="span"
                    onClick={() => OpenModalFrameSelecionar()}
                    disabled={imagemMergeFinal ? false : true}
                >
                    Adicionar Frame
                </Button>
                <Button
                    style={{ backgroundColor: temaRedeSocial, color: "white" }}
                    component="span"
                    disabled={!imagemMergeFinal}
                >
                    <a download="RedeSocial.png" href={imagemMergeFinal}
                    > Enviar foto</a>
                </Button>
            </div>
        </AdicionarEnviarBotoes>
    )
}

export { AdicionarEnviar }