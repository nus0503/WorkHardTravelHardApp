import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from './colors';
import { AntDesign, MaterialIcons } from '@expo/vector-icons'; 
import {Edit} from './src/components/Edit';

const STORAGE_KEY = "@toDos";
const WORK_STORAGE_KEY = "@work";

export default function App() {
  const [working, setWorking] = useState(true);
  console.log(working);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [done, setDone] = useState(false);
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    loadToDos();
    loadWork();
  }, []);
  useEffect(() => {
    saveWork();
  }, [working]);
  const travel = () => {
    setWorking(false);
    //saveWork();
  };
  const work = () => {
    setWorking(true);
    //saveWork();
  };
  const onChangeText = (payload) => setText(payload);
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const saveWork = async () => {
    await AsyncStorage.setItem(WORK_STORAGE_KEY, working.toString());
  };
  const loadWork = async () => {
    const s = await AsyncStorage.getItem(WORK_STORAGE_KEY);
    const convertBool = (s.toLowerCase() === 'true');
    setWorking(convertBool);
  }
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    console.log("a");
    setToDos(JSON.parse(s));
  };
  const updateText = () => {

  };
  console.log("a");
  const addToDo = async () => {
    if (text === "") {
      return;
    }
    const newToDos = Object.assign({}, toDos, {[Date.now()] : {text, working, done, edit}});
    console.log(newToDos);
    //                                     ↕

    //const newToDos = {
    //  ...toDos,
    //  [Date.now()] : {text, work : working}  
    //};
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  const complete = (key) => {
    const completeToDo = {...toDos};
    if (completeToDo[key].done === false) {
      completeToDo[key].done = true;
      console.log(completeToDo[key]);
      setToDos(completeToDo);
      saveToDos(completeToDo);
    } else {
      completeToDo[key].done = false;
      console.log(completeToDo[key]);
      setToDos(completeToDo);
      saveToDos(completeToDo);
    };
  };
  const deleteToDo = (key) => {
    Alert.alert("Delete To Do", "Are you Sure?", [
      {text : "Cancel"},
      {text : "Ok",
      style : 'destructive',
      onPress : async () => {
        const newToDos = {...toDos};
        delete newToDos[key]
        setToDos(newToDos);
        saveToDos(newToDos);
        
      }},
    ]);
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color : working ? "white" : theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color : !working ? "white" : theme.grey}}>Travel</Text>
        </TouchableOpacity>
      </View>
        <TextInput 
        returnKeyType='done' 
        onSubmitEditing={addToDo} 
        value={text} 
        onChangeText={onChangeText} 
        placeholder={working ? "Add a To Do" : "Where do you want to go"} 
        style={styles.input} />
      <ScrollView>
        {
        Object.keys(toDos).map((key) => (
        toDos[key].working === working ? 
       // console.log(key)
        //<Edit key={key} item={key.text} />
        <View style={styles.toDo} key={key}>
        <View>
        <Text selectable={true} style={toDos[key].done === true ? {...styles.toDoText, textDecorationLine : 'line-through'} : styles.toDoText}>{toDos[key].text}</Text>
        </View>
        <View style={{flexDirection : 'row'}}>
        <TouchableOpacity onPress={() => editingText(key)}>
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
        : null
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor : theme.bg,
    paddingHorizontal : 20,
  },
  header : {
    justifyContent : "space-between",
    flexDirection : "row",
    marginTop : 100
  },
  btnText : {
    fontSize : 38,
    fontWeight : '600',
  },
  input : {
    backgroundColor : "white",
    paddingVertical : 15,
    paddingHorizontal : 20,
    borderRadius : 30,
    marginVertical : 20,
    fontSize: 18,
  },
  toDo : {
    backgroundColor : theme.grey,
    marginBottom : 10,
    paddingVertical : 20,
    paddingHorizontal: 20,
    borderRadius : 15,
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'space-between'
  },
  toDoText : {
    color : "white",
    fontSize : 16,
    fontWeight : '500',
  }
});