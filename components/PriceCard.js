import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PriceCard = ({ title, priceData }) => {
  // tarkistetaan onko priceData objekti vai pelkkä numero (keskiarvo)
  const priceValue =
    typeof priceData === "object"
      ? parseFloat(priceData.price)
      : parseFloat(priceData); //keskiarvo on jo numero

  // jos priceData on objekti, luodaan kellonaikaväli
  const timeString =
    typeof priceData === "object"
      ? `Kello: ${priceData.startHour}-${priceData.endHour}`
      : null; // keskiarvolla ei ole kellonaikaa

  // kortin väri hintatason mukaan
  const backgroundColor =
    priceValue < 5
      ? "#d4edda"
      : priceValue >= 5 && priceValue <= 15
      ? "#fff3cd"
      : "#f8d7da";

  return (
    <View style={[styles.card, { backgroundColor }]}>
      <Text style={styles.title}>{title}</Text>
      {timeString && <Text style={styles.time}>{timeString}</Text>}
      <Text style={styles.price}>{priceValue} c/kWh</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  time: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default PriceCard;
