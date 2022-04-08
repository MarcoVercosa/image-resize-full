import styled from "styled-components"


export const Container: any = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 90vw;
    min-width: 90vw;
    height: 90vh;
    background-color: white;
    border: 2px solid #000;
    box-shadow: 24;
    border-radius: 7;
    overflow: auto;
    

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
  

`

export const Header: any = styled.header`
    width:90vw;
    margin: 0;

    div{
        display: flex;
        justify-content:space-around;
        align-items: center;
        //margin-top: 15px;  
        h1{

            font-size: 40px;
            font-family: 'Oswald', sans-serif;
            color: ${(props: any) => props.temaRedeSocial};
            margin: 0px;
            
        }
    }

`
// export const AspectoImagem: any = styled.main`

//     div{
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         align-self:center;  
//         gap:10px  
//     }

//     p{
//         text-align: center;
//         font-family: 'Oswald', sans-serif;
//         font-size: 35px;
//         color: ${(props: any) => props.temaRedeSocial}

//     }
// `

export const Menu: any = styled.div`
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

export const Mensagem: any = styled.article`
display: flex;
    margin:0 auto;
    margin-top: 60px;
    width: 80vw;
    justify-content: center;


    div{
        display: flex;
        flex-direction: column;
        text-align: center;
       //background-color: #d1cdd0;
        border: 2px  solid ${(props: any) => props.temaRedeSocial};;  
        padding: 15px;
        border-radius: 15px;
        background-color: ${(props: any) => props.temaRedeSocial == "#c13996" ? "#f5d9ec" : "#b5c5ee"};

        p{
            color: #2a2631;
            font-family: 'Oswald', sans-serif;
            font-size: 27px
        }
    }
`

export const EdicaoImagem = styled.main`
    display: flex;
    justify-content:center;

    div{
        /* height: 50vh;
        width: 50vw; */
        width: 90vw;

        margin-top:30px;
        //background-color: red;
        display:flex;
        justify-content: center;
                

        img{
            /* width: 85%;
            height: 85% */
            /* width: auto;
            height: auto */
            max-width: 100%;
            margin-left: 5px;
            border-radius: 5px
   
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