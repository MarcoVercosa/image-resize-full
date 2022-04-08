import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Modal from '@mui/material/Modal';

import { ModalInstragramFrame } from '../modalSelectFrame';
import { ModalRecorteImagem } from '../modalRecorteImagem';
import { Container, Header, Mensagem, EdicaoImagem } from "./style"
import { BlobParaBase64, AlteraFiltro, ImagemFileParaBase64, AlterarDimensaoImagem, MoverImagensEOpacidade, IdentificaDimensoesImagem, MergeImagens } from '../../../utils/imagemManager/services';
import { IModalInstragram, IAspecto, IMovimentarImagem, IFiltros } from "../../../types/index"

import { AspectoBotoes } from '../../aspectoBotoes';
import { Menu } from "../../menu/index"
import { AdicionarEnviar } from "../../adicionarEnviarBotoes/index"


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

            <Container temaRedeSocial={temaRedeSocial}>
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

                <AspectoBotoes
                    aspecto={aspecto}
                    AlteraAspecto={AlteraAspecto}
                    temaRedeSocial={temaRedeSocial}
                />
                <Menu
                    openMenu={openMenu}
                    setOpenMenu={setOpenMenu}
                    temaRedeSocial={temaRedeSocial}
                    movimentarImagem={movimentarImagem}
                    MovimentarImagem={MovimentarImagem}
                    AlterarDimensaoManual={AlterarDimensaoManual}
                    aspecto={aspecto}
                    setAspecto={setAspecto}
                    OpenModalRecorte={OpenModalRecorte}
                    imagemFundo={imagemFundo}
                    Reset={Reset}
                    Filtro={Filtro}
                    filtros={filtros}
                />
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

                <AdicionarEnviar
                    AdicionaImagemFundo={AdicionaImagemFundo}
                    temaRedeSocial={temaRedeSocial}
                    OpenModalFrameSelecionar={OpenModalFrameSelecionar}
                    imagemMergeFinal={imagemMergeFinal}
                />
                <ModalInstragramFrame open={openModalFrames} OpenClose={OpenModalFrameSelecionar} FrameSelecionado={AdicionaImagemFrame} temaRedeSocial={temaRedeSocial} />
                <ModalRecorteImagem open={openModalRecorte} OpenClose={OpenModalRecorte} imagemParaRecorte={imagemMergeFinal} SalvarImagemRecortada={SalvarImagemRecortada} temaRedeSocial={temaRedeSocial} />
            </Container>
        </Modal >
    );
}
export { ModalRedeSocial }