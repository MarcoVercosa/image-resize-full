import styled from "styled-components"


export const MenuStyle: any = styled.div`
    position: fixed; 
    top: 70%;
    left: 1%;
    background-color:#f9f9f9;
    padding: 10px;
    border-radius: 10px;
    border: 2px grey solid;
    z-index: 100;
    opacity: 0.2;
    transition: all 1s;
    height: 80vh;
    overflow: scroll;
    scrollbar-width: thin;
    /* "auto" or "thin" */
    scrollbar-color: blue orange;
    /* scroll thumb and track */
  
    ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

    ::-webkit-scrollbar-thumb:vertical {
    background-color: ${(props: any) => props.temaRedeSocial};
    border-radius: 20px;
}

    &:hover{
        opacity:1;
    }
    div{
        display: flex;
    flex-direction: column;
        div{
            margin-top: 10px;
            p{
                font-family: 'Oswald', sans-serif;
                font-size: 20px;
                word-spacing: 1px;
                line-height: 5px;
            }
        }
    }

`

export const FecharMenu = styled.p`
    cursor: pointer;
    font-size: 40px;
    margin: 0 auto; 
    padding: 5px;
    transition: all 1s;
  
    &:hover{
          color:red;
    }
`