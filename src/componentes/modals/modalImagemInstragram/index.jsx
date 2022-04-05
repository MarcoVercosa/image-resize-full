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

import Checkbox from '@mui/material/Checkbox';



import { ModalInstragramFrame } from '../modalSelectFrameInstagram';
import { ModalRecorteImagem } from '../modalRecorteImagem';
import { Header, AspectoImagem, Menu, Mensagem, AdicionarEnviarBotoes, EdicaoImagem, FecharMenu } from "./style"
import { BlobParaBase64, ImagemParaBlob, ImagemFileParaBase64, AlterarDimensaoImagem, MoverImagensEOpacidade, IdentificaDimensoesImagem } from '../../services/services';


//import Resizer from "react-image-file-resizer";
//import mergeImages from 'merge-images'
import mergeImagesV2 from 'merge-images-v2'
import { setOriginalNode } from 'typescript';
//import { WebPhotoFilter } from 'web-photo-filter-react/dist';
//import ImageFilter from 'react-image-filter';
//import Cropper from 'react-easy-crop'


const Input = styled('input')({
    display: 'none',
});

function ModalInstragram({ open, OpenClose }) {
    const [openModalFrames, setOpenModalFrames] = useState(false)
    const [openMenu, setOpenMenu] = useState(false)
    const [openModalRecorte, setOpenModalRecorte] = useState(false)
    const [aspecto, setAspecto] = useState({ width: 1080, height: 1080, nome: "Square - 1080x1080" })

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
        duotone: false,
        grayscale: false,
        sepia: false,
        invert: false,
        selecionado: "grayscale"
    })

    function SalavrImagemRecortada(imagem) {
        console.log("Recortou", imagem)
        setImagemMergeFinal(imagem)
    }

    function OpenModalFrameSelecionar() {
        setOpenModalFrames(!openModalFrames)
    }
    function OpenModalRecorte() {
        if (!imagemFrameOriginal) {
            alert("Selecione uma imagem e um frame primeiro")
            return
        }
        setOpenModalRecorte(!openModalRecorte)
    }

    async function AdicionaImagemFundo(event) {
        IdentificaDimensoesImagem(event)



        try {
            setImagemFundoOriginal(event.target.files[0])
            //const image = await resizeFile(width, height, event.target.files[0]);
            const imageBase64 = await ImagemFileParaBase64(aspecto.width, aspecto.height, event.target.files[0])
            const image = await AlterarDimensaoImagem(aspecto.width, aspecto.height, imageBase64)
            if (imagemFrame) {//se ja existir algum frame carregado, apenas atualize a imagem final com a nova imagem fundo
                mergeImagesV2([image, imagemFrame]).then(b64 => {
                    setImagemMergeOriginal(b64)
                    setImagemMergeFinal(b64)
                    setImagemFundo(image)
                })
                return
            }
            setImagemMergeOriginal(image)
            setImagemFundo(image)
            setImagemMergeFinal(image)
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
        //const image = await resizeFile(1080, 1080, imagem);
        const imageBase64 = await ImagemFileParaBase64(aspecto.width, aspecto.height, imagem)
        const image = await AlterarDimensaoImagem(aspecto.width, aspecto.height, imageBase64)
        setImagemFrame(image)
        MergeImagens(image)
    }
    //assim que o frame for adicionado, a func AdicionaImagemFrame chamara esta funcão para merge as 2 imagens
    function MergeImagens(ImagemFrameRecebida) {
        mergeImagesV2([imagemMergeFinal, ImagemFrameRecebida]).then(b64 => {
            setImagemMergeOriginal(b64)
            setImagemMergeFinal(b64)
        })
    }
    async function AlteraAspecto(width, height, nomeAspecto) {
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
        setMovimentarImagem(prevState => { return { ...prevState, [propriedade]: Number(value) } })
        let dados = movimentarImagem
        dados = { ...dados, [propriedade]: Number(value) }
        let resultado = await MoverImagensEOpacidade(imagemFundo, imagemFrame, dados)
        setImagemMergeOriginal(resultado)
        setImagemMergeFinal(resultado)
    }

    function Filtro(value, propriedade) {
        setFiltros(prevState => { return { ...prevState, [propriedade]: value, selecionado: propriedade } })
    }


    function Reset() {
        setImagemFrame("")
        setImagemFrameOriginal("")
        setImagemFundo("")
        setImagemFundoOriginal("")
        setImagemMergeFinal("")
        setImagemMergeOriginal("")
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

                <Header>
                    <div>
                        <h1>Editar foto</h1>
                        <Button
                            //variant="outlined" 
                            style={{ backgroundColor: openMenu ? "#c13996" : "#b5afa7", color: "white" }}
                            component="span" size='small'
                            onClick={() => setOpenMenu(!openMenu)}
                        >
                            Menu
                        </Button>
                    </div>
                </Header>

                <AspectoImagem>
                    <p>Selecione o aspecto: {aspecto.nome}</p>
                    <div>
                        <Button style={{ backgroundColor: aspecto.nome == "Horizontal - 1080x608" ? "#c13996" : "#b5afa7", color: "white" }}
                            //variant={aspecto.nome == "Horizontal - 1080x608" ? "contained" : "outlined"}
                            onClick={() => AlteraAspecto(1080, 608, "Horizontal - 1080x608")}
                        >1.91:1 - Horizontal</Button>
                        <Button style={{ backgroundColor: aspecto.nome == "Square - 1080x1080" ? "#c13996" : "#b5afa7", color: "white" }}
                            //variant={aspecto.nome == "Square - 1080x1080" ? "contained" : "outlined"}
                            onClick={() => AlteraAspecto(1080, 1080, "Square - 1080x1080")}
                        >1:1 - Square</Button>
                        <Button
                            style={{ backgroundColor: aspecto.nome == "Vertical - 1080x1350" ? "#c13996" : "#b5afa7", color: "white" }}
                            //variant={aspecto.nome == "Vertical - 1080x1350" ? "contained" : "outlined"}
                            onClick={() => AlteraAspecto(1080, 1350, "Vertical - 1080x1350")}
                        >4:5 - Vertical</Button>
                        <Button
                            style={{ backgroundColor: aspecto.nome == "Pequeno - 500x500" ? "#c13996" : "#b5afa7", color: "white" }}
                            //variant={aspecto.nome == "Pequeno - 500x500" ? "contained" : "outlined"}
                            onClick={() => AlteraAspecto(500, 500, "Pequeno - 500x500")}
                        >500x500</Button>
                    </div>
                </AspectoImagem>

                <Menu style={{ display: openMenu ? "block" : "none" }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: "space-between" }}>
                            <p>Mover FRAME</p>
                            <FecharMenu onClick={() => setOpenMenu(!openMenu)}>
                                X
                            </FecharMenu>
                        </div>
                        <div>
                            <TextField
                                id="outlined-number" label="X" type="number" value={movimentarImagem.XFrame}
                                onChange={(data) => MovimentarImagem(data.target.value, "XFrame")}
                            />
                        </div>
                        <div>
                            <TextField
                                id="outlined-number" label="Y" type="number" value={movimentarImagem.YFrame}
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
                                {/* <MenuItem value="">
                                    <em>None</em>
                                </MenuItem> */}
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
                                    id="outlined-number" label="X" type="number" value={movimentarImagem.XImagem}
                                    onChange={(data) => MovimentarImagem(data.target.value, "XImagem")}
                                />
                            </div>
                            <div>
                                <TextField
                                    id="outlined-number" label="Y" type="number" value={movimentarImagem.YImagem}
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
                            <p>PIXELS:</p>
                            <div>
                                <TextField
                                    id="outlined-number" label="Largura IMAGEM" type="number" //value={movimentarImagem.XImagem}
                                    onChange={(data) => MovimentarImagem(data.target.value, "XImagem")}
                                />
                                <TextField
                                    id="outlined-number" label="Altura IMAGEM" type="number" //value={movimentarImagem.XImagem}
                                    onChange={(data) => MovimentarImagem(data.target.value, "XImagem")}
                                />
                            </div>
                            <div>
                                <Button
                                    style={{ backgroundColor: "#c13996", color: "white" }}
                                    component="span"
                                    onClick={() => { OpenModalRecorte() }}
                                >
                                    Recortar
                                </Button>
                            </div>
                            <div>
                                <Button
                                    style={{ backgroundColor: "#c13996", color: "white" }}
                                    component="span"
                                    onClick={() => { Reset() }}
                                >
                                    Reset
                                </Button>
                            </div>
                            <div>


                                <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                                    <FormLabel component="legend">FILTROS</FormLabel>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={filtros.duotone}
                                                    onChange={(event) => Filtro(event.target.checked, "duotone")}
                                                    name="duotone" />
                                            }
                                            label="DUOTONE"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={filtros.invert}
                                                    onChange={(event) => Filtro(event.target.checked, "invert")}
                                                    name="invert" />
                                            }
                                            label="INVERT"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={filtros.grayscale}
                                                    onChange={(event) => Filtro(event.target.checked, "grayscale")}
                                                    name="grayscale" />
                                            }
                                            label="GRAYSCALE"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={filtros.sepia}
                                                    onChange={(event) => Filtro(event.target.checked, "sepia")}
                                                    name="sepia" />
                                            }
                                            label="SEPIA"
                                        />
                                    </FormGroup>
                                </FormControl>

                            </div>
                        </div>
                    </div>
                </Menu>

                <Mensagem>
                    <div>
                        {!imagemFundo &&
                            <p>Adicione PRIMEIRAMENTE uma IMAGEM clicando no botão  "ADICIONAR FOTO"</p>
                        }
                        {imagemFundo && !imagemFrame &&
                            <p>Agora Formate Sua Foto</p>
                        }
                        {!imagemFrame &&
                            <p>Em Seguida Adicione um FRAME clicando no botão "ADICIONAR FRAME" </p>
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
                                style={{ color: "#c13996", border: "1px #c13996 solid" }}
                                variant="outlined" component="span">
                                Adicionar foto
                            </Button>
                        </label>
                        <Button variant="outlined"
                            style={{ color: "#c13996", border: "1px #c13996 solid" }}
                            component="span"
                            onClick={() => OpenModalFrameSelecionar()}
                            disabled={imagemMergeFinal ? false : true}
                        >
                            Adicionar Frame
                        </Button>
                        <Button
                            //variant="contained" 
                            style={{ backgroundColor: "#c13996", color: "white" }}
                            component="span">
                            Enviar foto
                        </Button>
                    </div>
                </AdicionarEnviarBotoes>
                <ModalInstragramFrame open={openModalFrames} OpenClose={OpenModalFrameSelecionar} FrameSelecionado={AdicionaImagemFrame} />
                <ModalRecorteImagem open={openModalRecorte} OpenClose={OpenModalRecorte} imagemParaRecorte={imagemMergeFinal} SalavrImagemRecortada={SalavrImagemRecortada} />
            </div>

        </Modal >
    );
}

export { ModalInstragram }