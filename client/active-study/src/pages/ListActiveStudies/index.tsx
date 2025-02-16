import { ButtonOptions, Container, List, ListItem } from "./styles";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export const ListActiveStudies = () => {
    const data = [
    { id: 1, name: 'Study 1' },
    { id: 2, name: 'Study 2' },
    { id: 3, name: 'Study 3' },
    ]

  return (
    <Container>
      <List>
        {data.map((study) => (
            <ListItem key={study.id}>
                <div>
                {study.name} <br/>
                {study.name} <br/>
                {study.name} <br/>
                {study.name} <br/>
                </div>
                <ButtonOptions>
                    <MoreHorizIcon />
                </ButtonOptions>
            </ListItem>
        ))}
      </List>
    </Container>
  );
};