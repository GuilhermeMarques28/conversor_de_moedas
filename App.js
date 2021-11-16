import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import Picker from "./src/components";
import api from "./src/services/api";

export default function App() {
  const [moedas, setMoedas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [moedaSelecionada, setMoedaSelecionada] = useState(null);
  const [moedaBValor, setMoedaBValor] = useState(0);

  const [valorMoeda, setValorMoeda] = useState(null);
  const [valorConvertido, setValorConvertido] = useState(0);

  useEffect(() => {
    async function loadMoedas() {
      const response = await api.get("all");
      let arrayMoedas = [];
      Object.keys(response.data).map((key) =>
        arrayMoedas.push({
          key: key,
          label: key,
          value: key,
        })
      );
      setMoedas(arrayMoedas);
      setLoading(false);
    }
    loadMoedas();
  }, []);

  async function converter() {
    if (moedaSelecionada == null || moedaBValor === 0) {
      alert("Selecione uma moeda");
      return;
    }

    const response = await api.get(`all/${moedaSelecionada}-BRL`);

    let resultado =
      response.data[moedaSelecionada].ask * parseFloat(moedaBValor);
    setValorConvertido(`R$ ${resultado.toFixed(2)}`);
    setValorMoeda(moedaBValor);

    Keyboard.dismiss();
  }

  if (loading) {
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <ActivityIndicator color="#fff" size={45} />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <StatusBar />
        <View style={styles.areaMoeda}>
          <Text style={styles.titulo}>Selecione sua Moeda</Text>
          <Picker
            moedas={moedas}
            onChange={(moeda) => setMoedaSelecionada(moeda)}
          />
        </View>

        <View style={styles.areaValor}>
          <Text style={styles.titulo}>
            Digite um valor para converter em (R$)
          </Text>
          <TextInput
            keyboardType="numeric"
            style={styles.input}
            placeholder="EX: 150"
            onChangeText={(valor) => setMoedaBValor(valor)}
          />
        </View>

        <TouchableOpacity style={styles.buttonArea} onPress={converter}>
          <Text style={styles.buttonTexto}>Converter</Text>
        </TouchableOpacity>

        {valorConvertido !== 0 && (
          <View style={styles.areaResultados}>
            <Text style={styles.valorConvertido}>
              {valorMoeda} {moedaSelecionada}
            </Text>
            <Text
              style={([styles.valorConvertido], { fontSize: 18, margin: 10 })}
            >
              Corresponde a :
            </Text>
            <Text style={styles.valorConvertido}>{valorConvertido}</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#101215",
    paddingTop: 40,
  },
  areaMoeda: {
    width: "90%",
    backgroundColor: "#f9f9f9",
    paddingTop: 9,
    borderRadius: 9,
    marginBottom: 1,
  },
  titulo: {
    fontSize: 15,
    color: "#000",
    paddingTop: 5,
    paddingLeft: 5,
  },
  areaValor: {
    width: "90%",
    backgroundColor: "#f9f9f9",
    paddingTop: 9,
    borderRadius: 9,
    paddingBottom: 9,
    paddingTop: 9,
    marginTop: 2,
  },
  input: {
    width: "100%",
    padding: 10,
    height: 45,
    fontSize: 20,
    marginTop: 8,
    color: "#000",
  },
  buttonArea: {
    width: "90%",
    backgroundColor: "#FB4b57",
    height: 45,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 9,
  },
  buttonTexto: {
    fontSize: 17,
    color: "#fff",
    fontWeight: "bold",
  },
  areaResultados: {
    width: "90%",
    backgroundColor: "#FFF",
    marginTop: 35,
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
    borderRadius: 9,
  },
  valorConvertido: {
    fontSize: 39,
    fontWeight: "bold",
    color: "#000",
  },
});
