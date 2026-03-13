import { Text, View } from "react-native";
import CalcStyle from "./ui/CalcStyle";
import CalcButton from "./ui/CalcButton";
import { CalcButtonTypes } from "./model/CalcButtonTypes";
import { useState } from "react";
import { CalcOperations } from "./model/CalcOperations";
import MemoryButton from "./ui/MemoryButton";
import { MemoryButtonTypes } from "./model/MemoryButtonTypes";

const maxDigits = 20;
const dotSymbol = ",";
const minusSymbol = "\u2212";
const spaceSymbol = "\u2009";

const cleanString = (str: string): string => {
    return str.split(spaceSymbol).join('');
};

const countDigits = (str: string): number => {
    return str.replace(/[^0-9]/g, '').length;
};

const formatNumber = (str: string): string => {
    let isNegative = str.startsWith(minusSymbol);
    let workingStr = isNegative ? str.substring(minusSymbol.length) : str;
    
    let parts = workingStr.split(dotSymbol);
    let integerPart = parts[0];
    let fractionPart = parts.length > 1 ? dotSymbol + parts[1] : "";
    
    let formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, spaceSymbol);
    
    return (isNegative ? minusSymbol : "") + formattedInteger + fractionPart;
};

interface ICalcState {
    expression: string,
    result: string,
    isNeedClear: boolean,
    operation?: CalcOperations,
    prevArgument?: number,
    isNeedClearEntry: boolean,
};

const initCalcState:ICalcState = {
    expression: "",
    result: "0",
    isNeedClear: true,
    isNeedClearEntry: false,
}

