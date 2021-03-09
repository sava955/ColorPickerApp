import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View, Animated, FlatList, LogBox } from 'react-native';

import { ColorWheel } from 'react-native-color-wheel';
import { SliderSaturationPicker } from 'react-native-slider-color-picker';
import tinycolor from 'tinycolor2';
import colorsys from 'colorsys';
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Path, Svg } from 'react-native-svg';

export default function ColorPickerScreen() {
    const [currentColor, setCurrentColor] = useState('#ff0000');
    const [defaultColors, setDefaultColors] = useState([]);
    const animatedValue = new Animated.Value(1.5);

    const mask = {
        width: Dimensions.get('window').width,
        height: 50
    };

    useEffect(() => {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
        let hsvColor = colorsys.hexToHsl(currentColor);
        getColorName(hsvColor.h);
    }, []);

    const onChange = (e) => {
        let hexedColor = colorsys.hsvToHex(e);
        let hsvColor = colorsys.hexToHsl(hexedColor);

        getColorName(hsvColor.h);
    }

    const onChangeComplete = (e) => {
        pressInAnimation();
    }

    const pressInAnimation = () => {
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 5000,
            useNativeDriver: true
        }).start();
    }

    const getColorName = (h) => {
        let colorValue = Math.floor(h);
        let defaultColor;

        if (colorValue < 25 || (colorValue >= 340 && colorValue < 359)) {
            defaultColor = '#ff0000';
        }
        else if (colorValue >= 25 && colorValue < 50) {
            defaultColor = '#ffa500';
        }
        else if (colorValue >= 50 && colorValue < 75) {
            defaultColor = '#ffff00';
        }
        else if (colorValue >= 75 && colorValue < 150) {
            defaultColor = '#00ff00';
        }
        else if (colorValue >= 150 && colorValue < 200) {
            defaultColor = '#00ade6';
        }
        else if (colorValue >= 200 && colorValue < 260) {
            defaultColor = '#5b00e0';
        }
        else if (colorValue >= 260 && colorValue < 340) {
            defaultColor = '#ea00ed';
        }

        updateColors(defaultColor);
    }

    const updateColors = (color) => {
        let colors = [
            { key: "1", color: '#ff0000' },
            { key: "2", color: '#ffa500' },
            { key: "3", color: '#ffff00' },
            { key: "4", color: '#00ff00' },
            { key: "5", color: '#00ade6' },
            { key: "6", color: '#5b00e0' },
            { key: "7", color: '#ea00ed' }
        ];

        let updatedDefaultColors = [];

        let index = colors.findIndex(c => c.color === color);

        if (index < 3) {
            updatedDefaultColors = colors.splice(index, + 5);
        }
        if (index >= 3) {
            updatedDefaultColors = colors.splice(index);
            while (updatedDefaultColors.length < 5) {
                let x = colors.shift();

                updatedDefaultColors.push(x);
            }

        }

        setCurrentColor(updatedDefaultColors[0].color);
        setDefaultColors(updatedDefaultColors);
    }

    const changeColor = (colorHsvOrRgb, resType) => {
        if (resType === 'end') {
            setCurrentColor(tinycolor(colorHsvOrRgb).toHexString());
        }
    }


    return (
        <View style={styles.container}>
            <View style={styles.navigation}>
                <Ionicons name="arrow-back-outline" size={28} color={currentColor} style={{marginLeft: 20}} />
                <Text style={[styles.navTitle, { color: currentColor }]}>New color</Text>
            </View>
            <View style={styles.wheelBox}>
                <ColorWheel
                    initialColor={currentColor}
                    onColorChange={color => onChange(color)}
                    onColorChangeComplete={color => onChangeComplete(color)}
                    style={styles.wheel}
                    thumbStyle={styles.wheelThumb}
                />
                <Animated.View></Animated.View>
                <Animated.View style={[styles.circle, { backgroundColor: currentColor }, { transform: [{ scale: animatedValue }] }]}>
                </Animated.View>
                <Animated.View style={[styles.circleOuter, { backgroundColor: currentColor }, { transform: [{ scale: animatedValue }] }]}>
                </Animated.View>
            </View>
            <View style={styles.sliderBox}>
                <View>
                    <MaterialIcons name="lightbulb" size={24} color={currentColor} style={styles.iconLeft} />
                </View>
                <View>
                    <SliderSaturationPicker
                        oldColor={currentColor}
                        trackStyle={styles.track}
                        thumbStyle={styles.thumb}
                        useNativeDriver={true}
                        onColorChange={changeColor}
                        style={[styles.slider, { backgroundColor: tinycolor({ h: tinycolor(currentColor).toHsv().h, s: 1, v: 1 }).toHexString() }]}
                    />
                </View>
                <View>
                    <MaterialCommunityIcons name="lightbulb-on-outline" size={30} style={styles.iconRight} color={currentColor} />
                </View>
            </View>
            <View style={styles.swatchesContent}>
                <View style={styles.maskBox}>
                    <View style={styles.mask}>
                        <Svg width={mask.width} height={mask.height}>
                            <Path
                                fill='#fff'
                                d={
                                    `M 0 0 L 0 
                                ${mask.height} L 
                                ${mask.width} 
                                ${mask.height} L 
                                ${mask.width} 0 A 
                                ${mask.width / 3} 
                                ${mask.height / 2} 0 0 1 
                                ${mask.width} 
                                ${mask.height / 2} A 
                                ${mask.width / 3} 
                                ${mask.height / 2} 0 0 1 0 0 z `} />
                        </Svg>
                    </View>
                    <View style={[styles.maskBg, { backgroundColor: currentColor }]}></View>
                </View>
                <View style={styles.swatchesBox}>
                    <FlatList
                        style={{ zIndex: 3 }}
                        horizontal={true}
                        data={defaultColors}
                        renderItem={({ item }) => (
                            <View style={[styles.swatches, { backgroundColor: item.color }]}></View>
                        )}
                    />
                    <View style={[styles.swatchesBg, {backgroundColor: currentColor}]}></View>
                </View>
            </View>
        </View>
    )
}


