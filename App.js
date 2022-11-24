import { StyleSheet, TextInput, StatusBar, Alert, ScrollView, Text } from 'react-native';

import React, { useState, useEffect } from "react";
import { Tab, TabView, Button, ListItem, Image } from "@rneui/themed";
import PesquisaClima from "./telas/PesquisaClimaTela";
import ClimaHistorico from './telas/ClimaHistorico';

import background from './img/rainy-day-behind-window.jpg';
import background2 from './img/rain-animated.jpg';


import axios from 'axios'

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
    //const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=0a2f38e7438699b0ead786a746a9d6fb&units=metric&lang=pt`;
    //const url = `https://api.openweathermap.org/geo/1.0/direct?q=${cidade}&limit=1`;
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




        const date = new Date();
        const hoje = date.toLocaleDateString('pt-BR').toString();

        //link para envio do POST para gravar a cidade e a data da pesquisa
        axios.post(`https://g10c8b6cd02b6ff-ooap2xcgl6ldo9nh.adb.sa-saopaulo-1.oraclecloudapps.com/ords/admin/historico/?cidade=${cidade}&data_historico=${hoje}`
        )

      })
      .catch(() => {
        Alert.alert("Erro", "Não foi possivel carregar os dados dessa cidade");
      });
  };

  const criarHistorico = (model) => {
    const request = {
      cidade: model.cidade,
      data: model.data.getDate() + "/" + model.data.getMonth(),
      link: null, //colocar o link do icone posteriormente
    };

    const url =
      "https://g6ca8cb0cf67636-pessoahobbiesrest.adb.sa-saopaulo-1.oraclecloudapps.com/ords/admin/bossini/";

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
      "https://g6ca8cb0cf67636-pessoahobbiesrest.adb.sa-saopaulo-1.oraclecloudapps.com/ords/admin/bossini/";

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
          height: 3,
        }}
        variant="primary"
      >
        <Tab.Item title="Pesquisar" titleStyle={{ fontSize: 16 }} />
        <Tab.Item title="Histórico" titleStyle={{ fontSize: 16 }} />
      </Tab>

      <TabView value={index} onChange={setIndex} animationType="spring">
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

        <TabView.Item style={{ width: "100%" }}>
          <ScrollView>
            
             <ClimaHistorico />
            

          </ScrollView>
        </TabView.Item>
      </TabView>
    </>
  );
}

