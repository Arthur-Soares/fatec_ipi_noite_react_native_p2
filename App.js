import { StyleSheet, TextInput, FlatList, Alert, Text, ScrollView } from 'react-native';
import React, { useState, useEffect } from "react";
import { Tab, TabView, Button, ListItem, Image } from "@rneui/themed";
import PesquisaClima from "./telas/PesquisaClimaTela";
import styles from "./telas/styles"
import background from './img/rainy-day-behind-window.jpg';





export default function App() {

  //Variavel de estado do Histórico, sempre que o App for carregado um Hook chamara o histórico na tela histórico
  useEffect(() => {
    getHistorico();
  }, []);

  const [index, setIndex] = useState(0);

  const capturarTexto = (cidadeDigitada) => {
    setCidade(cidadeDigitada);
  };

  //variaveis de inserção
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
      });

  };


  const criarHistorico = (model) => {

    //criando o REQUEST para fazer o post com os dados da cidade e a data da pesquisa
    const mes = model.data.getMonth() + 1; //mes +1 pois o metodo getMonth tras o index dos meses começando em ZERO
    const request = {
      cidade: model.cidade,
      data_historico: model.data.getDate() + "/" + mes + "/" + model.data.getFullYear(),

    };

    const url =
      "https://g10c8b6cd02b6ff-ooap2xcgl6ldo9nh.adb.sa-saopaulo-1.oraclecloudapps.com/ords/admin/historico/";

    //realizando o POST com o método Fetch na oracle cloud
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }).then((data) => {
      //depois que o post for realizado chamar a função getHistórico para que seja atualizada a lista
      getHistorico();
    });
  };


  //trazendo os dados da oracle cloud com método fetch 
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
            <Text style={styles.tituloPag}>Bem vindo ao projeto Clima-Histórico!</Text>
            <TextInput
              gti
              style={styles.input}
              placeholder="Digite uma cidade..."
              onChangeText={capturarTexto}
              value={cidade}
            />
            <Button
              buttonStyle={styles.btn}
              containerStyle={styles.cont}
              title="Pesquisar"
              onPress={() => getCidade(cidade)}
            />

            {cidadeEscolhida && <PesquisaClima cidade={cidadeEscolhida} />}
          </ScrollView>
        </TabView.Item>



        <TabView.Item style={{ width: "100%", backgroundColor: "rgba(90, 154, 230, 1)" }}>
          <ScrollView>
            <Text style={styles.tituloPag}>Histórico</Text>
            <FlatList

              data={historico}
              keyExtractor={(item) => item.cod_historico}
              renderItem={({ item }) => (

                <ListItem containerStyle={styles.listItemContainer}>
                  <ListItem.Content>
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