const styles = {
    container: {
        flex: 1, flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        width: '100%'
    },
    navigation: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    navTitle: {
        marginLeft: 20,
        fontSize: 20
    },
    wheelBox: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    wheel: {
        width: Dimensions.get('window').width * 3 / 5,
        height: Dimensions.get('window').width * 3 / 5,
        alignSelf: 'center',
        zIndex: 1
    },
    wheelThumb: {
        height: 5,
        width: 5,
        borderRadius: 30
    },
    circle: {
        width: Dimensions.get('window').width * 3 / 7,
        height: Dimensions.get('window').width * 3 / 7,
        position: 'absolute',
        zIndex: 0,
        borderRadius: 260,
        opacity: 0.4
    },
    circleOuter: {
        width: Dimensions.get('window').width * 3 / 6,
        height: Dimensions.get('window').width * 3 / 6,
        position: 'absolute',
        zIndex: 0,
        borderRadius: 340,
        opacity: 0.2
    },
    sliderBox: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    track: {
        width: Dimensions.get('window').width * 3 / 6,
        height: 5
    },
    slider: {
        height: 5,
        borderRadius: 6
    },
    thumb: {
        width: 30,
        height: 30,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 25,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 2,
        shadowOpacity: 0.35,
    },
    iconLeft: {
        paddingRight: 15
    },
    iconRight: {
        paddingLeft: 15,
        marginBottom: 10
    },
    swatchesContent: {
        flex: 1, 
        flexDirection: 'column'
    },
    maskBox: { 
        position: 'relative', 
        flex: 1 
    },
    mask: {
        transform: [{ rotate: '180deg' }],
        zIndex: 3
    },
    maskBg: { 
        zIndex: 0, 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        opacity: 0.2 
    },
    swatchesBox: {
        flex: 1, 
        position: 'relative', 
        flexDirection: 'column', 
        alignItems: 'center'
    },
    swatches: {
        alignSelf: 'flex-end',
        height: 45,
        width: 45,
        marginRight: 10,
        marginLeft: 10,
        marginBottom: 20,
        borderRadius: 50,
        borderColor: 'gray',
        borderWidth: 1   
    },
    swatchesBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: 'auto',
        height: 'auto',
        zIndex: 0,
        opacity: 0.2
    }
}