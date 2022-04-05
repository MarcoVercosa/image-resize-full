import React, { useState } from 'react';
import Button from '@mui/material/Button';
import ImageInstagramIcon from "./assets/images/instagram.png"
import ImageFaceBookIcon from "./assets/images/facebook.png"
import { ModalInstragram } from './componentes/modals/modalImagemInstragram';
import { ContainerHead, ContainerDivButtons, ButtonInstagram } from "./style"

function HomeImage() {

  const [openModalInstagram, setOpenModalInstagram] = useState<boolean>(false)
  const [openModalFacebook, setOpenModalFacebook] = useState<boolean>(false)

  function OpenCloseModalInstagram() {
    setOpenModalInstagram(!openModalInstagram)
  }

  return (

    <>
      <ContainerHead>
        <h1>Imagem para redes Sociais</h1>

      </ContainerHead>

      <ContainerDivButtons>
        <Button variant="contained" style={{ backgroundColor: "#c13996" }}
          onClick={() => OpenCloseModalInstagram()}
        >
          <img src={ImageInstagramIcon} />
          Editar foto Instagram
        </Button>
        <Button variant="contained">
          <img src={ImageFaceBookIcon} />
          Editar foto FaceBook
        </Button>
        <ModalInstragram open={openModalInstagram} OpenClose={OpenCloseModalInstagram} />
      </ContainerDivButtons>
    </>
  );
}

export { HomeImage }