export default function Calc() {
    const [calcState, setCalcState] = useState<ICalcState>(initCalcState);

    const equalClick = () => {
        if(!calcState.operation) return;
        setCalcState({...calcState,
            result: numToRes(
                calcState.operation == CalcOperations.add ? calcState.prevArgument! + resToNum(calcState.result)
              : calcState.operation == CalcOperations.sub ? calcState.prevArgument! - resToNum(calcState.result)
              : calcState.operation == CalcOperations.mul ? calcState.prevArgument! * resToNum(calcState.result)
              : calcState.operation == CalcOperations.div ? calcState.prevArgument! / resToNum(calcState.result)
              : NaN
            ),
            expression: `${calcState.expression} ${calcState.result} =`,
            operation: undefined,
            prevArgument: undefined,
            isNeedClear: true,
        });
    };
 
    const operButtonClick = (oper:CalcOperations, symbol:string) => {
        setCalcState({...calcState,
            operation: oper,
            expression: `${calcState.result} ${symbol}`,
            prevArgument: resToNum(calcState.result),
            isNeedClearEntry: true,
        })
    };

    const resToNum = (res:string):number => { 
        return Number(cleanString(res)
            .replace(dotSymbol, '.')
            .replace(minusSymbol, '-')
        );
    };

    const numToRes = (num:number):string => {
        let str = num.toString()
            .replace('.', dotSymbol)
            .replace('-', minusSymbol);
        return formatNumber(str);
    };

    const invClick = () => {
        let arg = resToNum(calcState.result);
        arg = 1.0 / arg;
        setCalcState({...calcState,
            result: numToRes(arg),
            expression: `1 / ${calcState.result} =`,
            isNeedClear: true
        });
    };

    const sqrClick = () => {
        let arg = resToNum(calcState.result);
        let res = arg * arg;
        setCalcState({
            ...calcState,
            result: numToRes(res),
            expression: `${calcState.result}² =`,
            isNeedClear: true
        });
    };

    const sqrtClick = () => {
        let arg = resToNum(calcState.result);
        if (arg < 0) {
            setCalcState({
                ...calcState,
                result: "Invalid Input",
                expression: `√(${calcState.result})`,
                isNeedClear: true
            });
            return;
        }
        let res = Math.sqrt(arg);
        setCalcState({
            ...calcState,
            result: numToRes(res),
            expression: `√(${calcState.result}) =`,
            isNeedClear: true
        });
    };

    const digitClick = (text:string) => {
        let res = calcState.isNeedClear || calcState.isNeedClearEntry ? "" : cleanString(calcState.result);
        if(res == '0') {
            res = '';
        }
        if(countDigits(res) < maxDigits) {
            res += text;
        }
        setCalcState({...calcState,
            result: formatNumber(res),
            expression: calcState.isNeedClear ? "" : calcState.expression,
            isNeedClear: false,
            isNeedClearEntry: false,
        });
    };

    const clearClick = () => {
        setCalcState(initCalcState);
    };

    const clearEntryClick = () => {
       setCalcState({...calcState,
            result: "0",
       });
    };

    const backspaceClick = () => {
        let clean = cleanString(calcState.result);
        if (clean.length <= 1) {
            setCalcState({...calcState, result: "0"});
            return;
        }
        let res = clean.substring(0, clean.length - 1);
        if(res == minusSymbol || res == "") {
            res = '0';
        }
        setCalcState({...calcState,
            result: formatNumber(res),
       });
    }

    const dotClick = (text:string) => {   // десятична точка: додається в кінець АЛЕ якщо її немає раніше
        let clean = "";
        if(calcState.isNeedClear || calcState.isNeedClearEntry) {
            clean = "0";
        } else {
            clean = cleanString(calcState.result);
        }

        if(!clean.includes(text)) {
            clean += text;
        }
        
        setCalcState({...calcState,
            result: formatNumber(clean),
            isNeedClear: false,
            isNeedClearEntry: false
        });
    };

    const pmClick = () => {   // зміна знаку: додається "-" до початку числа, якщо його немає, інакше прибирається
        let clean = cleanString(calcState.result);
        if(clean == '0') return;
        
        let res = clean.startsWith(minusSymbol)
        ? clean.substring(minusSymbol.length)
        : minusSymbol + clean;

        setCalcState({...calcState,
            result: formatNumber(res),
        });
    };

    const resultFontSize = calcState.result.length <= 11 ? 60.0 : 660.0 / calcState.result.length;

    return <View style={CalcStyle.pageContainer}>
        <Text style={CalcStyle.pageTitle}>Calculator</Text>
        <Text style={CalcStyle.expression}>{calcState.expression}</Text>
        <Text style={[CalcStyle.result, {fontSize: resultFontSize}]}>{calcState.result}</Text>
        <View style={CalcStyle.memoryRow}>
            {/* MC MR M+ M- MS Mv */}
            <MemoryButton text="MC" type={MemoryButtonTypes.disabled} />
            <MemoryButton text="MR" type={MemoryButtonTypes.disabled} />
            <MemoryButton text="M+" type={MemoryButtonTypes.enabled} />
            <MemoryButton text="M-" type={MemoryButtonTypes.enabled} />
            <MemoryButton text="MS" type={MemoryButtonTypes.enabled} />
            <MemoryButton text="Mv" type={MemoryButtonTypes.disabled} />
        </View>

        <View style={CalcStyle.keyboard}>
            <View style={CalcStyle.buttonsRow}>
                <CalcButton text="%" onPress={() => console.log("Press")}/>
                <CalcButton text="CE" onPress={clearEntryClick} />
                <CalcButton text="C" onPress={clearClick} />
                <CalcButton text={"\u232B"} onPress={backspaceClick}/>
            </View>
             <View style={CalcStyle.buttonsRow}>
                <CalcButton text={"\u00b9/\u2093"} onPress={invClick}/>
                <CalcButton text={"x\u00b2"} onPress={sqrClick} />
                <CalcButton text={"\u00B2\u221ax\u0305"} onPress={sqrtClick} />
                <CalcButton text={"\u00F7"} onPress={(face) => operButtonClick(CalcOperations.div, face)} />
            </View>
             <View style={CalcStyle.buttonsRow}>
                <CalcButton text="7" buttonType={CalcButtonTypes.digit} onPress={digitClick} />
                <CalcButton text="8" buttonType={CalcButtonTypes.digit} onPress={digitClick} />
                <CalcButton text="9" buttonType={CalcButtonTypes.digit} onPress={digitClick} />
                <CalcButton text={"\u00D7"} onPress={(face) => operButtonClick(CalcOperations.mul, face)}/>
            </View>
             <View style={CalcStyle.buttonsRow}>
                <CalcButton text="4" buttonType={CalcButtonTypes.digit} onPress={digitClick} />
                <CalcButton text="5" buttonType={CalcButtonTypes.digit} onPress={digitClick} />
                <CalcButton text="6" buttonType={CalcButtonTypes.digit} onPress={digitClick} />
                <CalcButton text={"\u2212"} onPress={(face) => operButtonClick(CalcOperations.sub, face)} />
            </View>
             <View style={CalcStyle.buttonsRow}>
                <CalcButton text="1" buttonType={CalcButtonTypes.digit} onPress={digitClick} />
                <CalcButton text="2" buttonType={CalcButtonTypes.digit} onPress={digitClick} />
                <CalcButton text="3" buttonType={CalcButtonTypes.digit} onPress={digitClick} />
                <CalcButton text={"\uFF0B"} onPress={(face) => operButtonClick(CalcOperations.add, face)}/>
            </View>
             <View style={CalcStyle.buttonsRow}>
                <CalcButton text={"\u207a\u2215\u208b"} buttonType={CalcButtonTypes.digit} onPress={pmClick} />
                <CalcButton text="0" buttonType={CalcButtonTypes.digit} onPress={digitClick} />
                <CalcButton text={dotSymbol} buttonType={CalcButtonTypes.digit} onPress={dotClick}/>
                <CalcButton text={"\uFF1D"} buttonType={CalcButtonTypes.equal} onPress={equalClick} />
            </View>
        </View>
    </View>;
}
/*
Д.З. Врахувати в обмеженні на кількість цифр на дисплеї
той факт, що знак числа ("-") не належить до цифр. 
Відповідно, за наявності знаку гранична кількість 
символів фактично збільшується. 
Так само символ точки (коми) не враховується в 
обмеженні кількості цифр. 
** забезпечити розділення розрядів числа пробілами
    (Юнікод - короткими пробілами), їх так само не
    враховувати в кількості цифр: 12 345 567.2
    (переконатись, що при стиранні цифр пробіли переставляються)
str = "Hello, World!"
str.substring(2) - "llo, World!"
str.substring(3,7) - "lo, "

Д.З. Реалізувати роботу кнопок калькулятора
піднесення до квадрату
корень з числа (з перевіркою на додатню величину)
Додавати скріншоти
*/