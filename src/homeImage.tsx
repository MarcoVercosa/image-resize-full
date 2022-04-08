import React, { useState } from 'react';
import Button from '@mui/material/Button';
import ImageInstagramIcon from "./assets/images/instagram.png"
import ImageFaceBookIcon from "./assets/images/facebook.png"
import { ModalRedeSocial } from './componentes/modals/modalImagemRedeSocial';
import { ContainerHead, ContainerDivButtons, ButtonInstagram } from "./style"

function HomeImage(): JSX.Element {

  const [openModalRedeSocial, setOpenModalRedeSocial] = useState<boolean>(false)
  const [temaRedeSocial, setTemaRedeSocial] = useState<string>("")

  function OpenCloseModalRedeSocial(tema: string): void {
    setTemaRedeSocial(tema)
    setOpenModalRedeSocial(!openModalRedeSocial)
  }
  return (
    <>
      <ContainerHead>
        <h1>Imagem para redes Sociais</h1>

      </ContainerHead>

      <ContainerDivButtons>
        <Button variant="contained" style={{ backgroundColor: "#c13996" }}
          onClick={() => OpenCloseModalRedeSocial("#c13996")}
        >
          <img src={ImageInstagramIcon} />
          Editar foto Instagram
        </Button>
        <Button variant="contained" style={{ backgroundColor: "#264eb0" }}
          onClick={() => OpenCloseModalRedeSocial("#264eb0")}
        >
          <img src={ImageFaceBookIcon} />
          Editar foto FaceBook
        </Button>
        <ModalRedeSocial open={openModalRedeSocial} OpenClose={OpenCloseModalRedeSocial} temaRedeSocial={temaRedeSocial} />
      </ContainerDivButtons>
    </>
  );
}
export { HomeImage }
