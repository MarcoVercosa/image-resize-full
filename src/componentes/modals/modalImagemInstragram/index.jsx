import React, { useState, useCallback } from 'react';

import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import HeightIcon from '@mui/icons-material/Height';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Checkbox from '@mui/material/Checkbox';

import ImageFilter from "react-image-filter"
//let imageGrayscale = require('image-grayscale')
import imageFilterCore from 'image-filter-core'
import imageGrayscale from 'image-filter-grayscale'



import { ModalInstragramFrame } from '../modalSelectFrameInstagram';
import { ModalRecorteImagem } from '../modalRecorteImagem';
import { Container, Header, AspectoImagem, Menu, Mensagem, AdicionarEnviarBotoes, EdicaoImagem, FecharMenu } from "./style"
import { BlobParaBase64, ImagemParaBlob, ImagemFileParaBase64, AlterarDimensaoImagem, MoverImagensEOpacidade, IdentificaDimensoesImagem, MergeImagens } from '../../services/services';
import { isConstructorDeclaration } from 'typescript';



const Input = styled('input')({
    display: 'none',
});

function ModalInstragram({ open, OpenClose, temaRedeSocial }) {
    // console.log(imageFilterCore)
    // console.log(imageGrayscale)
    const [openModalFrames, setOpenModalFrames] = useState(false)
    const [openMenu, setOpenMenu] = useState(false)
    const [openModalRecorte, setOpenModalRecorte] = useState(false)
    const [aspecto, setAspecto] = useState({ width: 0, height: 0, nome: "Outros" })
    const [imagemFundoOriginal, setImagemFundoOriginal] = useState()
    const [imagemFundo, setImagemFundo] = useState()
    const [imagemFrameOriginal, setImagemFrameOriginal] = useState()
    const [imagemFrame, setImagemFrame] = useState()
    const [imagemMergeOriginal, setImagemMergeOriginal] = useState()
    const [imagemMergeFinal, setImagemMergeFinal] = useState()
    const [movimentarImagem, setMovimentarImagem] = useState({
        XFrame: 0,
        YFrame: 0,
        opacityFrame: 1,
        XImagem: 0,
        YImagem: 0,
        opacityImagem: 1
    })
    const [filtros, setFiltros] = useState({
        contraste: "1",
        grayscale: "0",
        sepia: "0",
        invert: "0",
        blur: "0px",
        brightness: "0"
    })

    async function SalavrImagemRecortada(imagemRecortada) {

        //if (!imagemFrameOriginal) {//se não houver frame add
        fetch(imagemRecortada)
            .then(res => res.blob())//transforma em blob
            .then(blob => {
                setImagemFundoOriginal(blob) // pega a imagem BLOB para a func Alterar Aspecto se basear na imagem recortada
                const file = new File([blob], "File name", { type: "image/png" })//transforma em aquivo
                //IdentificaDimensoesImagem(file).then(({ width, height }) => console.log(width, height)) //pega a nova dimenção e armazena
                IdentificaDimensoesImagem(file).then(({ width, height }) => setAspecto({ width, height, nome: `Outros: ${width}x${height}px` })) //pega a nova dimenção e armazena

            })
        setImagemMergeFinal(imagemRecortada)//para ser renderizada a nova imagem recortada
    }

    function OpenModalFrameSelecionar() {
        setOpenModalFrames(!openModalFrames)
    }
    function OpenModalRecorte() {
        // if (!imagemFrameOriginal) {
        //     alert("Selecione uma imagem e um frame primeiro")
        //     return
        // }
        setOpenModalRecorte(!openModalRecorte)
    }

    async function AdicionaImagemFundo(event) {
        let { width, height } = await IdentificaDimensoesImagem(event.target.files[0])

        try {
            setImagemFundoOriginal(event.target.files[0])
            console.log(event.target.files[0])
            //const image = await resizeFile(width, height, event.target.files[0]);
            const imageBase64 = await ImagemFileParaBase64(width, height, event.target.files[0])
            const image = await AlterarDimensaoImagem(width, height, imageBase64)
            setImagemMergeOriginal(image)
            setImagemFundo(image)
            setImagemMergeFinal(image);
            setAspecto({ width, height, nome: `Outros: ${width} - ${height}px` })
        } catch (err) {
            console.log(err);
        }
    }
    async function AdicionaImagemFrame(imagem) {
        // if (event.target.files.length > 10) {
        //     alert("Até 10 imagens podem serem selecionadas ")
        //     return
        // }
        setImagemFrameOriginal(imagem)
        const imageBase64 = await ImagemFileParaBase64(aspecto.width, aspecto.height, imagem)
        const image = await AlterarDimensaoImagem(aspecto.width, aspecto.height, imageBase64)
        setImagemFrame(image)
        //MergeImagens(image)
        let resultado = await MergeImagens(imagemMergeFinal, image) // solicita o merge das 2 imagens
        setImagemMergeOriginal(resultado)
        setImagemMergeFinal(resultado)
    }

    async function AlteraAspecto(width, height, nomeAspecto) {

        if (!imagemFundoOriginal) {
            alert("Selecione primeiramente uma imagem")
            return
        }
        // Para alterar aspecto, deve-se chechar se há primeiro algum frame,
        // Se não houver:
        // Altera o aspecto apenas a imagem de fundo setOriginal
        // Se houver: Padronize as 2 com o mesmo tamanho solicitado e faz o merge
        if (!imagemFrameOriginal) {
            try {
                const imageBase64 = await ImagemFileParaBase64(width, height, imagemFundoOriginal)
                const imageFinal = await AlterarDimensaoImagem(width, height, imageBase64)
                setImagemFundo(imageFinal)
                setImagemMergeFinal(imageFinal)
                setImagemMergeOriginal(imageFinal)
                setAspecto({ width: width, height: height, nome: nomeAspecto })
            } catch (err) {
                console.log(err);
            }
        } else {
            try {
                const imageFundoBase64 = await ImagemFileParaBase64(width, height, imagemFundoOriginal)//transforma em base64
                const imageFundoFinal = await AlterarDimensaoImagem(width, height, imageFundoBase64)    // altera dimensionamento
                const imageFrameBase64 = await ImagemFileParaBase64(width, height, imagemFrameOriginal)//transforma em base64
                const imageFrameFinal = await AlterarDimensaoImagem(width, height, imageFrameBase64)  // altera dimensionamento
                setImagemFundo(imageFundoFinal) //usado pelo movimentarImagem()
                setImagemFrame(imageFrameFinal) //usado pelo movimentarImagem()
                //chama o moverImagem para caso ja tenha alguma alteração de imagem
                let resultado = await MoverImagensEOpacidade(imageFundoFinal, imageFrameFinal, movimentarImagem)
                setImagemMergeOriginal(resultado)
                setImagemMergeFinal(resultado)
                setAspecto({ width: width, height: height, nome: nomeAspecto })
            } catch (err) {
                console.log(err);
            }
        }
    };
    async function MovimentarImagem(value, propriedade) {
        if (!imagemFrame) {
            alert("Necessário selecionar o frame")
        }
        setMovimentarImagem(prevState => { return { ...prevState, [propriedade]: Number(value) } })
        let dados = movimentarImagem
        dados = { ...dados, [propriedade]: Number(value) }
        let resultado = await MoverImagensEOpacidade(imagemFundo, imagemFrame, dados)
        setImagemMergeOriginal(resultado)
        setImagemMergeFinal(resultado)
    }

    async function AlterarDimensaoManual() {
        // let data = aspecto
        // data = { ...data, [propriedade]: Number(value) }
        // data = { ...data, nome: `Outros - ${data.width} - ${data.height}px` }
        // setAspecto(data)
        let imagem = await AlterarDimensaoImagem(aspecto.width, aspecto.height, imagemMergeFinal)
        setImagemMergeFinal(imagem)
        console.log(aspecto)
    }

    function Filtro(value, propriedade, valueFilter) {
        setFiltros(prevState => { return { ...prevState, [propriedade]: value, selecionado: propriedade } })
        setImagemMergeOriginal(imagemMergeFinal) //armazena o estado original sem alterações na imagem

        if (propriedade == "original") {
            setImagemMergeFinal(imagemMergeOriginal)
            return
        }

        var imgObj = document.getElementsByClassName('imagemFinal');
        function gray(imgObj, filter) {
            var canvas = document.createElement('canvas');
            var canvasContext = canvas.getContext('2d');

            var imgW = imgObj[0].width;
            var imgH = imgObj[0].height;
            canvas.width = imgW;
            canvas.height = imgH;

            canvasContext.filter = "brightness(3)";
            canvasContext.drawImage(imgObj[0], 0, 0, imgObj[0].width, imgObj[0].height)
            console.log(canvas.toDataURL())
            setImagemMergeFinal(canvas.toDataURL())
        }
        imgObj.src = gray(imgObj);



    }
    function FecharModalEdicao() {
        var resposta = (window.confirm("Deseja realmente sair ? "))
        if (resposta) {
            setOpenMenu(false)
            Reset()
            OpenClose()
        }
        return
    }
    function Reset() {
        var resposta = (window.confirm("As alterações serão desfeitas. Confirma  ?"))
        if (resposta) {
            setImagemFrame("")
            setImagemFrameOriginal("")
            setImagemFundo("")
            setImagemFundoOriginal("")
            setImagemMergeFinal("")
            setImagemMergeOriginal("")
            setOpenMenu(false)
        }
        return
    }

    return (

        <Modal
            open={open}
            onClose={FecharModalEdicao}
            aria-OpenClose="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Container temaRedeSocial={temaRedeSocial}
            >
                <Header temaRedeSocial={temaRedeSocial}>
                    <div>
                        <h1>Editar foto</h1>
                        <Button
                            //variant="outlined" 
                            style={{ backgroundColor: openMenu ? temaRedeSocial : "#b5afa7", color: "white", height: "50px" }}
                            component="span" size='small'
                            onClick={() => setOpenMenu(!openMenu)}
                            disabled={!imagemFundo}

                        >
                            Menu
                        </Button>
                    </div>
                </Header>

                <AspectoImagem temaRedeSocial={temaRedeSocial}>
                    <p>Selecione o aspecto: {aspecto.nome}</p>
                    <div>
                        <Button style={{ backgroundColor: aspecto.nome == "Horizontal - 1080x608" ? temaRedeSocial : "#b5afa7", color: "white" }}
                            //variant={aspecto.nome == "Horizontal - 1080x608" ? "contained" : "outlined"}
                            onClick={() => AlteraAspecto(1080, 608, "Horizontal - 1080x608")}
                        >1.91:1 - Horizontal</Button>
                        <Button style={{ backgroundColor: aspecto.nome == "Square - 1080x1080" ? temaRedeSocial : "#b5afa7", color: "white" }}
                            //variant={aspecto.nome == "Square - 1080x1080" ? "contained" : "outlined"}
                            onClick={() => AlteraAspecto(1080, 1080, "Square - 1080x1080")}
                        >1:1 - Square</Button>
                        <Button
                            style={{ backgroundColor: aspecto.nome == "Vertical - 1080x1350" ? temaRedeSocial : "#b5afa7", color: "white" }}
                            //variant={aspecto.nome == "Vertical - 1080x1350" ? "contained" : "outlined"}
                            onClick={() => AlteraAspecto(1080, 1350, "Vertical - 1080x1350")}
                        >4:5 - Vertical</Button>
                        <Button
                            style={{ backgroundColor: aspecto.nome == "Pequeno - 500x500" ? temaRedeSocial : "#b5afa7", color: "white" }}
                            //variant={aspecto.nome == "Pequeno - 500x500" ? "contained" : "outlined"}
                            onClick={() => AlteraAspecto(500, 500, "Pequeno - 500x500")}
                        >500x500</Button>
                    </div>
                </AspectoImagem>

                <Menu style={{ display: openMenu ? "block" : "none" }}>
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
                                onChange={(data) => MovimentarImagem(data.target.value, "opacityFrame")}
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
                                    onChange={(data) => MovimentarImagem(data.target.value, "opacityImagem")}
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
                                    onChange={(data) => setAspecto(prevState => { return { ...prevState, width: Number(data.target.value), nome: `Outros: ${data.target.value} - ${prevState.height}px` } })}
                                />
                                <TextField
                                    id="outlined-number" label={<HeightIcon sx={{ fontSize: 40 }} style={{ color: temaRedeSocial }} />} type="number" value={aspecto.height}
                                    onChange={(data) => setAspecto(prevState => { return { ...prevState, height: Number(data.target.value), nome: `Outros: ${prevState.width} - ${data.target.value}px` } })}
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

                                <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                                    <FormLabel component="legend">FILTROS</FormLabel>
                                    <FormGroup>
                                        <TextField
                                            id="outlined-number" label="CONTRASTE"
                                            //inputProps={{ min: "0.0", max: "1", step: ".1" }}
                                            inputProps={{ min: "0", max: "100", step: "1" }}
                                            type="number"
                                            value={filtros.contraste}
                                        />

                                        <TextField
                                            id="outlined-number" label="GRAYSCALE"
                                            inputProps={{ min: "0", max: "100", step: "1" }}
                                            type="number"
                                            value={filtros.grayscale}
                                        />
                                        <TextField
                                            id="outlined-number" label="SEPIA"
                                            inputProps={{ min: "0.0", max: "1", step: ".1" }}
                                            type="number"
                                            value={filtros.sepia}
                                        />
                                        <TextField
                                            id="outlined-number" label="BLUR"
                                            inputProps={{ min: "0", max: "10", step: "1" }}
                                            type="number"
                                            value={filtros.blur}
                                        />
                                        <TextField
                                            id="outlined-number" label="INVERTER"
                                            inputProps={{ min: "0.0", max: "1", step: ".1" }}
                                            type="number"
                                            value={filtros.invert}
                                        />
                                        <TextField
                                            id="outlined-number" label="BRILHO"
                                            inputProps={{ min: "0.0", max: "3", step: ".1" }}
                                            type="number"
                                            value={filtros.brightness}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={filtros.saturate}
                                                    onChange={(event) => Filtro(event.target.checked, "contraste", "contrast()")}
                                                    name="contraste" />
                                            }
                                            label="CONTRASTE"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={filtros.invert}
                                                    onChange={(event) => Filtro(event.target.checked, "invert", "invert(1)")}
                                                    name="invert" />
                                            }
                                            label="INVERT"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={filtros.grayscale}
                                                    onChange={(event) => Filtro(event.target.checked, "grayscale", "grayscale(1)")}
                                                    name="grayscale" />
                                            }
                                            label="GRAYSCALE"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={filtros.sepia}
                                                    onChange={(event) => Filtro(event.target.checked, "sepia", "sepia(1)")}
                                                    name="sepia" />
                                            }
                                            label="SEPIA"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={filtros.blur}
                                                    onChange={(event) => Filtro(event.target.checked, "blur", "blur(2px)")}
                                                    name="blur" />
                                            }
                                            label="BLUR"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={filtros.original}
                                                    onChange={(event) => Filtro(event.target.checked, "original", "original")}
                                                    name="blur" />
                                            }
                                            label="ORIGINAL"
                                        />
                                    </FormGroup>
                                </FormControl>

                            </div>
                        </div>
                    </div>
                </Menu>

                <Mensagem temaRedeSocial={temaRedeSocial}>
                    <div>
                        {!imagemFundo &&
                            <p>Adicione primeiramente uma IMAGEM clicando no botão  "ADICIONAR FOTO"</p>
                        }
                        {imagemFundo && !imagemFrame &&
                            <p>Agora formate sua foto usando as ferramentas do MENU</p>
                        }
                        {!imagemFrame &&
                            <p>Em seguida adicione um FRAME clicando no botão "ADICIONAR FRAME" </p>
                        }
                    </div>
                </Mensagem>
                {/* <ImageFilter
                    image="https://assets.b9.com.br/wp-content/uploads/2018/02/Google-Imagens.png"
                    //image={imagemMergeFinal}
                    filter={filtros.selecionado} // see docs beneath
                    colorOne={[40, 250, 250]}
                    colorTwo={[250, 150, 30]}
                    onChange={(filter) => console.log(filter)}
                /> */}

                <EdicaoImagem>
                    {imagemMergeFinal &&
                        <>
                            <div>
                                <img className="imagemFinal" src={imagemMergeFinal} />
                            </div>
                        </>

                    }
                </EdicaoImagem>


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
                            //variant="contained" 
                            style={{ backgroundColor: temaRedeSocial, color: "white" }}
                            component="span">
                            Enviar foto
                        </Button>
                    </div>
                </AdicionarEnviarBotoes>
                <ModalInstragramFrame open={openModalFrames} OpenClose={OpenModalFrameSelecionar} FrameSelecionado={AdicionaImagemFrame} />
                <ModalRecorteImagem open={openModalRecorte} OpenClose={OpenModalRecorte} imagemParaRecorte={imagemMergeFinal} SalavrImagemRecortada={SalavrImagemRecortada} />
            </Container>

        </Modal >
    );
}

export { ModalInstragram }