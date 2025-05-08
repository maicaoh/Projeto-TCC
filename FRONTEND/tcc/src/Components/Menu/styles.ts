import styled from 'styled-components'

export const MenuStyled = styled.div`
    div {
        color: ${(props) => props.theme['black-900']};;
        background-color: ${(props) => props.theme['green-50']};
        padding: 10px;
       
    }
  
`

export const MenuList = styled.div`
    background-color: #d3d3d3; /* Cor do fundo do bloco do menu */
    width: 100%;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    border-radius: 5px;
`
export const MenuItem = styled.button`
    width: 100%;
    background-color: white;
    border: none;
    padding: 0.8rem;
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #bbb; /* Efeito hover */
    }
`
export const Title = styled.h2`
    color: white;
    font-size: 1.2rem;
    text-align: center;
    font-weight: bold;
    margin: 0;
`
