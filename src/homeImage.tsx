import React, { useState } from 'react';
import Button from '@mui/material/Button';
import ImageInstagramIcon from "./assets/images/instagram.png"
import ImageFaceBookIcon from "./assets/images/facebook.png"
import { ModalInstragram } from './componentes/modals/modalImagemInstragram';
import { ContainerHead, ContainerDivButtons, ButtonInstagram } from "./style"

function HomeImage() {

  const [openModalInstagram, setOpenModalInstagram] = useState<boolean>(false)
  const [openModalFacebook, setOpenModalFacebook] = useState<boolean>(false)
  const [temaRedeSocial, setTemaRedeSocial] = useState<string>("")

  function OpenCloseModalInstagram(tema: string) {
    setTemaRedeSocial(tema)
    setOpenModalInstagram(!openModalInstagram)
  }

  return (

    <>
      <ContainerHead>
        <h1>Imagem para redes Sociais</h1>

      </ContainerHead>

      <ContainerDivButtons>
        <Button variant="contained" style={{ backgroundColor: "#c13996" }}
          onClick={() => OpenCloseModalInstagram("#c13996")}
        >
          <img src={ImageInstagramIcon} />
          Editar foto Instagram
        </Button>
        <Button variant="contained" style={{ backgroundColor: "#264eb0" }}
          onClick={() => OpenCloseModalInstagram("#264eb0")}
        >
          <img src={ImageFaceBookIcon} />
          Editar foto FaceBook
        </Button>
        <ModalInstragram open={openModalInstagram} OpenClose={OpenCloseModalInstagram} temaRedeSocial={temaRedeSocial} />
      </ContainerDivButtons>
    </>
  );
}

export { HomeImage }
