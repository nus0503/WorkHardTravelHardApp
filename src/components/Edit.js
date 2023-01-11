import { useState } from 'react'

export const editing = ({ item }) => {
  const [text , setText] = useState(item.text);
  const [isEditing, setIsEditing] = useState(false);

  const updateButtonPress = () => {
    setIsEditing(ture);
  };

  const onSubmitEditing = (key) => {
    if (isEditing) {
      const editedText = Object.assign({}, item, {text});
      setIsEditing(false);
      setToDos(editedText);
      saveToDos(editedText);
    }
  };
  
  return(
    isEditing ? (
      <TextInput 
        returnKeyType='done' 
        onSubmitEditing={onSubmitEditing()} 
        value={text} 
        onChangeText={(text) => setText(text)}
        style={styles.toDo} />
    ) : (
        <View style={styles.toDo}>
        <View>
        <Text selectable={true} style={toDos[key].done === true ? {...styles.toDoText, textDecorationLine : 'line-through'} : styles.toDoText}>{toDos[key].text}</Text>
        </View>
        <View style={{flexDirection : 'row'}}>
        <TouchableOpacity onPress={() => updateButtonPress(item)}>
          <AntDesign name="edit" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => complete(key)}>
          <MaterialIcons name={toDos[key].done ? "remove-done" : "done"} size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteToDo(key)}>
          <AntDesign name="delete" size={24} color="white" />
        </TouchableOpacity>
        </View>
        </View>
))}