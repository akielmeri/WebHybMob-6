import React, { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, Text } from "react-native";
import PriceCard from "./components/PriceCard";

const App = () => {
  const [todaysPrices, setTodaysPrices] = useState([]);
  const [currentPrice, setCurrentPrice] = useState({});
  const [highestPrice, setHighestPrice] = useState({});
  const [lowestPrice, setLowestPrice] = useState({});
  const [averagePrice, setAveragePrice] = useState(0);
  const currentDate = new Date().toISOString().slice(0, 10);
  const currentHour = new Date().getHours();
  const apiUrl = "https://api.porssisahko.net/v1/latest-prices.json";

  useEffect(() => {
    fetchLatestPrices();
  }, []);

  useEffect(() => {
    if (todaysPrices.length > 0) {
      calculateStats();
    }
  }, [todaysPrices]);

  const fetchLatestPrices = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      // muutetaan dataa hieman vertailun helpottamiseksi
      // päivämäärä muotoon yyy-mm-dd ja tunnit erikseen muodossa hh
      // hinta kahden desimaalin tarkkuuteen
      const formattedDataList = data.prices.map((item) => {
        const { formattedDate, hours: startHour } = parseDate(item.startDate);
        const { hours: endHour } = parseDate(item.endDate);

        return {
          date: formattedDate,
          startHour,
          endHour,
          price: item.price.toFixed(2),
        };
      });

      // haetaan vain tämän päivän hinnat
      const todaysPrices = formattedDataList.filter(
        (item) => item.date === currentDate
      );
      setTodaysPrices(todaysPrices);
    } catch (error) {
      console.error(error);
    }
  };

  // lasketaan hintatiedot
  const calculateStats = () => {
    // nykyinen hinta
    const currentPrice = todaysPrices.find(
      (item) => item.startHour == currentHour
    );
    setCurrentPrice(currentPrice);

    // matalin hinta
    const lowestPrice = todaysPrices.reduce((prev, current) =>
      parseFloat(prev.price) < parseFloat(current.price) ? prev : current
    );
    setLowestPrice(lowestPrice);

    // korkein hinta
    const highestPrice = todaysPrices.reduce((prev, current) =>
      parseFloat(prev.price) > parseFloat(current.price) ? prev : current
    );
    setHighestPrice(highestPrice);

    // keskiarvo
    const sum = todaysPrices.reduce(
      (acc, item) => acc + parseFloat(item.price),
      0
    );
    const averagePrice = (sum / todaysPrices.length).toFixed(2);
    setAveragePrice(averagePrice);
  };

  const parseDate = (dateString) => {
    const date = new Date(dateString);

    // yyyy-mm-dd formaatti vertailua varten
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    // tunnit muodossa hh, käytetään hintojen hakuun ja printataan käyttäjälle
    const hours = String(date.getHours()).padStart(2, "0");

    // pitkä muoto päivämäärästä, käytetään käyttäjälle printtaamiseen
    const longDate = date.toLocaleDateString("fi-FI", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return {
      formattedDate,
      hours,
      longDate,
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Pörssisähkön hintatiedot</Text>
        <Text style={styles.date}>{parseDate(new Date()).longDate}</Text>

        <PriceCard title="Nykyinen hinta" priceData={currentPrice} />
        <PriceCard title="Alin hinta tänään" priceData={lowestPrice} />
        <PriceCard title="Korkein hinta tänään" priceData={highestPrice} />
        <PriceCard title="Vuorokauden keskiarvo" priceData={averagePrice} />
      </View>
      <Text style={styles.sourceText}>Lähde: https://porssisahko.net/api </Text>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    marginTop: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  date: {
    fontSize: 20,
    color: "#555",
    marginBottom: 20,
  },
  sourceText: {
    fontSize: 14,
    color: "#555",
    marginTop: 20,
  },
});
