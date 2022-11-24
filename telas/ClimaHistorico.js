import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ListItem } from '@rneui/base'
import { ListItemContent } from '@rneui/base/dist/ListItem/ListItem.Content'

const obterHistorico = () => {
    return axios.get('https://g10c8b6cd02b6ff-ooap2xcgl6ldo9nh.adb.sa-saopaulo-1.oraclecloudapps.com/ords/admin/historico/')
}

const ClimaHistorico = () => {


    const [itens, setItens] = useState([])
    useEffect(() => {
        const obter = async () => {
            const resultado = (await obterHistorico()).data.items
            setItens(resultado)
        }
        obter()
    }, [])


    const DATA = itens;




    return (
        <View>
            {
                DATA.map((itens) => (
                    <ListItem key={itens}>
                        <ListItemContent>

                            <ListItem.Title>{itens.cidade}</ListItem.Title>
                            <ListItem.Subtitle>{itens.data_historico}</ListItem.Subtitle>


                        </ListItemContent>

                    </ListItem>
                ))
            }
        </View >
    )
}

export default ClimaHistorico

const styles = StyleSheet.create({})