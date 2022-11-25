import { StyleSheet, TextInput, FlatList, Alert, Text, ScrollView } from 'react-native';

import React, { useState, useEffect } from "react";
import { Tab, TabView, Button, ListItem, Image } from "@rneui/themed";
import PesquisaClima from "./telas/PesquisaClimaTela";


import background from './img/rainy-day-behind-window.jpg';





export default function App() {




  useEffect(() => {
    getHistorico();
  }, []);





  const [index, setIndex] = useState(0);

  const capturarTexto = (cidadeDigitada) => {
    setCidade(cidadeDigitada);
  };
  const [cidade, setCidade] = useState("");
  const [cidadeEscolhida, setCidadeEscolhida] = useState(null);
  const [historico, setHistorico] = useState([]);







  const getCidade = (cidade) => {

    if (cidade == 'Salvador') {
      cidade += ',br'
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&APPID=fe1d134bae594b6a9e1bdbabb5f242c2&units=metric&lang=pt`;

    fetch(url)
      .then((resposta) => resposta.json())
      .then((json) => {
        const model = {
          cidade: json.name,
          temperaturaMaxima: json.main.temp_max,
          temperaturaMinima: json.main.temp_min,
          descricao: json.weather[0].description,
          icone: json.weather[0].icon,
          data: new Date(),
        };
        setCidadeEscolhida(model);
        criarHistorico(model);
      })
      .catch(() => {
        Alert.alert("Erro", "Não foi possivel carregar os dados dessa cidade");
      }).finally(


    );

  };


  const criarHistorico = (model) => {

    const mes = model.data.getMonth() + 1;

    const request = {


      cidade: model.cidade,
      data_historico: model.data.getDate() + "/" + mes + "/" + model.data.getFullYear(),

    };

    const url =
      "https://g10c8b6cd02b6ff-ooap2xcgl6ldo9nh.adb.sa-saopaulo-1.oraclecloudapps.com/ords/admin/historico/";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }).then((data) => {
      getHistorico();
    });
  };


  const getHistorico = () => {
    const url =
      "https://g10c8b6cd02b6ff-ooap2xcgl6ldo9nh.adb.sa-saopaulo-1.oraclecloudapps.com/ords/admin/historico/";

    fetch(url)
      .then((resposta) => resposta.json())
      .then((json) => {
        if (json.items.length > 0) {
          setHistorico(json.items.reverse());
        }
      });
  };





  return (
    <>
      <Tab
        value={index}
        onChange={(e) => setIndex(e)}
        indicatorStyle={{
          backgroundColor: "white",
          height: 1,
        }}
        variant="primary"
      >
        <Tab.Item title="Pesquisar" titleStyle={{ fontSize: 16 }} />
        <Tab.Item title="Histórico" titleStyle={{ fontSize: 16 }} />
      </Tab>

      <TabView value={index} onChange={setIndex} animationType="timing">
        <TabView.Item style={{ width: "100%", backgroundImage: `url(${background})` }}>
          <ScrollView>
            <Text style={{ padding: 14, fontSize: 30, textAlign: 'center', fontWeight: 'bold', color: 'white' }}>Bem vindo ao projeto Clima-Histórico!</Text>
            <TextInput
              gti
              style={{
                borderBottomColor: "#CCC",
                borderBottomWidth: 2,
                padding: 12,
                marginBottom: 4,
                marginHorizontal: 10,
                marginVertical: 10,
                width: "50%",
                alignSelf: 'center',
                fontSize: 18,
                color: 'white',
              }}
              placeholder="Digite uma cidade..."
              onChangeText={capturarTexto}
              value={cidade}
            />
            <Button
              buttonStyle={{
                backgroundColor: "rgba(90, 154, 230, 1)",
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 20,
                width: "20%",
                alignSelf: 'center'
              }}
              containerStyle={{
                marginHorizontal: 50,
                marginVertical: 10,
                paddingBottom: 40
              }}
              title="Pesquisar"
              onPress={() => getCidade(cidade)}
            />

            {cidadeEscolhida && <PesquisaClima cidade={cidadeEscolhida} />}
          </ScrollView>
        </TabView.Item>

        <TabView.Item style={{ width: "100%", backgroundColor: "rgba(90, 154, 230, 1)" }}>
          <ScrollView>
          <Text style={{ padding: 14, fontSize: 30, textAlign: 'center', fontWeight: 'bold', color: 'white' }}>Histórico</Text>
            <FlatList

              data={historico}
              keyExtractor={(item) => item.cod_historico}
              renderItem={({ item }) => (
                
                <ListItem containerStyle={styles.listItemContainer}>
                  <ListItem.Content  >
                    <Text style={styles.text}>

                      <Text style={styles.data}>{item.data_historico}</Text>
                      <Text style={styles.cidade}>{item.cidade}</Text>
                    </Text>
                  </ListItem.Content>
                </ListItem>
              )}
            />
          </ScrollView>

        </TabView.Item>
      </TabView>
    </>
  );
}




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
    marginLeft: 20,

    color: 'white'
  },
  data: {
    color: 'white'
  }

});
