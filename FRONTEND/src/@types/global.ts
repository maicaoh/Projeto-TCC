import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    :focus{
        outline: 0;
        box-shadow: 0 0 0 0px ${props => props.theme['green-500']};
    }

    body {
        background: ${props => props.theme['blue-200']};
        color: ${props => props.theme['gray-600']};
        -webkit-font-smoothing: antialiased;
    }

    body,border-style, input, textarea, button {
        font-family: 'Roboto', sans-serif;
        font-weight: 400;
        font-size: 1rem;
    }






`
