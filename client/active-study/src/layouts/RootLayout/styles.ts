import { styled } from "styled-components";

export const StyledContainer = styled.div`

    *, *::before, *::after {
    box-sizing: border-box;
    }

    * {
    margin: 0;
    }

    html, body {
    height: 100%;
    }

    body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    }

    img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
    height: fit-content;
    }

    input, button, textarea, select {
    font: inherit;
    }

    p, h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
    }

    #root, #__next {
    isolation: isolate;
    }
    .content {
        min-height: 100vh !important;
    }
`;

