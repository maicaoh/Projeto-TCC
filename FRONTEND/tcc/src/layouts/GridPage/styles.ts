import styled from 'styled-components'

export const GridLayout = styled.main`
    display: grid;
    grid-template-areas: "head head" 
    "menu aside";
    grid-template-columns: 20rem auto;
`

export const HeaderComponent = styled.header`
    grid-area: head;
    margin-bottom: 2rem;
`

export const MenuContainer = styled.aside`
    grid-area: menu;
    background-color: azure;
`
export const Aside = styled.main`
    grid-area: aside;
    background-color: transparent;
    height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

export const ContentLayout = styled.div`
    width: 100%;
    height: 100%;
    margin-left: 2rem;
    background-color: #C4C4CC;
`
