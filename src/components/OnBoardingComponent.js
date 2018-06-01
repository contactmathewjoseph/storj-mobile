import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    Dimensions
} from 'react-native';
import React, { Component } from 'react';
import ContentSlider from '../components/ContentSliderComponent';
import onBoardingScreensConstants from '../utils/constants/onBoardingScreeensConstants';
import { getDeviceWidth, getWidth, getHeight } from '../utils/adaptive';
import { NavigationActions } from 'react-navigation';
import SideSwipe from 'react-native-sideswipe';


OnBoardingScreen = (props) =>  {
    return(
        <View style = { styles.contentContainer }>
            <View style = { styles.imageContainer }>
                <Image style = { styles.image } source = { props.imagePath } resizeMode = { 'contain' } />
            </View>
            <View style={ styles.textContainer }>
                {
                    props.textArray.map((element, index) => {
                        return <Text key = {index} style = { styles.textInfo }>{ element }</Text>
                    })
                }
            </View>
        </View>
    );
};

/**
 * OnBoarding component, using SliderComponent to switch between 1 and 2 content screens, described above
 */
export default class OnBoardingComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentIndex: 0
        }
    };

    /**
     * hiding navigation header
     */
    static navigationOptions = {
        header: null
    };
    
    /**
     * Navigation to LoginScreen
     */
    redirectToSingInScreen() {
        this.props.screenProps.redirectToLoginScreen();
    }

    /**
     * Navigation to RegisterScreen
     */
    redirectToSingUpScreen() {
        this.props.screenProps.redirectToRegisterScreen();
    }

    render() {
        const { width } = Dimensions.get('window');

        return(
            <View style={ styles.screen }>
                <View style = { styles.titleContainer }>
                    <Text style = { styles.titleText }>Welcome to Storj!</Text>
                </View>
                <View style={ styles.content }>
                    <SideSwipe
                        index = { this.state.currentIndex }
                        itemWidth = { getDeviceWidth() }
                        contentOffset = { getWidth(30) }
                        data = { [
                            { imagePath: onBoardingScreensConstants.safetyImagePath, textArray: onBoardingScreensConstants.safetyMainText },
                            { imagePath: onBoardingScreensConstants.incomeImagePath, textArray: onBoardingScreensConstants.incomeMainText },
                            { imagePath: onBoardingScreensConstants.spaceImagePath, textArray: onBoardingScreensConstants.spaceMainText }
                        ] }
                        onIndexChange={ index => {
                            let finalIndex = this.state.currentIndex;

                            if(index === finalIndex) return;

                            index >= finalIndex 
                                ? finalIndex += 1
                                : finalIndex -= 1;

                            this.setState(() => ({ currentIndex: finalIndex }))
                            
                        }}
                        renderItem = { ({ itemIndex, currentIndex, item, animatedValue }) => (
                            OnBoardingScreen(item)
                        )} />
                </View>
                <View style={ styles.footer }>                   
                    <TouchableOpacity 
                        style={ [ styles.button, styles.buttonLogin ] } 
                        onPress = { this.redirectToSingInScreen.bind(this) }>
                            <Text style={ styles.loginText }>Log in</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={ [ styles.button, styles.buttonSignUp ] } 
                        onPress = { this.redirectToSingUpScreen.bind(this) }>
                            <Text style={ styles.signUpText }>Create account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
}

const params = {
    buttonHeight: getHeight(44),
    buttonBorderRadius: getWidth(8),
    buttonFlex: 0.432,
    footerFlex: 0.15,
    contentPadding: getWidth(20),
    contentPaddingVertical: getHeight(10),
    titleBoldSize: getHeight(30),
    text: getHeight(16),
    buttonText: getHeight(14),
    imageTopPadding: getHeight(60),
    colorBlue: '#2794FF',
    colorDarkBlue: '#384b65',
    buttonPaddingHorizontal: getWidth(20)
};

const styles = StyleSheet.create({
    screen: {
        paddingHorizontal: getWidth(20),
        flex: 1,
        backgroundColor: 'white'
    },
    content: {
        backgroundColor: 'transparent',
        flex: 1
    },
    titleContainer: {
        marginTop: getHeight(30),
        justifyContent: 'flex-start'
    },
    titleText: {
        fontFamily: 'Montserrat-Bold', 
        fontSize: getHeight(30),
        color: '#384B65'
    },
    footer: {
        justifyContent: 'center',
        flexDirection: 'row',
        paddingVertical: getHeight(25),
        height: getHeight(94)
    },
    button: {
        width: getWidth(162),
        borderRadius: params.buttonBorderRadius,
        height: params.buttonHeight,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonLogin: {
        marginRight: getWidth(11),
        borderWidth: 1,
        borderColor: params.colorBlue
    },
    loginText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: params.buttonText,
        color: params.colorBlue
    },
    signUpText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: params.buttonText,
        color: 'white'
    },
    buttonSignUp: {
        backgroundColor: params.colorBlue
    },
    contentContainer: {
        backgroundColor: 'red',
        flex: 1,
        paddingVertical: params.contentPaddingVertical
    },
    imageContainer: {
        marginTop: getHeight(25),
        marginRight: getWidth(10),
        justifyContent: 'center'
    },
    textContainer: {
        backgroundColor: 'transparent',
        marginTop: getHeight(20),
        height: getHeight(80),
        width: getWidth(335),
        alignItems: 'flex-start'
    },
    titleBold: {
        fontFamily: 'Montserrat-ExtraBold',   
        alignSelf: 'flex-start',  
        fontSize: params.titleBoldSize,
        color: '#384B65'
    },
    titleLight: {
        fontFamily: 'Montserrat-ExtraBold',
        fontSize: params.titleBoldSize,
        color: params.colorBlue,
        backgroundColor: 'transparent'
    },
    textInfo: {
        fontFamily: 'Montserrat',
        lineHeight: getHeight(25),
        fontSize: params.text,
        color: params.colorDarkBlue
    },
    image: {
        height: getHeight(250),
        width: getWidth(335)
    }
});

