import React, { Component } from 'react';
import {
	View,
	Text,
	StatusBar,
	TouchableOpacity,
  	StyleSheet,
	TouchableHighlight,
	Image,
	ImageBackground,
	ScrollView,
	TextInput,
	AsyncStorage,
	ListView,
	Platform,
	TouchableWithoutFeedback,
	BackHandler,
	WebView
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize} from 'react-native-responsive-dimensions';
import Url from './../utils/Api';
import Entypo from 'react-native-vector-icons/Entypo';
import Zocial from 'react-native-vector-icons/Zocial';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Item from './item';
import Toast, {DURATION} from 'react-native-easy-toast';
import NavigationHeader from './../utils/components/navigationHeader';
import PopupDialog from 'react-native-popup-dialog';
import * as Progress from 'react-native-progress';
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding'

export default class Checkout extends Component{

	state = {
		dataSource: new ListView.DataSource({
			rowHasChanged: (row1, row2) => true,
		}),
		cart_count:0,
		emptyCart: false,
		item:'',
		totalva:'',
		customer: false,
		customerData:'',
		productArray: ''
	}

	componentDidMount(){
		this.getNumberCart();
		BackHandler.addEventListener('hardwareBackbutton', this.handleBack.bind(this));
	}

	componentWillUnmount(){
		BackHandler.removeEventListener('hardwareBackbutton');
	}

	handleBack(){
 		this.props.navigation.navigate('orders');
 		return true;
 	}

	getNumberCart(){
		var tmpproduct = {};
		AsyncStorage.getItem("cart").then((value) => {
			if(value != null){
				tmpproduct = JSON.parse(value);
				var tmppro = Object.keys(tmpproduct).map(function(key) {
					return(tmpproduct[key])
				});
				this.setState({
					cart_count: tmppro.length,
					productArray: tmppro
				})
			}else{
				this.setState({
					cart_count: 0,
				})
			}
		}).done();
	}

	render(){
		return(
			<View style={{flex:1,}}>
				<StatusBarPaddingIOS/>
				<View style = {{backgroundColor: '#232f3e', height: responsiveHeight(9)}}>
					<View style={{height: responsiveHeight(8),flexDirection: 'row',}}>
						{Platform.OS === 'ios' && <View style={{ width: responsiveWidth(10), alignItems: 'center', justifyContent: 'center' }}>
							<TouchableOpacity onPress={() => this.props.navigation.navigate('categories')}>
								<Entypo name="chevron-small-left" size={28} color="white" />
							</TouchableOpacity>
						</View>}
						<View style={{ width: responsiveWidth(15),alignItems:'center', justifyContent:'center'}}>
							<TouchableOpacity onPress={() => this.props.navigation.navigate('DrawerToggle')}>
								<Entypo name="menu" size={28} color="white"  />
							</TouchableOpacity>
						</View>
						<View style={{ width: Platform.OS === 'ios' ? responsiveWidth(56) : responsiveWidth(66), justifyContent: 'center'}}>
							<Text style = {{fontFamily:'Nunito-Bold', fontSize: responsiveFontSize(3), color: 'white'}} >{Url.title}</Text>
						</View>
					</View>
				</View>
				<WebView
          			source = {{ uri : this.props.navigation.state.params.invoice_url}}
          			startInLoadingState = {true}
          			thirdPartyCookiesEnabled = {false}
          			mixedContentMode = 'always'
          			decelerationRate="normal" />
			</View>
		);
	}
}
