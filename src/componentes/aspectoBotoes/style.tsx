import styled from "styled-components"

const AspectoImagem: any = styled.main`
      
div{
    display: flex;
    justify-content: center;
    align-items: center;
    align-self:center;  
    gap:10px  
}

p{
    text-align: center;
    font-family: 'Oswald', sans-serif;
    font-size: 35px;
    color: ${(props: any) => props.temaRedeSocial}
  
}
`
export { AspectoImagem }