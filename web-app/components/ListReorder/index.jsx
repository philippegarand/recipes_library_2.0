import React from 'react';
import { Typography } from '@material-ui/core';
import ListCard from './ListCard';
import {
  DragDropContext,
  Droppable,
  Draggable,
} from 'react-beautiful-dnd';
import Icon from '../Icon';

import styles from './ListReorder.module.css';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'gainsboro' : 'whitesmoke',
  borderRadius: '4px',
  padding: 8,
  width: 'calc(100% - 16px)',
});

export default function ListReorder(props) {
  const { className, title, items, onChange, errors } = props;

  const handleAdd = () => {
    onChange([...items, '']);
  };

  const handleRemove = (index) => {
    const temp = [...items];
    temp.splice(index, 1);
    onChange(temp);
  };

  const handleItemChange = (index, newVal) => {
    const temp = [...items];
    temp[index] = newVal;
    onChange(temp);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    onChange(
      reorder(items, result.source.index, result.destination.index),
    );
  };

  return (
    <div className={className}>
      <div className={styles.header}>
        <Typography variant="h5">{title}</Typography>
        <Icon
          className={styles.addBtn}
          icon="AddBoxIcon"
          color="primary"
          onClick={handleAdd}
        />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {items.map((item, index) => (
                <Draggable
                  key={`k-${index}`}
                  draggableId={`id-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <ListCard
                      refProp={provided.innerRef}
                      draggableProps={provided.draggableProps}
                      dragHandleProps={provided.dragHandleProps}
                      text={item}
                      index={index + 1}
                      onRemove={() => handleRemove(index)}
                      onChange={(newVal) =>
                        handleItemChange(index, newVal)
                      }
                      error={Boolean(errors ? errors[index] : false)}
                      helperText={errors ? errors[index] : ''}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
