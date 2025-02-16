import { Button, Container, Form, Input, TextArea } from "./styles";

export const CreateActiveStudy = () => {
    return (
        <Container>
            <h2>Create Active Study</h2>
            <Form>
                <Input placeholder="Name" />
                <TextArea placeholder="Description" />
                <Button>Create</Button>
            </Form>
        </Container>
    );
};