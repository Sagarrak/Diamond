// import { useState, useEffect } from "react";
// import getSymbolFromCurrency from 'currency-symbol-map'
// import axios from "axios";
// import { useQuery } from 'react-apollo';
import CurrencySymbolContext from "./CurrencySymbolContext";
// import { GET_CURRENCY_EXCHANGE_RATE } from "../ui/components/Session/queries";

function CurrencySymbolState(props) {
    // const [symbol, setSymbol] = useState(localStorage.getItem('symbol'));
    // const [locationData, setLocationData] = useState("");
    // const [currency, setCurrency] = useState(localStorage.getItem('currency'));

    // const getLocalSymbol = localStorage.getItem('symbol');
    // const getLocalCurrency = localStorage.getItem('currency');

    // useEffect(async () => {
    //     await axios.get("https://ipapi.co/json/").then((res) => {
    //         const currencySymbol = getSymbolFromCurrency(res?.data?.currency);
    //         setLocationData(res?.data);
    //         setSymbol(currencySymbol);
    //         setCurrency(res?.data?.currency);
    //         localStorage.setItem('symbol', currencySymbol);
    //         localStorage.setItem('currency', res?.data?.currency);
    //     }).catch(async (err) => {
    //         setErr(err);
    //     })
    // }, [getLocalSymbol !== "", getLocalCurrency !== ""]);


    // ** Query
    // const {
    //     loading: GetCurrencyExchangeRateLoading,
    //     data: GetCurrencyExchangeRateData,
    //     refetch: GetCurrencyExchangeRateRefetch,
    // } = useQuery(GET_CURRENCY_EXCHANGE_RATE, {
    //     variables: {
    //         currency
    //     },
    //     fetchPolicy: "cache-and-network",
    // });
    // const currencyExRateData = GetCurrencyExchangeRateData;

    // const checkCalSym = currencyExRateData?.getCurrencyExchangeRate?.currency;
    // const currentCurrency = locationData?.currency;

    const changeOnCurrentCurrencyPrice = (USD) => {
        // if (checkCalSym) {
        //     return `${symbol}${Math.round(currencyExRateData?.getCurrencyExchangeRate?.exchangeRate * USD)}`;
        // }
        return `$${USD}`
    }

    // set static data
    let symbol = '$', currency = 'USD', currencyExRateData = 0, locationData = undefined;

    return (
        <CurrencySymbolContext.Provider value={{ symbol, currency, changeOnCurrentCurrencyPrice, currencyExRateData, locationData }}>
            {props.children}
        </CurrencySymbolContext.Provider>
    )
}

export default CurrencySymbolState;