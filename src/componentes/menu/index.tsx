import React from 'react';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormGroup from '@mui/material/FormGroup';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import HeightIcon from '@mui/icons-material/Height';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import TextField from '@mui/material/TextField';

import { IMovimentarImagem, IAspecto, IFiltros } from '../../types';

import { MenuStyle, FecharMenu } from "./style"

interface IMenu {
    openMenu: boolean;
    setOpenMenu: (value: boolean) => void;
    temaRedeSocial: string;
    movimentarImagem: IMovimentarImagem;
    MovimentarImagem: (value: string, propriedade: string) => void;
    AlterarDimensaoManual: () => void;
    aspecto: IAspecto;
    setAspecto: any
    OpenModalRecorte: () => void;
    imagemFundo: any;
    Reset: () => void;
    Filtro: (value: string, propriedade: string, valorFiltro: string) => void;
    filtros: IFiltros
}

function Menu(
    {
        openMenu,
        setOpenMenu,
        temaRedeSocial,
        movimentarImagem,
        MovimentarImagem,
        AlterarDimensaoManual,
        aspecto,
        setAspecto,
        OpenModalRecorte,
        imagemFundo,
        Reset,
        Filtro,
        filtros,
    }: IMenu
): JSX.Element {

    return (

        <MenuStyle temaRedeSocial={temaRedeSocial} style={{ display: openMenu ? "block" : "none" }}>
            <div>
                <FecharMenu onClick={() => setOpenMenu(!openMenu)}>
                    <ExitToAppIcon sx={{ fontSize: 40 }} />
                </FecharMenu>

                <div style={{ display: 'flex', justifyContent: "space-between" }}>
                    <p>Mover FRAME</p>

                </div>

                <div>
                    <TextField
                        id="outlined-number" label={<CompareArrowsIcon sx={{ fontSize: 50 }} style={{ color: temaRedeSocial }} />}
                        type="number" value={movimentarImagem.XFrame}
                        onChange={(data) => MovimentarImagem(data.target.value, "XFrame")}
                    />
                </div>
                <div>
                    <TextField
                        id="outlined-number" label={<HeightIcon sx={{ fontSize: 40 }} style={{ color: temaRedeSocial }} />}
                        type="number" value={movimentarImagem.YFrame}
                        onChange={(data) => MovimentarImagem(data.target.value, "YFrame")}
                    />
                </div>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-standard-label">Opacidade</InputLabel>
                    <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={movimentarImagem.opacityFrame}
                        onChange={(data) => MovimentarImagem(String(data.target.value), "opacityFrame")}
                        label="OpacidadeFrame"
                    >
                        <MenuItem value={0.0}>0.0</MenuItem>
                        <MenuItem value={0.1}>0.1</MenuItem>
                        <MenuItem value={0.2}>0.2</MenuItem>
                        <MenuItem value={0.3}>0.3</MenuItem>
                        <MenuItem value={0.4}>0.4</MenuItem>
                        <MenuItem value={0.5}>0.5</MenuItem>
                        <MenuItem value={0.6}>0.6</MenuItem>
                        <MenuItem value={0.7}>0.7</MenuItem>
                        <MenuItem value={0.8}>0.8</MenuItem>
                        <MenuItem value={0.9}>0.9</MenuItem>
                        <MenuItem value={1}>1</MenuItem>
                    </Select>
                </FormControl>
                <div>
                    <p>Mover IMAGEM</p>
                    <div>
                        <TextField
                            id="outlined-number" label={<CompareArrowsIcon sx={{ fontSize: 50 }} style={{ color: temaRedeSocial }} />}
                            type="number" value={movimentarImagem.XImagem}
                            onChange={(data) => MovimentarImagem(data.target.value, "XImagem")}
                        />
                    </div>
                    <div>
                        <TextField
                            id="outlined-number" label={<HeightIcon sx={{ fontSize: 40 }} style={{ color: temaRedeSocial }} />}
                            type="number" value={movimentarImagem.YImagem}
                            onChange={(data) => MovimentarImagem(data.target.value, "YImagem")}
                        />
                    </div>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-standard-label">Opacidade</InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={movimentarImagem.opacityImagem}
                            onChange={(data) => MovimentarImagem(String(data.target.value), "opacityImagem")}
                            label="OpacidadeFrame"
                        >
                            <MenuItem value={0.0}>0.0</MenuItem>
                            <MenuItem value={0.1}>0.1</MenuItem>
                            <MenuItem value={0.2}>0.2</MenuItem>
                            <MenuItem value={0.3}>0.3</MenuItem>
                            <MenuItem value={0.4}>0.4</MenuItem>
                            <MenuItem value={0.5}>0.5</MenuItem>
                            <MenuItem value={0.6}>0.6</MenuItem>
                            <MenuItem value={0.7}>0.7</MenuItem>
                            <MenuItem value={0.8}>0.8</MenuItem>
                            <MenuItem value={0.9}>0.9</MenuItem>
                            <MenuItem value={1}>1</MenuItem>
                        </Select>
                    </FormControl>
                    <p>PIXELS:
                        <Button
                            style={{ backgroundColor: temaRedeSocial, color: "white", marginLeft: "40%" }}
                            component="span"
                            onClick={() => { AlterarDimensaoManual() }}
                        >
                            ALTERAR
                        </Button>
                    </p>

                    <div>
                        <TextField
                            id="outlined-number" label={<CompareArrowsIcon sx={{ fontSize: 40 }} style={{ color: temaRedeSocial }} />}
                            type="number" value={aspecto.width}
                            onChange={(data) => setAspecto((prevState: any) => { return { ...prevState, width: Number(data.target.value), nome: `Outros: ${data.target.value} - ${prevState.height}px` } })}
                        />
                        <TextField
                            id="outlined-number" label={<HeightIcon sx={{ fontSize: 40 }} style={{ color: temaRedeSocial }} />} type="number" value={aspecto.height}
                            onChange={(data) => setAspecto((prevState: any) => { return { ...prevState, height: Number(data.target.value), nome: `Outros: ${prevState.width} - ${data.target.value}px` } })}
                        />
                    </div>
                    <div>
                        <Button
                            style={{ backgroundColor: temaRedeSocial, color: "white" }}
                            component="span"
                            onClick={() => { OpenModalRecorte() }}
                            disabled={!imagemFundo}
                        >
                            Recortar
                        </Button>
                    </div>
                    <div>
                        <Button
                            style={{ backgroundColor: temaRedeSocial, color: "white" }}
                            component="span"
                            onClick={() => { Reset() }}
                            disabled={!imagemFundo}
                        >
                            Reset
                        </Button>
                    </div>
                    <div>
                        <FormGroup>
                            <p>FILTROS</p>
                            <TextField
                                id="outlined-number" label="CONTRASTE"
                                onChange={(event) => Filtro(event.target.value, "contraste", `contrast(${event.target.value})`)}
                                inputProps={{ min: "0", max: "100", step: "1" }}
                                type="number"
                                value={filtros.contraste}
                            />

                            <TextField
                                id="outlined-number" label="GRAYSCALE"
                                onChange={(event) => Filtro(event.target.value, "grayscale", `grayscale(${event.target.value})`)}
                                inputProps={{ min: "0", max: "1", step: "1" }}
                                type="number"
                                value={filtros.grayscale}
                            />
                            <TextField
                                id="outlined-number" label="SEPIA"
                                onChange={(event) => Filtro(event.target.value, "sepia", `sepia(${event.target.value})`)}
                                inputProps={{ min: "0.0", max: "1", step: ".1" }}
                                type="number"
                                value={filtros.sepia}
                            />
                            <TextField
                                id="outlined-number" label="BLUR"
                                onChange={(event) => Filtro(event.target.value, "blur", `blur(${event.target.value}px)`)}
                                inputProps={{ min: "0", max: "10", step: "1" }}
                                type="number"
                                value={filtros.blur}
                            />
                            <TextField
                                id="outlined-number" label="INVERTER"
                                onChange={(event) => Filtro(event.target.value, "inverter", `invert(${event.target.value})`)}
                                inputProps={{ min: "0.0", max: "1", step: ".1" }}
                                type="number"
                                value={filtros.inverter}
                            />
                            <TextField
                                id="outlined-number" label="BRILHO"
                                onChange={(event) => Filtro(event.target.value, "brilho", `brightness(${event.target.value})`)}
                                inputProps={{ min: "0.0", max: "3", step: ".1" }}
                                type="number"
                                value={filtros.brilho}
                            />
                            <Button
                                style={{ backgroundColor: temaRedeSocial, color: "white", marginLeft: "40%", marginTop: "6%" }}
                                component="span"
                                onClick={(_: any) => Filtro(_, "original", "original")}
                            >Reset Cores

                            </Button>
                        </FormGroup>
                    </div>
                </div>
            </div>
        </MenuStyle>
    )
}

export { Menu }