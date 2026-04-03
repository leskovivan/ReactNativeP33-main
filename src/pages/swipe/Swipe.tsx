import { Alert, Animated, GestureResponderEvent, Modal, Pressable, Text, TouchableWithoutFeedback, useWindowDimensions, View } from "react-native";
import SwipeStyle from "./ui/SwipeStyle"; 
import { ReactNode, useEffect, useRef, useState } from "react";
import { MoveDirection } from "./model/MoveDirection";

interface IModalButton {    
    title: string,
    onPress: () => void,
    style?: Object
}

interface IModalData {
    title: string,
    message: string,
    buttons?: Array<IModalButton>,
}

export default function Swipe() {
    const {width, height} = useWindowDimensions();
    const shortestSide = Math.min(width, height);
    const fieldSize = 0.96 * shortestSide;
    const tileSize = fieldSize / 4.0;
    const [text, setText] = useState<string>("");
    const [field, setField] = useState<Array<number>>([
        1, 2, 3, 0,
        5, 6, 7, 4,
        9, 10,12,8,
        13,14,11,15]); // (Array.from({ length: 16 }, (_, i) => (i + 1 + Math.trunc(i / 4)) % 16));
    const [difficulty, setDifficulty] = useState<number>(1);
    const isPortrait = width < height;
    const continueGame = useRef<boolean>(false);
    const [modalData, setModalData] = useState<IModalData|null>(null);
    const isAnimating = useRef<boolean>(false);

    // Create 16 Animated.ValueXY for each possible tile value (1-15 and 0 for empty)
    const tileOffsets = useRef(
        Array.from({ length: 16 }, () => new Animated.ValueXY({ x: 0, y: 0 }))
    ).current;

    // #region gesture detection
    const makeMove = (direction:MoveDirection) => {
        let emptyTileIndex = field.findIndex(i => i == 0);
        let otherTileIndex;
        switch(direction) {
            case MoveDirection.right :
                otherTileIndex = emptyTileIndex % 4 == 0 ? -1 : emptyTileIndex - 1;
                break;
            case MoveDirection.left :
                otherTileIndex = emptyTileIndex % 4 == 3 ? -1 : emptyTileIndex + 1;
                break;
            case MoveDirection.up :
                otherTileIndex = emptyTileIndex >= 12 ? -1 : emptyTileIndex + 4;
                break;
            case MoveDirection.down :
                otherTileIndex = emptyTileIndex < 4 ? -1 : emptyTileIndex - 4;
                break;
        }
        if(otherTileIndex == -1) {
            setText("Рух неможливий");
        }
        else {
            if (isAnimating.current) return;
            isAnimating.current = true;

            const tileId = field[otherTileIndex];
            const dx = (emptyTileIndex % 4) - (otherTileIndex % 4);
            const dy = Math.floor(emptyTileIndex / 4) - Math.floor(otherTileIndex / 4);

            Animated.timing(tileOffsets[tileId], {
                toValue: { x: dx * tileSize, y: dy * tileSize },
                duration: 200,
                // Changing to lower duration and false allows React to sync correctly 
                // when changing position in the flexbox grid
                useNativeDriver: false,
            }).start(() => {
                setField(prevField => {
                    const newField = [...prevField];
                    newField[emptyTileIndex] = tileId;
                    newField[otherTileIndex] = 0;
                    return newField;
                });
                
                // Reset the transform so the flex layout handles the new actual position naturally
                tileOffsets[tileId].setValue({ x: 0, y: 0 });
                isAnimating.current = false;
            });
        }
    };

    const onSwipeRight = () => makeMove(MoveDirection.right);
    const onSwipeLeft = () =>  makeMove(MoveDirection.left);
    const onSwipeTop = () =>  makeMove(MoveDirection.up);
    const onSwipeBottom = () =>  makeMove(MoveDirection.down);

    // #endregion
    const gameOver = () => {
        setModalData({
            title: "Victory",
            message: "Good!",
            buttons: [{
                title: "New Game",
                onPress: () => {continueGame.current = false;},
                style: SwipeStyle.buttonOpen
            },{
                title: "Continue",
                onPress: () => {continueGame.current = true;}
            }]
        });
    }
    
    const gameOverAlert = () => {
        Alert.alert('Victory', 'You win!\nStart new game or continue?', [{
            text: 'New Game',
            onPress: () => {
                continueGame.current = false;
            },
            style: 'cancel',
        }, {
            text: 'Continue', 
            onPress: () => {
                if(difficulty < 4) {
                    setDifficulty(difficulty + 1);
                }
                else {
                    continueGame.current = true;
                }                
            }
        }]);
    };

    useEffect(() => {
        let vic = true;
        for(let i = 0; i < 4 * difficulty; i += 1) {
            if(field[i] != (i + 1) % 16) {
                vic = false;
            }
        }
        if(vic && !continueGame.current) {
            gameOverAlert();
        }
    }, [field]);

    const onDifficultyLeft  = () => {if(difficulty > 1) setDifficulty(difficulty - 1)};
    const onDifficultyRight = () => {if(difficulty < 4) setDifficulty(difficulty + 1)};

    return <View style={[SwipeStyle.pageContainer, {flexDirection: isPortrait ? "column" : "row"}]}>
        
        <Swipeable onSwipeLeft={onDifficultyLeft} onSwipeRight={onDifficultyRight}>
            <View style={[SwipeStyle.difficultyContainer, {
                marginTop: isPortrait ? 40.0 : 0,
                marginLeft: isPortrait ? 0 : 40.0,
            }]}>
                <View style={[SwipeStyle.difficultySelector, {
                    flexDirection:isPortrait ? "row" : "column",
                    height:  isPortrait ? tileSize : fieldSize,
                    width: isPortrait ? fieldSize : tileSize,
                }]}>
                    <View style={[difficulty == 1 ? SwipeStyle.difficultyItemSelected : SwipeStyle.difficultyItem]}>                   
                        <Text style={SwipeStyle.tileText}>1</Text>                   
                    </View>

                    <View style={[difficulty == 2 ? SwipeStyle.difficultyItemSelected : SwipeStyle.difficultyItem]}>                  
                        <Text style={SwipeStyle.tileText}>2</Text>
                    </View>

                    <View style={[difficulty == 3 ? SwipeStyle.difficultyItemSelected : SwipeStyle.difficultyItem]}>
                        <Text style={SwipeStyle.tileText}>3</Text>
                    </View>

                    <View style={[difficulty == 4 ? SwipeStyle.difficultyItemSelected : SwipeStyle.difficultyItem]}>
                        <Text style={SwipeStyle.tileText}>4</Text> 
                    </View>
                </View>
            </View>
        </Swipeable>

        <Text>Swipe: {text}</Text>

        <Swipeable onSwipeRight={onSwipeRight} onSwipeLeft={onSwipeLeft} onSwipeBottom={onSwipeBottom} onSwipeTop={onSwipeTop} >
            <View style={[SwipeStyle.gameField, {width: fieldSize, height: fieldSize}]}>
                {field.map(i => 
                <View key={i} style={[SwipeStyle.tileContainer, {width: tileSize, height: tileSize}]}>
                    {i != 0 && <Animated.View style={[SwipeStyle.tile, {
                        transform: [
                            { translateX: tileOffsets[i].x },
                            { translateY: tileOffsets[i].y }
                        ]
                    }]}>
                        <Text style={true ? SwipeStyle.tileTextInPlace : SwipeStyle.tileText}>{i}</Text>
                    </Animated.View>} 
                </View>)}
            </View>
        </Swipeable>

        <View style={[SwipeStyle.difficultyContainer, {
            marginTop: isPortrait ? 40.0 : 0,
            marginLeft: isPortrait ? 0 : 40.0,
        }]}>
            <View style={[SwipeStyle.difficultySelector, {
                flexDirection:isPortrait ? "row" : "column",
                height:  isPortrait ? tileSize : fieldSize,
                width: isPortrait ? fieldSize : tileSize,
            }]}>
                <Pressable onPress={() => setDifficulty(1)} style={[difficulty == 1 ? SwipeStyle.difficultyItemSelected : SwipeStyle.difficultyItem]}>                   
                    <Text style={SwipeStyle.tileText}>1</Text>                   
                </Pressable>

                <Pressable onPress={() => setDifficulty(2)} style={[difficulty == 2 ? SwipeStyle.difficultyItemSelected : SwipeStyle.difficultyItem]}>                  
                    <Text style={SwipeStyle.tileText}>2</Text>
                </Pressable>

                <Pressable onPress={() => setDifficulty(3)} style={[difficulty == 3 ? SwipeStyle.difficultyItemSelected : SwipeStyle.difficultyItem]}>
                    <Text style={SwipeStyle.tileText}>3</Text>
                </Pressable>

                <Pressable onPress={() => setDifficulty(4)} style={[difficulty == 4 ? SwipeStyle.difficultyItemSelected : SwipeStyle.difficultyItem]}>
                    <Text style={SwipeStyle.tileText}>4</Text> 
                </Pressable>
            </View>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalData != null}
          onRequestClose={() => {
            setModalData(null);
          }}>
          <View style={SwipeStyle.centeredView}>
            <View style={SwipeStyle.modalView}>
              <Text style={SwipeStyle.modalTitle}>{modalData?.title}</Text>
              <Text style={SwipeStyle.modalText}>{modalData?.message}</Text>
              {modalData?.buttons
                ? modalData.buttons.map(btn => <Pressable key={btn.title}
                    style={[SwipeStyle.button, btn.style ?? SwipeStyle.buttonClose]}
                    onPress={() => { setModalData(null); btn.onPress() }}>
                    <Text style={SwipeStyle.textStyle}>{btn.title}</Text>
                </Pressable>)
                :<Pressable
                    style={[SwipeStyle.button, SwipeStyle.buttonClose]}
                    onPress={() => setModalData(null)}>
                    <Text style={SwipeStyle.textStyle}>Hide Modal</Text>
                </Pressable>}
            </View>
          </View>
        </Modal>
    </View>;
}


