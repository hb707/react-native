import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Pressable, TextInput, ScrollView, Vibration } from 'react-native';
import { theme } from './color'
import AsyncStorage from '@react-native-async-storage/async-storage';


const STORAGE_KEY = "@toDos"
const STORAGE_KEY_CUR = "@current"

export default function App() {
    const [working, setWorking] = useState(true);
    const [text, setText] = useState('')
    const [toDos, setToDos] = useState({})

    useEffect(() => {
        loadToDos()
    }, [])

    const travel = () => setWorking(false);
    const work = () => setWorking(true);
    const onChangeText = payload => setText(payload)

    const saveToDos = async (toSave) => {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    }

    const loadToDos = async () => {
        const item = await AsyncStorage.getItem(STORAGE_KEY)
        if (item) setToDos(JSON.parse(item))
    }

    const addToDo = async () => {
        if (text === '') return
        const newToDos = { ...toDos, [Date.now()]: { text, working } }
        setToDos(newToDos)
        await saveToDos(newToDos)
        setText('')
    }





    return (
        <View style={styles.container}>
            <StatusBar style='light' />
            <View style={styles.header}>
                <Pressable onPress={work}>
                    <Text style={{ ...styles.btnText, color: working ? 'white' : theme.grey }}>Work</Text>
                </Pressable>
                <Pressable onPress={travel}>
                    <Text style={{ ...styles.btnText, color: !working ? 'white' : theme.grey }}>Travel</Text>
                </Pressable>
            </View>
            <View>
                <TextInput
                    value={text}
                    onSubmitEditing={addToDo}
                    onChangeText={onChangeText}
                    style={styles.input}
                    placeholder={working ? 'Add a To Do' : 'Where do you want to go?'} />
            </View>
            <ScrollView>
                {Object.keys(toDos).map(key =>
                    toDos[key].working === working
                        ? (
                            <View key={key} style={styles.toDo}>
                                <Text style={styles.toDoText}>
                                    {toDos[key].text}
                                </Text>
                            </View>
                        )
                        : null
                )}
            </ScrollView>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        paddingHorizontal: 20
    },
    header: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 100
    },
    btnText: {
        fontSize: 44,
        fontWeight: '600',
        color: theme.grey
    },
    input: {
        backgroundColor: 'white',
        marginBottom: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginTop: 30,
        fontSize: 18
    },
    toDo: {
        backgroundColor: theme.toDoBg,
        marginBottom: 20,
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 15
    },
    toDoText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500'
    }
})