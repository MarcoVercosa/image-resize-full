import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormGroup from '@mui/material/FormGroup';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import HeightIcon from '@mui/icons-material/Height';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { ModalInstragramFrame } from '../modalSelectFrame';
import { ModalRecorteImagem } from '../modalRecorteImagem';
import { Container, Header, AspectoImagem, Menu, Mensagem, AdicionarEnviarBotoes, EdicaoImagem, FecharMenu } from "./style"
import { BlobParaBase64, AlteraFiltro, ImagemFileParaBase64, AlterarDimensaoImagem, MoverImagensEOpacidade, IdentificaDimensoesImagem, MergeImagens } from '../../../utils/imagemManager/services';
import { IModalInstragram, IAspecto, IMovimentarImagem, IFiltros } from "../../../types/index"

import { AspectoBotoes } from '../../aspectoBotoes';

const Input = styled('input')({
    display: 'none',
});

function ModalRedeSocial({ open, OpenClose, temaRedeSocial }: IModalInstragram): JSX.Element {
    const [openModalFrames, setOpenModalFrames] = useState<boolean>(false)
    const [openMenu, setOpenMenu] = useState<boolean>(false)
    const [openModalRecorte, setOpenModalRecorte] = useState<boolean>(false)
    const [aspecto, setAspecto] = useState<IAspecto>({ width: 0, height: 0, nome: "Outros" })
    const [imagemFundoOriginal, setImagemFundoOriginal] = useState<string>()
    const [imagemFundo, setImagemFundo] = useState<any>()
    const [imagemFrameOriginal, setImagemFrameOriginal] = useState<string>()
    const [imagemFrame, setImagemFrame] = useState<string>()
    const [imagemMergeOriginal, setImagemMergeOriginal] = useState<string>()
    const [imagemMergeFinal, setImagemMergeFinal] = useState<string>()
    const [houveRecorte, setHouveRecorte] = useState<boolean>(false)
    const [movimentarImagem, setMovimentarImagem] = useState<IMovimentarImagem>({
        XFrame: 0,
        YFrame: 0,
        opacityFrame: 1,
        XImagem: 0,
        YImagem: 0,
        opacityImagem: 1
    })
    const [filtros, setFiltros] = useState<IFiltros>({
        contraste: "1",
        grayscale: "0",
        sepia: "0",
        inverter: "0",
        blur: "0",
        brilho: "1"
    })
    async function SalvarImagemRecortada(imagemRecortada: any) {
        fetch(imagemRecortada)
            .then(res => res.blob())//transforma em blob
            .then(blob => {
                // pega a imagem BLOB para a func Alterar Aspecto se basear na imagem recortada
                const file = new File([blob], "File name", { type: "image/png" })//transforma em aquivo
                IdentificaDimensoesImagem(file).then(({ width, height }) => setAspecto({ width, height, nome: `Outros: ${width}x${height}px` })) //pega a nova dimenção e armazena
                BlobParaBase64(blob).then(data => {// altera o blob para base64  e armazena para a func Alterar Aspecto se basear na imagem recortada
                    setImagemFundoOriginal(data)
                    setImagemMergeFinal(data)//salva para renderizar as alterações
                    setHouveRecorte(true)
                })
            })
    }
    function OpenModalFrameSelecionar() {
        setOpenModalFrames(!openModalFrames)
    }
    function OpenModalRecorte() {
        setOpenModalRecorte(!openModalRecorte)
    }
    async function AdicionaImagemFundo(event: any) {
        let { width, height } = await IdentificaDimensoesImagem(event.target.files[0])
        try {
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
    async function AdicionaImagemFrame(imagem: any) {
        setImagemFrameOriginal(imagem)
        const imageBase64 = await ImagemFileParaBase64(aspecto.width, aspecto.height, imagem)
        const image = await AlterarDimensaoImagem(aspecto.width, aspecto.height, imageBase64)
        setImagemFrame(image)
        let resultado = await MergeImagens(imagemMergeFinal, image) // solicita o merge das 2 imagens
        setImagemMergeOriginal(resultado)
        setImagemMergeFinal(resultado)
    }
    async function AlteraAspecto(width: number, height: number, nomeAspecto: string): Promise<void> {

        if (!imagemFundoOriginal) {
            alert("Selecione primeiramente uma imagem")
            return
        }
        // Para alterar aspecto, deve-se chechar se há primeiro algum frame,
        // Se não houver:
        // Altera o aspecto apenas a imagem de fundo setOriginal
        // Se houver: Padronize as 2 com o mesmo tamanho solicitado e faz o merge
        if (!imagemFrameOriginal || houveRecorte) {//se houve algum recorte não faz o resize  adicionando um novo frame
            try {
                const imageFinal = await AlterarDimensaoImagem(width, height, imagemFundoOriginal)//altera o aspecto
                setImagemFundo(imageFinal)
                setImagemMergeFinal(imageFinal)
                setImagemMergeOriginal(imageFinal)
                setAspecto({ width: width, height: height, nome: nomeAspecto })
                setFiltros({//é necessario zerar os filtros, pois para alterar o tamanho se baseia na imagem original, sem filtros
                    contraste: "1",
                    grayscale: "0",
                    sepia: "0",
                    inverter: "0",
                    blur: "0",
                    brilho: "1"
                })
            } catch (err) {
                console.log(err);
            }
        } else {
            try {
                const imageFundoFinal = await AlterarDimensaoImagem(width, height, imagemFundoOriginal)    // altera dimensionamento da imagem fundo
                const imageFrameBase64 = await ImagemFileParaBase64(width, height, imagemFrameOriginal)//transforma em base64
                const imageFrameFinal = await AlterarDimensaoImagem(width, height, imageFrameBase64)  // altera dimensionamento da imagem frame
                setImagemFundo(imageFundoFinal) //usado pelo movimentarImagem()
                setImagemFrame(imageFrameFinal) //usado pelo movimentarImagem()
                //chama o moverImagem para caso ja tenha alguma alteração de imagem
                let resultado = await MoverImagensEOpacidade(imageFundoFinal, imageFrameFinal, movimentarImagem)
                setImagemMergeOriginal(resultado)
                setImagemMergeFinal(resultado)
                setAspecto({ width: width, height: height, nome: nomeAspecto })
                setFiltros({
                    contraste: "1",
                    grayscale: "0",
                    sepia: "0",
                    inverter: "0",
                    blur: "0",
                    brilho: "1"
                })
            } catch (err) {
                console.log(err);
            }
        }
    };
    async function MovimentarImagem(value: string, propriedade: string) {
        if (!imagemFrame) {
            alert("Necessário selecionar o frame")
            return
        }
        if (houveRecorte) {
            alert("Após o recorte da imagem a opção de Mover fica desabilitada para a manter a qualidade da imagem !!! ")
            return
        }
        setMovimentarImagem(prevState => { return { ...prevState, [propriedade]: Number(value) } })
        let dados = movimentarImagem
        dados = { ...dados, [propriedade]: Number(value) }
        let resultado = await MoverImagensEOpacidade(imagemFundo, imagemFrame, dados)//movimenta a imagem
        AlterarDimensaoImagem(aspecto.width, aspecto.height, resultado).then(data => {//Adiciona o tamanho e largura configurados anteriormente na nova movimentação
            setImagemMergeOriginal(data)
            setImagemMergeFinal(data)
        })
    }
    async function AlterarDimensaoManual() {
        let imagem = await AlterarDimensaoImagem(aspecto.width, aspecto.height, imagemMergeFinal)
        setImagemMergeFinal(imagem)
    }
    async function Filtro(value: string, propriedade: string, valorFiltro: string) {
        setFiltros(prevState => { return { ...prevState, [propriedade]: value, selecionado: propriedade } })
        if (propriedade == "original") {
            setFiltros({
                contraste: "1",
                grayscale: "0",
                sepia: "0",
                inverter: "0",
                blur: "0",
                brilho: "1"
            })
            let imagem = await AlterarDimensaoImagem(aspecto.width, aspecto.height, imagemMergeOriginal)//volta o tamanho para os aspectos atuais selecionados
            setImagemMergeFinal(imagem)
            return
        }
        let aplicaFiltro = await AlteraFiltro(imagemMergeOriginal, valorFiltro)
        AlterarDimensaoImagem(aspecto.width, aspecto.height, aplicaFiltro).then(data => {//Adiciona o tamanho e largura configurados anteriormente na nova movimentação
            setImagemMergeFinal(data)
            //setHouveRecorte(false) //como ao alterar o filtro ele desconsidera o recorte ao usar a imagem e frame originais, setamos orecorte para false
        })
    }
    function FecharModalEdicao() {
        var resposta = (window.confirm("Deseja realmente sair ?"))
        if (resposta) {
            setOpenMenu(false)
            setHouveRecorte(false)
            setImagemFrame("")
            setImagemFrameOriginal("")
            setImagemFundo("")
            setImagemMergeFinal("")
            OpenClose("")
        }
        return
    }
    function Reset() {
        var resposta = (window.confirm("As alterações serão desfeitas. Confirma  ?"))
        if (resposta) {
            setImagemFrame("")
            setImagemFrameOriginal("")
            setImagemFundo("")
            setImagemMergeFinal("")
            setHouveRecorte(false)
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
                            style={{ backgroundColor: openMenu ? temaRedeSocial : "#b5afa7", color: "white", height: "50px" }}
                            component="span" size='small'
                            onClick={() => setOpenMenu(!openMenu)}
                            disabled={!imagemFundoOriginal}

                        >
                            Menu
                        </Button>
                    </div>
                </Header>
                {/* <AspectoImagem temaRedeSocial={temaRedeSocial}>
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
                </AspectoImagem> */}

                <AspectoBotoes aspecto={aspecto} AlteraAspecto={AlteraAspecto} temaRedeSocial={temaRedeSocial} />
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
                                        onClick={(_: any) => Filtro(_, "original", "original")}
                                    >Reset Cores

                                    </Button>
                                </FormGroup>
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
                            <a download="RedeSocial.png" href={imagemMergeFinal}
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
export { ModalRedeSocial }