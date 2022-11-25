import { View, Text } from "react-native";
import React from "react";

export default function Clima({ cidade }) {


  const currentMonth = cidade.data.getMonth() + 1;

  return (
    <View style={{ margin: 10, padding: 10, borderWidth: 4, borderRadius: 10, borderColor: '#1D82D1' }}>
      <View style={{ display: "flex", alignItems: "center", fontWeight: 'bold' }}>
        <Text style={{ fontSize: 20 }}>
          {cidade.data.getDate() +
            "/" +
            currentMonth +
            "/" +
            cidade.data.getFullYear() +
            " " +
            cidade.data.getHours() +
            ":" +
            cidade.data.getMinutes()}
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-around",
          marginTop: 10,
          padding: 0
        }}
      >
        <View>
          <img style={{ with: 140, height: 140 }}
            src={"http://openweathermap.org/img/wn/" + cidade.icone + "@2x.png"} />
          <Text style={{ textAlign: 'center', fontSize: 20 }}>{cidade.descricao}</Text>
        </View>
        <View style={{ justifyContent: "center" }}>
          <Text style={{ fontSize: 20 }}>Temp. Max: {Math.round(cidade.temperaturaMaxima, 1)} °C</Text>
        </View>
        <View style={{ justifyContent: "center" }}>
          <Text style={{ fontSize: 20 }}>Temp. Min: {Math.round(cidade.temperaturaMinima)} °C</Text>
        </View>
      </View>
    </View>
  );
}
