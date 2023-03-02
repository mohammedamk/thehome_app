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
	WebView,
	BackHandler,
	NetInfo
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize} from 'react-native-responsive-dimensions';
import Url from './../utils/Api';
import Entypo from 'react-native-vector-icons/Entypo';
import Zocial from 'react-native-vector-icons/Zocial';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Item from './item';
import NavigationHeader from './../utils/components/navigationHeader';
import Toast, {DURATION} from 'react-native-easy-toast';
import PopupDialog from 'react-native-popup-dialog';
import * as Progress from 'react-native-progress';

const array = [];

export default class ViewOrder extends Component{
	state = {
		cart_count:0,
		orderData:'',
		status:'',
		phone: '',
		currency:'',
		total_price:0,
		discount: 0,
		productArray: [],
		line_items_length:0,
		dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2,
			}),

	}

	componentDidMount(){
		this.popupDialog.show();
		this.getCustomer();
		this.getNumberCart();
		array = [];
		BackHandler.addEventListener('hardwareBackbutton', this.handleBack.bind(this));
		var i = 0;
		var line_items = this.props.navigation.state.params.order.line_items;
		if(this.props.navigation.state.params.order.fulfillment_status == null){
			this.setState({
				status: "In transit"
			})
		}else{
			this.setState({
				status: this.props.navigation.state.params.order.fulfillment_status
			})
		}
		if(this.props.navigation.state.params.order.shipping_address.phone == null){
			this.setState({
				phone: ""
			})
		}else{
			this.setState({
				phone: this.props.navigation.state.params.order.shipping_address.phone
			})
		}
		var currency_symbols = {
		    'USD': '$', // US Dollar
		    'EUR': '€', // Euro
		    'CRC': '₡', // Costa Rican Colón
		    'GBP': '£', // British Pound Sterling
		    'ILS': '₪', // Israeli New Sheqel
		    'INR': '₹', // Indian Rupee
		    'JPY': '¥', // Japanese Yen
		    'KRW': '₩', // South Korean Won
		    'NGN': '₦', // Nigerian Naira
		    'PHP': '₱', // Philippine Peso
		    'PLN': 'zł', // Polish Zloty
		    'PYG': '₲', // Paraguayan Guarani
		    'THB': '฿', // Thai Baht
		    'UAH': '₴', // Ukrainian Hryvnia
		    'VND': '₫', // Vietnamese Dong
		};
		this.setState({
			currency: currency_symbols[this.props.navigation.state.params.order.currency]
		})

		this.setState({
			line_items_length: line_items.length,
		})
		while(i < line_items.length){
			var full = line_items[i];
			this.getProduct(full);
			i++;
		}
	}

	getProduct(product){
		 NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
  fetch(Url.main + '/getProductById?shopnamefull='+Url.shopFullName+ '&shopname='+ Url.shopName + '&product_id='+ product.product_id, {
    		method : 'GET',
    		headers : {
    			'Accept': 'application/json',
      			'Content-Type': 'application/json'
    		}
    	}).then((response) => response.json())
    		.then((responseData) => {

   		var tmp = {
   			product: responseData[0],
   			order: product
   		}
   			var total = parseFloat(tmp.product.variants[0].compare_at_price) * tmp.order.quantity;
   			//alert(total)
   			this.setState({
   				total_price: parseFloat(this.state.total_price) + total
   			})
    		array.push(tmp)
    		if(array.length == this.state.line_items_length){
    			this.popupDialog.dismiss()
    			this.setState({
    				dataSource : this.state.dataSource.cloneWithRows(array),
    				discount : this.state.total_price - this.props.navigation.state.params.order.subtotal_price
    			});
    		}
   		}).done(() => {});
    }else{
      alert("No Network ,Try Again");
    }
})
		
	}



	componentWillUnmount(){
		BackHandler.removeEventListener('hardwareBackbutton');
	}

	handleBack(){
 		this.props.navigation.navigate('orders');
 		return true;
 	}

	getCustomer(){
		AsyncStorage.getItem('Customer').then((value) => {
	      var tmp = JSON.parse(value);
	      if(tmp != null){
	        this.setState({
	          customerData: tmp,
	          customer: true,
	        })
	        //alert('helloooooo')
	      }else{
	        this.setState({          
	          customerData: '',
	          customer: false,
	        })
	      }
	    }).done();
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
			<View style={{flex: 1}}>
				<View style = {{backgroundColor: '#232f3e', height: responsiveHeight(9), marginBottom: 10}}>
					<View style={{height: responsiveHeight(8),flexDirection: 'row',}}>
						<View style={{ width: responsiveWidth(15),alignItems:'center', justifyContent:'center'}}>
							<TouchableOpacity onPress={() => this.props.navigation.navigate('DrawerToggle')}>
								<Entypo name="menu" size={28} color="white"  />
							</TouchableOpacity>
						</View>
						<View style={{width: responsiveWidth(58), justifyContent: 'center'}}>
							<Text style = {{fontFamily:'Nunito-Bold', fontSize: responsiveFontSize(3), color: 'white'}} >Shopify App</Text>
						</View>
						<View style={{width:responsiveWidth(8),justifyContent:"center",alignItems:'center',}}>
							<TouchableOpacity onPress={() => {this.props.navigation.navigate('search')}}>
								<FontAwesome name="search" size={20} color="white" />
							</TouchableOpacity>
					    </View>
						<View style={{width:responsiveWidth(22),justifyContent:"center",alignItems:'center',}}>
							<TouchableOpacity onPress={() => {this.props.navigation.navigate('cart')}} style = {{alignItems: 'flex-start'}} >
								<MaterialCommunityIcons name = 'cart-outline' size = {25} color = 'white'/>
							</TouchableOpacity>
							<View style = {{height: responsiveHeight(2.5), width: responsiveWidth(5), backgroundColor: 'white', borderRadius: 10, position: 'absolute', left: 45, top: 10, alignItems:'center', justifyContent:'center'}}>
								<Text style = {{fontSize: responsiveFontSize(1.5), color:'#232f3e', fontFamily: 'Nunito-Bold'}}>{this.state.cart_count}</Text>
							</View>
				    	</View>
					</View>
				</View>
				<ScrollView>
					<ListView
					    dataSource = {this.state.dataSource}
					    renderRow = {this.renderProduct.bind(this)}
					/>
					{array.length == this.state.line_items_length && <View style = {{height: responsiveHeight(5), justifyContent: 'center',backgroundColor: 'white',width: responsiveWidth(95), alignSelf:'center'}}>
										<Text style = {{fontSize: responsiveFontSize(1.8), color: 'green', fontFamily: 'Nunito-Bold', paddingLeft: 5}}>{(this.state.status).toUpperCase()}</Text>
									</View>}
					{array.length == this.state.line_items_length && <View style = {{marginTop: 10, marginBottom: 10,width: responsiveWidth(95), alignSelf:'center'}}>
						<Text style = {{fontSize: responsiveFontSize(2.5), color: '#000', fontFamily: 'Nunito-Bold'}}>Shipping Address</Text>
					</View>}
					{array.length == this.state.line_items_length && <View style ={{backgroundColor: "white", width: responsiveWidth(95), alignSelf:'center'}} >
						<View style = {{flexDirection: 'column', width: responsiveWidth(90), alignSelf:'center',}}>
							<View style = {{marginTop: 5}}>
								<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Bold'}}>{this.props.navigation.state.params.order.shipping_address.name}</Text>
							</View>
							<View style = {{marginTop: 5}}>
								<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Regular'}}>{this.props.navigation.state.params.order.shipping_address.address1}, {this.props.navigation.state.params.order.shipping_address.city}</Text>
							</View>
							<View style = {{marginTop: 5}}>
								<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Regular'}}>{this.props.navigation.state.params.order.shipping_address.city}, {this.props.navigation.state.params.order.shipping_address.province}, {this.props.navigation.state.params.order.shipping_address.zip}</Text>
							</View>
							<View style = {{marginTop: 5, marginBottom: 5}}>
								<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Regular'}}>Mobile: {this.state.phone}</Text>
							</View>
						</View>
					</View>}
					{array.length === this.state.line_items_length && <View style = {{marginTop: 10, marginBottom: 10,width: responsiveWidth(95), alignSelf:'center'}}>
						<Text style = {{fontSize: responsiveFontSize(2.5), color: '#000', fontFamily: 'Nunito-Bold'}}>Payment Information</Text>
					</View>}
					{array.length === this.state.line_items_length && <View style ={{backgroundColor: "white", width: responsiveWidth(95), alignSelf:'center', marginBottom:10}} >
						<View style = {{flexDirection: 'column', width: responsiveWidth(90), alignSelf:'center',}}>
							<View style = {{marginTop: 5, flexDirection: 'row'}}>
								<View style = {{width: responsiveWidth(60)}}>
									<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Bold'}}>Product Price</Text>
								</View>
								<View style = {{width: responsiveWidth(30), alignItems:'flex-end'}}>
									<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Regular'}}>{this.state.currency} {(this.state.total_price).toFixed(2)}</Text>
								</View>
							</View>
							<View style = {{marginTop: 5, flexDirection: 'row'}}>
								<View style = {{width: responsiveWidth(60)}}>
									<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Bold'}}>Discount</Text>
								</View>
								<View style = {{width: responsiveWidth(30), alignItems:'flex-end'}}>
									<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Regular'}}>{this.state.currency} {(this.state.discount).toFixed(2)}</Text>
								</View>
							</View>
							<View style = {{marginTop: 5, flexDirection: 'row'}}>
								<View style = {{width: responsiveWidth(60)}}>
									<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Bold'}}>Unit Price</Text>
								</View>
								<View style = {{width: responsiveWidth(30), alignItems:'flex-end'}}>
									<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Regular'}}>{this.state.currency} {(this.state.total_price - this.state.discount).toFixed(2)}</Text>
								</View>
							</View>
							<View style = {{marginTop: 5, flexDirection: 'row'}}>
								<View style = {{width: responsiveWidth(60)}}>
									<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Bold'}}>Shipping Charge</Text>
								</View>
								<View style = {{width: responsiveWidth(30), alignItems:'flex-end'}}>
									<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Regular'}}>{this.state.currency} {(this.props.navigation.state.params.order.total_price - (this.state.total_price - this.state.discount)).toFixed(2)}</Text>
								</View>
							</View>
							<View style = {{marginTop: 5, flexDirection: 'row', borderWidth: 0.5, borderColor: '#e2e2e2'}}>
							</View>
							<View style = {{marginTop: 5, flexDirection: 'row', marginBottom: 5}}>
								<View style = {{width: responsiveWidth(60)}}>
									<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Bold'}}>Total Price</Text>
								</View>
								<View style = {{width: responsiveWidth(30), alignItems:'flex-end'}}>
									<Text style = {{fontSize: responsiveFontSize(1.7), color: '#000', fontFamily: 'Nunito-Regular'}}>{this.state.currency} {this.props.navigation.state.params.order.total_price}</Text>
								</View>
							</View>
						</View>
					</View>}
				</ScrollView>
				<PopupDialog dismissOnTouchOutside = {false} dismissOnHardwareBackPress = {false} overlayOpacity = {0.9} overlayBackgroundColor = '#A9A9A9' width = {responsiveWidth(75)} height = {responsiveHeight(10)} ref={(popupDialog) => { this.popupDialog = popupDialog; }}>
					<View style = {{height: responsiveHeight(10), width: responsiveWidth(75), flexDirection: 'row'}}>
						<View style = {{width: responsiveWidth(20), justifyContent:'center', alignItems:'center'}}>
							<Progress.CircleSnail color={['#008744','#0057e7', '#d62d20', '#ffa700', '#eee']} duration = {700} />
						</View>
						<View style = {{justifyContent:'center'}}>
							<Text style = {{fontFamily: 'Nunito-Regular', fontSize: responsiveFontSize(2), color: 'black'}}>Loading...</Text>
						</View>
					</View>
				</PopupDialog>
			</View>
		)
	}

	renderProduct(full){
		return(
			<View style = {{height: responsiveHeight(16), alignSelf:'center', width: responsiveWidth(95), backgroundColor:'white', flexDirection:'column'}}>
				<View style = {{flexDirection: 'row'}}>
					<View style = {{width: responsiveWidth(25), paddingTop: 5, paddingLeft: 5}}>
						<Image source = {{uri: full.product.image.src}} style = {{height: responsiveHeight(14), width: responsiveWidth(23)}} />
					</View>
					<View style = {{flexDirection: 'column'}}>
						<View style = {{paddingLeft: 10, paddingTop:0}}>
							<Text numberOfLines = {1} style = {{fontSize: responsiveFontSize(2.5), color:'#232f3e', fontFamily: 'Nunito-Bold'}}>{full.product.title}</Text>
						</View>
						<View style ={{paddingTop: 5}}>
							<Text style = {{fontSize: responsiveFontSize(2), color: 'red', fontFamily: 'Nunito-Bold', paddingLeft: 10}} >$ {full.order.price}</Text>
						</View>
						<View style = {{paddingLeft: 10, paddingTop:5}}>
							<Text numberOfLines = {1} style = {{fontSize: responsiveFontSize(1.8), color:'#232f3e', fontFamily: 'Nunito-Light'}}>quantity: {full.order.quantity}</Text>
						</View>
					</View>
				</View>
			</View>
		)

	}
}