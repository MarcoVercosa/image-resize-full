import styled from "styled-components"

export const Header = styled.header`
    width:70vw;

    div{
        display: flex;
        justify-content:space-between;
        align-items:center;
        width: 87vw;

        h1{
            font-size: 25px;    
            margin-left: 15px       
        }
        p{
            font-size: 30px;
            padding: 0;
            margin: 0px 0 0 0;
            cursor: pointer;
            &:hover{
                color: red
            }
        }
    }

`

export const ImagensFrame = styled.main`
    display: flex;
    justify-content: center;
    width:100%;
  
        div{
            display: flex;
            width: 55vw;
            height: 55vh;
      

            img{
                width: 100%;
                height: 100%
            }
        }

        p{
            text-align: center;
        }
`

export const EdicaoImagem = styled.main`
    display: flex;
    justify-content:center;

    div{
        /* height: 50vh;
        width: 50vw; */

        margin-top:30px;
        background-color: red;
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
        //margin-top: 40%;
    div{
        width: 100%;
        display: flex;
        justify-content: center;
        gap:40px;
        opacity: 0.3;
        transition: all 1s;      
        &:hover{
        opacity:1;
    }  
    }
   

`