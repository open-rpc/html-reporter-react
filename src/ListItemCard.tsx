import { Card, Group, Pill, Text, UnstyledButton } from '@mantine/core';
import DisplayTimeInSeconds from './DisplayTimeInSeconds';
import CheckIcon from './CheckIcon';
import XIcon from './XIcon';

const ListItemCard = ({ item, onClick }: any) => {
  return (
    <Card>
      <Card.Section>
        <UnstyledButton style={{ width: '100%', cursor: 'pointer' }} onClick={onClick}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '80px',
              padding: '10px',
              maxWidth: '100%',
            }}
          >
            <div style={{display: 'flex', paddingRight: '5px', flex: '4' }}>
              {item.valid && <CheckIcon style={{paddingRight: '5px', height: '24px', width: '24px'}}/>}
              {!item.valid && <XIcon style={{paddingRight: '5px', height: '24px', width: '24px'}}/>}
              <Text style={{textOverflow: 'ellipsis' }}>{item.title} </Text>
            </div>
            <Group style={{flex: '1', justifyContent: 'flex-end'}}>
              <Pill>{item.methodName}</Pill>
              <DisplayTimeInSeconds style={{width: '52px', textAlign: 'right'}} time={(item.timings.endTime - item.timings.startTime) / 1000} />
            </Group>
          </div>
        </UnstyledButton>
      </Card.Section>
    </Card>
  );
};

export default ListItemCard;
