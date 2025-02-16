import { styled } from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh; 
    align-items: center;
    justify-content: center;
`;

export const List = styled.div`
    min-width: 300px;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
`;

export const ListItem = styled.div`
    display: flex;
    flex-direction: row;
    border: 1px solid #ccc;
    border-radius: 10px;
    justify-content: space-between;
    padding: 10px;
    &:hover {
        background-color: #e9e9e9;
    }
`;

export const ButtonOptions = styled.div`
    margin-top: 10px;
    height: fit-content;
    border-radius: 5px;
    &:hover {
        background-color: #aaa;
        color: white;
    }
`;