import { FaCheck } from 'react-icons/fa6';
import { INCLUDED } from '../../constants/included';
import { Item, List } from './styles';

const IncludedList = () => (
  <List>
    {INCLUDED.map((item) => (
      <Item key={item}>
        <FaCheck aria-hidden /> {item}
      </Item>
    ))}
  </List>
);

export default IncludedList;