function Swipeable(
    {onSwipeRight, onSwipeLeft, onSwipeTop, onSwipeBottom, onUrecognized, children}: 
    {onSwipeRight?:()=>void, 
        onSwipeLeft?:()=>void, 
        onSwipeTop?:()=>void, 
        onSwipeBottom?:()=>void,
        onUrecognized?:(reason:string)=>void,
    children: ReactNode}) {

        const minSwipeLength = 100.0;
        const minSwipeVelocity = 100.0 / 400.0;   // 100 пікселів за 400 мілісекунд

        const eventBegin = useRef<GestureResponderEvent|null>(null);

        const onGestureBegin = (event: GestureResponderEvent) => {
            /*
            event.nativeEvent.pageX/Y - відлік від меж пристрою (сторінки)
            event.nativeEvent.locationX/Y - від меж блоку-детектора
            */
            eventBegin.current = event;
        };
        const onGestureEnd = (event: GestureResponderEvent) => {
            const e1 = eventBegin.current;
            if(e1) {                
                const dx = event.nativeEvent.pageX - e1.nativeEvent.pageX;
                const dy = event.nativeEvent.pageY - e1.nativeEvent.pageY;
                const dt = event.nativeEvent.timestamp - e1.nativeEvent.timestamp;
                // є три рішення: жест є горизонтальним, вертикальним або невизначеним (у межах похибок) 
                const lenX = Math.abs(dx);   
                const lenY = Math.abs(dy);
                if(lenX > 2 * lenY) {
                    // Горизонтальні жести також поділяємо на три варіанти:
                    // свайп ліворуч, праворуч або не свайп (закороткий або заповільний)
                    if(lenX < minSwipeLength) {
                        if(onUrecognized) onUrecognized("Horizontal: too short");
                    }
                    else if(lenX / dt < minSwipeVelocity) {
                        if(onUrecognized) onUrecognized("Horizontal: too slow");
                    }
                    else if(dx < 0) {
                        if(onSwipeLeft) onSwipeLeft();
                    }
                    else {
                        if(onSwipeRight) onSwipeRight();
                    }
                }
                else if(lenY > 2 * lenX) {
                    if(lenY < minSwipeLength) {
                        if(onUrecognized) onUrecognized("Vertical: too short");
                    }
                    else if(lenY / dt < minSwipeVelocity) {
                        if(onUrecognized) onUrecognized("Vertical: too slow");
                    }
                    else if(dy < 0) {
                        if(onSwipeTop) onSwipeTop();
                    }
                    else {
                        if(onSwipeBottom) onSwipeBottom();
                    }
                }
                else {
                    if(onUrecognized) onUrecognized("Diagonal");
                }
            }        
        };
    return <TouchableWithoutFeedback onPressIn={onGestureBegin} onPressOut={onGestureEnd}>
        {children}
    </TouchableWithoutFeedback>;
}
/*
Свайп - жест, який складається з послідовності:
-торкання
-проведення
-відпускання
Особливості:
- слід обмежити мінімальну довжину проведення
- ... мінімальну швидкість ...
Питання:
чи буде залежати координатна сітка від орієнтації пристрою?
Перевірка:
сітка також повертається, висновок про горизонтальність 
 прив'язується до реальної (світової) горизонталі

Д.З. Реалізувати анімацію переміщення:
На всі види свайпів - переміщень

*/