import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button, ListItem } from '@rneui/base'
import { ListItemContent } from '@rneui/base/dist/ListItem/ListItem.Content'
import background from '../img/rainy-day-behind-window.jpg';


const obterHistorico = () => {
    return axios.get('https://g10c8b6cd02b6ff-ooap2xcgl6ldo9nh.adb.sa-saopaulo-1.oraclecloudapps.com/ords/admin/historico/')
}

const ClimaHistorico = () => {


    //obtendo histórico
    const [itens, setItens] = useState([])
    useEffect(() => {
        const obter = async () => {
            const resultado = (await obterHistorico()).data.items
            setItens(resultado)
        }
        obter()
    }, [])


    return (
        <View style={{ width: "100%", backgroundImage: `url(${background})` }}>
            <Text style={{ padding: 14, fontSize: 30, textAlign: 'center', fontWeight: 'bold', color: 'white' }}>Histórico</Text>



            <FlatList
               
                data={itens}
                keyExtractor={(item) => item.cidade}
                renderItem={({ item }) => (
                    <ListItem containerStyle={styles.listItemContainer}>
                        <ListItem.Content >
                            <Text style={styles.text}>
                                <Text style={styles.data}>{item.data_historico}</Text>  <Text style={styles.cidade}>{item.cidade}</Text>
                            </Text>
                        </ListItem.Content>
                    </ListItem>
                )}
            />
        </View >
    )
}

export default ClimaHistorico




export const styles = StyleSheet.create({
    container: {
        textAlign: 'center'
    },
    listItemContainer: {
        backgroundColor: 'rgba(90, 154, 230, 1)',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,

        width: 400,
        marginLeft: 470,
        marginBottom: 30,

        marginTop: 30
    },
    cidade: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 20
    },

});