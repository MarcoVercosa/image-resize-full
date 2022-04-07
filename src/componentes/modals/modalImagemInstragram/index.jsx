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


const Input = styled('input')({
    display: 'none',
});

function ModalInstragram({ open, OpenClose, temaRedeSocial }) {
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
        inverter: "0",
        blur: "0",
        brilho: "1"
    })

    async function SalvarImagemRecortada(imagemRecortada) {
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
            //setImagemFundoOriginal(event.target.files[0])
            //const image = await resizeFile(width, height, event.target.files[0]);
            const imageBase64 = await ImagemFileParaBase64(width, height, event.target.files[0])
            const image = await AlterarDimensaoImagem(width, height, imageBase64)

            setImagemFundoOriginal(imageBase64)

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
                const imageFinal = await AlterarDimensaoImagem(width, height, imagemFundoOriginal)
                setImagemFundo(imageFinal)
                setImagemMergeFinal(imageFinal)
                setImagemMergeOriginal(imageFinal)
                setAspecto({ width: width, height: height, nome: nomeAspecto })
            } catch (err) {
                console.log(err);
            }
        } else {
            try {
                //const imageFundoBase64 = await ImagemFileParaBase64(width, height, imagemFundoOriginal)//transforma em base64
                const imageFundoFinal = await AlterarDimensaoImagem(width, height, imagemFundoOriginal)    // altera dimensionamento
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
        let imagem = await AlterarDimensaoImagem(aspecto.width, aspecto.height, imagemMergeFinal)
        setImagemMergeFinal(imagem)
        console.log(aspecto)
    }

    function Filtro(value, propriedade, valueFilter) {
        setFiltros(prevState => { return { ...prevState, [propriedade]: value, selecionado: propriedade } })

        if (propriedade == "original") {
            setFiltros({
                contraste: "1",
                grayscale: "0",
                sepia: "0",
                inverter: "0",
                blur: "0",
                brilho: "0"
            })
            setImagemMergeFinal(imagemMergeOriginal)
            return
        }

        var imgObj = document.getElementsByClassName('imagemFinal');
        imgObj[0].src = imagemMergeOriginal
        function gray(imgObj) {
            var canvas = document.createElement('canvas');
            var canvasContext = canvas.getContext('2d');

            var imgW = imgObj[0].width;
            var imgH = imgObj[0].height;
            canvas.width = imgW;
            canvas.height = imgH;

            canvasContext.filter = valueFilter;
            canvasContext.drawImage(imgObj[0], 0, 0, imgObj[0].width, imgObj[0].height)
            setImagemMergeFinal(canvas.toDataURL())
        }
        gray(imgObj);
    }
    function FecharModalEdicao() {
        var resposta = (window.confirm("Deseja realmente sair ?"))
        if (resposta) {
            setOpenMenu(false)
            setImagemFrame("")
            setImagemFrameOriginal("")
            setImagemFundo("")
            setImagemMergeFinal("")
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
            setImagemMergeFinal(imagemFundoOriginal)
            setOpenMenu(false)
        }
        return
    }

    function EnviarFoto() {

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

                <Menu temaRedeSocial={temaRedeSocial} style={{ display: openMenu ? "block" : "none" }}>
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
                                        onClick={(_) => Filtro(_, "original", "original")}
                                    >Reset Cores

                                    </Button>
                                </FormGroup>
                                {/* </FormControl> */}

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
                            <p>Agora, altere o aspecto da imagem de forma automática utilizando os botões acima, ou manualmente utilizando as ferramentas do MENU</p>
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
                            style={{ backgroundColor: temaRedeSocial, color: "white" }}
                            component="span"
                            disabled={!imagemMergeFinal}
                        >
                            <a download="teste.png" href={imagemMergeFinal}
                            > Enviar foto</a>
                        </Button>

                    </div>
                </AdicionarEnviarBotoes>
                <ModalInstragramFrame open={openModalFrames} OpenClose={OpenModalFrameSelecionar} FrameSelecionado={AdicionaImagemFrame} temaRedeSocial={temaRedeSocial} />
                <ModalRecorteImagem open={openModalRecorte} OpenClose={OpenModalRecorte} imagemParaRecorte={imagemMergeFinal} SalvarImagemRecortada={SalvarImagemRecortada} temaRedeSocial={temaRedeSocial} />
            </Container>

        </Modal >
    );
}

export { ModalInstragram }