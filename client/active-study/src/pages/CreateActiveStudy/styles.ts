import { styled } from "styled-components";

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh; /* Ensure the wrapper takes the full height of the viewport */
`;


export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh; /* Ensure the container takes the full height of the viewport */
    align-items: center; /* Center horizontally */
    justify-content: center; /* Center vertically */
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 300px;
    gap: 10px;
`;

export const Input = styled.input`
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
`;

export const TextArea = styled.textarea`
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
`;

export const Button = styled.button`
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    background-color: #eee;
    cursor: pointer;
    &:hover {
        background-color: #ddd;
    }
`;