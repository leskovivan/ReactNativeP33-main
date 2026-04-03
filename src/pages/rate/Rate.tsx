import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import RateStyle from "./ui/RateStyle";
import { useEffect, useState } from "react";
import INbuRate from "../../entities/NbuRate/model/INbuRate";
import NbuRateApi from "../../entities/NbuRate/api/NbuRateApi";
import DatePicker from "react-native-date-picker";

export default function Rate() {
    const [rates, setRates] = useState<Array<INbuRate>>([]);
    const [shownRates, setShownRates] = useState<Array<INbuRate>>([]);
    const [date, setDate] = useState<Date>(new Date());
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        NbuRateApi.getCurrentRates().then(setRates);
    }, []);

    useEffect(() => {
        if(search.length > 0) {
            setShownRates(rates.filter(r => r.cc.includes(search)));
        }
        else {
            setShownRates(rates);
        }
    }, [search, rates]);

    return <View style={RateStyle.pageContainer}>

        <View style={RateStyle.pageTitleRow}>
            <TextInput 
                style={RateStyle.search}
                value={search}
                onChangeText={setSearch}/> 

            <Text style={RateStyle.pageTitle}>Курси НБУ</Text>

            <TouchableOpacity onPress={() => setOpen(true)}>
                <Text style={RateStyle.titleDate}>{date.toDotted()}</Text>
            </TouchableOpacity>
        </View>        

        <ScrollView>
            {shownRates.map((rate, i) => <View key={rate.cc} 
                style={[RateStyle.rateLine, 
                    (i & 1 ? RateStyle.rateLineOdd : RateStyle.rateLineEven)]}>
                <Text style={RateStyle.rateCc}>{rate.cc}</Text>
                <Text style={RateStyle.rateTxt}>{rate.txt}</Text>
                <Text style={RateStyle.rateRate}>{rate.rate}</Text>
            </View>)}
        </ScrollView>

        <DatePicker
            modal
            mode="date"
            open={open}
            date={date}
            onConfirm={(date) => {
                setOpen(false);
                setDate(date);
            }}
            onCancel={() => {
                setOpen(false);
            }}
        />

    </View>;
}

/*
Д.З. Реалізувати фільтр курсів валют 
з урахуванням збігів не лише за скороченням, 
а й за повною назвою
Переконатись у реєстронезалежності
*/