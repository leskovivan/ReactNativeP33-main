import { Animated, Pressable, Text, View } from "react-native";
import AnimStyle from "./ui/AnimStyle";
import { useRef } from "react";

// анімоване значення, величина якого буде змінюватись
// операційною системою пристрою. Розміщуємо поза функцією-компонентом
let fadeOutValue = new Animated.Value(1);

export default function Anim() {
    const fadeOutPress = () => {
        Animated.timing(fadeOutValue, {
            toValue: 0.09,
            useNativeDriver: true, 
            duration: 500,
        }).start();
    }; 

    // хук-референс, що дозволяє не змінювати об'єкт при
    // перезапуску функції
    const blinkValue = useRef(new Animated.Value(1.0)).current;
    const blinkPress = () => {
        Animated.sequence([
            Animated.timing(blinkValue, {
                toValue: 0.0,
                useNativeDriver: true, 
                duration: 500,
            }),
            Animated.timing(blinkValue, {
                toValue: 1.0,
                useNativeDriver: true, 
                duration: 500,
            })
        ]).start();
    };

    // анімації масштабу
    const scale1Value = useRef(new Animated.Value(1.0)).current;
    const scale1Press = () => {
        Animated.timing(scale1Value, {
            toValue: 0.8,
            useNativeDriver: true, 
            duration: 300,
        }).start();
    };
    const scale2Value = useRef(new Animated.Value(1.0)).current;
    const scale2Press = () => {
        Animated.timing(scale2Value, {
            toValue: 1.5,
            useNativeDriver: true, 
            duration: 300,
        }).start();
    };

    // Анімації зміщення (translation)
    const trans1xValue = useRef(new Animated.Value(0.0)).current;
    const trans1yValue = useRef(new Animated.Value(0.0)).current;
    const trans1Press = () => {
        Animated.parallel([
            Animated.sequence([
                Animated.timing(trans1xValue, {
                    toValue: 50.0,
                    useNativeDriver: true, 
                    duration: 300,
                }),
                Animated.timing(trans1xValue, {
                    toValue: -50.0,
                    useNativeDriver: true, 
                    duration: 600,
                }),
                Animated.timing(trans1xValue, {
                    toValue: 0.0,
                    useNativeDriver: true, 
                    duration: 300,
                }),
            ]),
            
            Animated.sequence([
                Animated.timing(trans1yValue, {
                    toValue: 50.0,
                    useNativeDriver: true, 
                    duration: 150,
                }),
                Animated.timing(trans1yValue, {
                    toValue: -50.0,
                    useNativeDriver: true, 
                    duration: 300,
                }),            
                Animated.timing(trans1yValue, {
                    toValue: 50.0,
                    useNativeDriver: true, 
                    duration: 300,
                }),
                Animated.timing(trans1yValue, {
                    toValue: -50.0,
                    useNativeDriver: true, 
                    duration: 300,
                }),
                Animated.timing(trans1yValue, {
                    toValue: 0.0,
                    useNativeDriver: true, 
                    duration: 150,
                }),
            ]),
        ]).start();        
    };

    // обертання
    const rot1Value = useRef(new Animated.Value(0.0)).current;
    const rot1Press = () => {
        Animated.sequence([
            Animated.timing(rot1Value, {
                toValue: 45,
                useNativeDriver: true, 
                duration: 300,
            }),
            Animated.timing(rot1Value, {
                toValue: -45,
                useNativeDriver: true, 
                duration: 600,
            }),
            Animated.timing(rot1Value, {
                toValue: 0,
                useNativeDriver: true, 
                duration: 300,
            })
        ]).start();
        
    }; 

    // подія завершення
    const fin1Value = useRef(new Animated.Value(1.0)).current;
    const fin1Press = () => {
        Animated.timing(fin1Value, {
            toValue: 1.5,
            useNativeDriver: true,
            duration: 900,
        }).start(       // у функцію старту анімації можна передати
            () => {     // функцію, що буде виконана після зупинки анімації
                Animated.timing(fin1Value, {
                    toValue: 1.0,
                    useNativeDriver: true,
                    duration: 0,
                }).start(fin1Press);
            }
        );
    };

    // Керована нескінченна анімація
    const infiniteValue = useRef(new Animated.Value(1.0)).current;
    const isAnimatingRef = useRef(false);
    const shouldStopRef = useRef(false);

    const infinitePress = () => {
        if (!isAnimatingRef.current) {
            // Перший клік - починаємо анімацію
            isAnimatingRef.current = true;
            shouldStopRef.current = false;
            playInfiniteAnimation();
        } else {
            // Другий клік - зупиняємо повтори
            shouldStopRef.current = true;
        }
    };

    const playInfiniteAnimation = () => {
        Animated.sequence([
            Animated.timing(infiniteValue, {
                toValue: 1.5,
                useNativeDriver: true,
                duration: 400,
            }),
            Animated.timing(infiniteValue, {
                toValue: 1.0,
                useNativeDriver: true,
                duration: 400,
            })
        ]).start(() => {
            // Перевіряємо чи потрібно продовжувати
            if (!shouldStopRef.current) {
                playInfiniteAnimation();
            } else {
                // Зупиняємо анімацію
                isAnimatingRef.current = false;
                shouldStopRef.current = false;
            }
        });
    };

    return <View style={AnimStyle.pageContainer}>
        <Text style={AnimStyle.title}>Анімації</Text>
        <View style={AnimStyle.row}>            
            <Pressable style={AnimStyle.anim} onPress={fadeOutPress}>
                <Animated.View style={[AnimStyle.block,{opacity: fadeOutValue}]}>
                    <View style={AnimStyle.demo}></View>
                    <Text style={AnimStyle.subtitle}>"Зникнення"</Text>
                </Animated.View>
            </Pressable>

            <Pressable style={AnimStyle.block} onPress={blinkPress}>
                <Animated.View style={[AnimStyle.block,{opacity: blinkValue}]}>
                    <View style={AnimStyle.demo}></View>
                    <Text style={AnimStyle.subtitle}>Блимання</Text>
                </Animated.View>
            </Pressable>
        </View>

        <View style={AnimStyle.row}>            
            <Pressable style={AnimStyle.anim} onPress={scale1Press}>
                <Animated.View style={[
                    AnimStyle.block,
                    { transform: [{scale: scale1Value}] }
                    ]}>
                    <View style={AnimStyle.demo}></View>
                    <Text style={AnimStyle.subtitle}>Масштаб</Text>
                </Animated.View>
            </Pressable> 

            <Pressable style={AnimStyle.block} onPress={scale2Press} >
                <Animated.View style={[
                    AnimStyle.block,
                    { transform: [
                        {scaleX: scale2Value},
                        {scaleY: scale2Value.interpolate({
                            inputRange: [1, 1.5],
                            outputRange: [1, 1 / 1.5]
                        })},
                    ] }
                    ]}>
                    <View style={AnimStyle.demo}></View>
                    <Text style={AnimStyle.subtitle}>Масштаб</Text>
                </Animated.View>
            </Pressable>
        </View>

        <View style={AnimStyle.row}>            
            <Pressable style={AnimStyle.anim} onPress={trans1Press}>
                <Animated.View style={[
                    AnimStyle.block,
                    { transform: [
                        {translateX: trans1xValue},
                        {translateY: trans1yValue},
                        {scale: trans1xValue.interpolate({
                            inputRange:  [-50,   0,  50  ],
                            outputRange: [0.75,  1,  1.33]
                        })},
                    ]} 
                ]}>
                    <View style={AnimStyle.demo}></View>
                    <Text style={AnimStyle.subtitle}>Зміщення</Text>
                </Animated.View>
            </Pressable> 

            <Pressable style={AnimStyle.block} onPress={rot1Press} >
                <Animated.View style={[
                    AnimStyle.block,
                    { transform: [
                        {rotate: rot1Value.interpolate({
                            inputRange: [-90, 0, 90],
                            outputRange: ["-90deg", "0deg", "90deg"]
                        })},
                        {translateX: rot1Value.interpolate({
                            inputRange: [-90, 90],
                            outputRange: [80, -80]
                        })}
                    ]}
                ]}>
                    <View style={AnimStyle.demo}></View>
                    <Text style={AnimStyle.subtitle}>Поворот</Text>
                </Animated.View>
            </Pressable>
        </View>

        <View style={AnimStyle.row}>
            <Pressable style={AnimStyle.anim} onPress={fin1Press}>
                <Animated.View style={[
                    AnimStyle.block,
                    { transform: [
                        {scale: fin1Value},
                    ]}
                ]}>
                    <View style={AnimStyle.demo}></View>
                    <Text style={AnimStyle.subtitle}>Завершення</Text>
                </Animated.View>
            </Pressable>

            <Pressable style={AnimStyle.anim} onPress={infinitePress}>
                <Animated.View style={[
                    AnimStyle.block,
                    { transform: [
                        {scale: infiniteValue},
                    ]}
                ]}>
                    <View style={AnimStyle.demo}></View>
                    <Text style={AnimStyle.subtitle}>Керована нескінченна</Text>
                </Animated.View>
            </Pressable>

        </View>

    </View>;
};

/*
Анімації (Double Animations) - різновид анімацій, що полягає у 
плавній зміні певного числового значення (double) з автоматичним
застосуванням до стильових атрибутів. 

Задача: реалізувати анімацію зменшення об'єкту на 10% (по всіх осях)
при кожному натисканні на нього

Д.З. Реалізувати анімацію "Рідкого дотику"
***   ****   **   ***
*** ->**** ->** ->***  
***   ****        ***  
      ****
торкання -> збільшення -> зменшення -> норм. розмір


let fadeOutValue = new Animated.Value(1);
 
func Anim() {
    Animated.timing(..) -> перерахунок значення + setState() для оновлення

    <Animated.View {opacity: fadeOutValue}>...
}

Д.З. Реалізувати керовану нескінченну анімацію:
перший клік (тап) по об'єкту запускає анімацію, вона продовжується 
 без формальних обмежень по кількості повторів (нескінченна)
другий клік зупиняє анімацію, точніше зупиняє повтори, 
 тобто анімація дограє до вихідного положення і далі не повторюється 
*/