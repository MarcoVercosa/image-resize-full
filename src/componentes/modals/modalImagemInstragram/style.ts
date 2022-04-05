import styled from "styled-components"

export const Header = styled.header`
    width:80vw;

    div{
        display: flex;
        justify-content:space-between;
        margin-top: 15px;       
    

        h1{
            font-size: 25px;
        }
    }

`

export const AspectoImagem = styled.main`
    width:100%;
  
    div{
        display: flex;
        justify-content: center;
        align-items: center;
        align-self:center;  
        gap:10px  
    }

    p{
        text-align: center;
    }
`

export const Menu = styled.div`
    position: fixed; 
    top: 52%;
    left: 1%;
    background-color:#f9f9f9;
    padding: 10px;
    border-radius: 10px;
    border: 2px grey solid;
    z-index: 100;
    opacity: 0.2;
    transition: all 1s;

    &:hover{
        opacity:1;
    }
    div{
        display: flex;
    flex-direction: column;
        div{
            margin-top: 10px;
        }

    }

`
export const FecharMenu = styled.p`
    font-size: 40px;
    margin: 0px; 

    cursor: pointer;
    transition: all 1s;
    &:hover{
        background-color: #ccd6d2;
        border-radius: 25px;
        color:red;
    }

`

export const Mensagem = styled.article`
display: flex;
    margin:0 auto;
    margin-top: 60px;
    width: 80vw;
    justify-content: center;


    div{
        display: flex;
        flex-direction: column;
        text-align: center;
        background-color: #d1cdd0;
        padding: 15px;
        border-radius: 15px;

        p{
            color: #2a2631
        }
    }
`

export const EdicaoImagem = styled.main`
    display: flex;
    justify-content:center;

    div{
        /* height: 50vh;
        width: 50vw; */

        margin-top:30px;
        //background-color: red;
        display:flex;
        //justify-content: center;
        

        img{
            /* width: 85%;
            height: 85% */
            /* width: auto;
            height: auto */
   
        }
    }

`
export const AdicionarEnviarBotoes = styled.main`
        margin-top: 100px;
        position:fixed;
    div{
        position:fixed;
        width: 100%;
        display: flex;
        justify-content: center;
        gap:40px;        
    }

`