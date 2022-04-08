
export interface IModalInstragram {
    open: boolean;
    OpenClose: (value: string) => void;
    temaRedeSocial: string;
}
export interface IAspecto {
    width: number;
    height: number;
    nome: string
}
export interface IMovimentarImagem {
    XFrame: number,
    YFrame: number,
    opacityFrame: number,
    XImagem: number,
    YImagem: number,
    opacityImagem: number
}
export interface IFiltros {
    contraste: string,
    grayscale: string,
    sepia: string,
    inverter: string,
    blur: string,
    brilho: string
}
