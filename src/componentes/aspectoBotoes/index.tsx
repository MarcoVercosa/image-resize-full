import React, { useState } from 'react';
import { AspectoImagem } from "./style"
import Button from '@mui/material/Button';
import { IAspecto } from '../../types';

interface IAspectoBotoes {
    aspecto: IAspecto;
    AlteraAspecto: (width: number, height: number, nomeAspecto: string) => void
    temaRedeSocial: string
}


export function AspectoBotoes({ aspecto, AlteraAspecto, temaRedeSocial }: IAspectoBotoes): JSX.Element {


    return (
        <AspectoImagem temaRedeSocial={temaRedeSocial} >
            <p>Selecione o aspecto: {aspecto.nome}</p>
            <div>
                <Button style={{ backgroundColor: aspecto.nome == "Horizontal - 1080x608" ? temaRedeSocial : "#b5afa7", color: "white" }}
                    onClick={() => AlteraAspecto(1080, 608, "Horizontal - 1080x608")}
                >1.91:1 - Horizontal</Button>
                <Button style={{ backgroundColor: aspecto.nome == "Square - 1080x1080" ? temaRedeSocial : "#b5afa7", color: "white" }}
                    onClick={() => AlteraAspecto(1080, 1080, "Square - 1080x1080")}
                >1:1 - Square</Button>
                <Button
                    style={{ backgroundColor: aspecto.nome == "Vertical - 1080x1350" ? temaRedeSocial : "#b5afa7", color: "white" }}
                    onClick={() => AlteraAspecto(1080, 1350, "Vertical - 1080x1350")}
                >4:5 - Vertical</Button>
                <Button
                    style={{ backgroundColor: aspecto.nome == "Pequeno - 500x500" ? temaRedeSocial : "#b5afa7", color: "white" }}
                    onClick={() => AlteraAspecto(500, 500, "Pequeno - 500x500")}
                >500x500</Button>
            </div>
        </AspectoImagem>
    )
}