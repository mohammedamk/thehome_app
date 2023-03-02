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
	RefreshControl,
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
import Share from 'react-native-share';
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding'

export default class Orders extends Component{
	constructor(props) {
		super(props);
		this.data = [];
	}
	state = {
		cart_count : 0,
		customer: false,
		customerData:'',
		page:1,
		finish: false,
		limit: 4,
		dataSource: new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		}),
	}

	componentDidMount(){
		this.popupDialog.show();
		BackHandler.addEventListener('hardwareBackbutton', this.handleBack.bind(this));
		this.getCustomer();
		this.getNumberCart();
	}

	componentWillUnmount(){
		BackHandler.removeEventListener('hardwareBackbutton');
	}

	handleBack(){
 		this.props.navigation.navigate('categories');
 		return true;
 	}

	getCustomer(){
		AsyncStorage.getItem('Architect').then((value) => {
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
	    }).done(() => this.getOrders());
	}

	getNumberCart(){
		var tmpproduct = {};
		AsyncStorage.getItem("Architect_cart").then((value) => {
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

	getOrders(){
		//this.popupDialog.dismiss();
		NetInfo.isConnected.fetch().then(isConnected => {
	    if (isConnected) {
	 fetch(Url.domain + '/getArchitectOrders/' + this.state.customerData._id, {
    		method : 'GET',
    		headers : {
    			'Accept': 'application/json',
      			'Content-Type': 'application/json'
    		}
    	}).then((response) => response.json())
    		.then((responseData) => {
    			this.popupDialog.dismiss()

    			if(responseData.orders.length !== 0){
    				responseData.orders.reverse();
    				this.setState({
    			dataSource: this.state.dataSource.cloneWithRows(responseData.orders),
    		})
    			}

    	}).done(() => {this.setState({refreshing:false})});
	    }else{
	      alert("No Network ,Try Again");
	    }
	})
		
	}

	render(){
		return(
			<View style={{flex:1,}}>
				<StatusBarPaddingIOS />
				<View style = {{backgroundColor: '#232f3e', height: responsiveHeight(9), marginBottom: 5}}>
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
						<View style={{width: Platform.OS === 'ios' ? responsiveWidth(56) : responsiveWidth(66), justifyContent: 'center'}}>
							<Text style = {{fontFamily:'Nunito-Bold', fontSize: responsiveFontSize(3), color: 'white'}} >{Url.title}</Text>
						</View>
						{/*<View style={{width:responsiveWidth(8),justifyContent:"center",alignItems:'center',}}>
							<TouchableOpacity onPress={() => {this.props.navigation.navigate('search')}}>
								<FontAwesome name="search" size={20} color="white" />
							</TouchableOpacity>
					    </View>*/}
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
				<ListView
				    dataSource = {this.state.dataSource}
				    renderRow = {this.renderOrder.bind(this)}
				    refreshControl={this._refreshControl()}
					onEndReached={this.onEndReached.bind(this)}
				/>
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

	_refreshControl(){
    return (
      <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={()=>this._refreshListView()} />
    )
  }

_refreshListView(){
    //Start Rendering Spinner
    this.setState({refreshing:true,
    })
    //Updating the dataSource with new data
   this.getOrders();

  }

	onEndReached(){
		this.getOrders();
	}

	renderOrder(order){

		var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		var date = new Date(order.created)
		var placed_at = date.getDate() + ' ' + month[date.getMonth()] + ' ' + date.getFullYear();
		var status;
		if(order.status == 0){
			status = 'Payment Pending';
		}else{
			status = 'Completed';
		}
		let shareImageBase64 = {
			title: "The Home",
			message: 'Your order is created by your architect please pay for the order using this link \n' + order.invoice_url,
			subject: "Invoice Url" //  for email
		};
		return(

			<View style = {{height: responsiveHeight(32), borderWidth: 1, borderColor: '#e2e2e2', backgroundColor:'white', marginTop: 5, marginBottom:5, flexDirection:'column'}}>
					<View style = {{height: responsiveHeight(10), borderBottomWidth: 1, borderColor:'#e2e2e2', flexDirection: 'row'}}>
						<View style = {{width: responsiveWidth(50), flexDirection: 'column', alignItems: 'flex-start', justifyContent:'center'}}>
							<Text style ={{fontSize: responsiveFontSize(1.8), color: 'black', fontFamily: 'Nunito-Bold', paddingLeft: '5%'}}>Placed On : </Text>
							<Text numberOfLines={1} style ={{fontSize: responsiveFontSize(1.8), color: 'black', fontFamily: 'Nunito-Regular', paddingLeft: '5%'}}>{order.created}</Text>
						</View>
						<View style = {{width: responsiveWidth(50), flexDirection: 'column', alignItems: 'flex-end', justifyContent:'center'}}>
							<Text style ={{fontSize: responsiveFontSize(1.8), color: 'black', fontFamily: 'Nunito-Bold', paddingRight: '5%'}}>Order Id : </Text>
							<Text style ={{fontSize: responsiveFontSize(1.8), color: 'black', fontFamily: 'Nunito-Regular', paddingRight: '5%'}}>{order.ord_id}</Text>
						</View>
					</View>
					<View style = {{flexDirection:'column'}}>
						<View style ={{flexDirection: 'row'}}>
							<View style ={{flexDirection: 'column', width: responsiveWidth(92)}}>
								<View style ={{marginTop: 5}}>
									<Text numberOfLines = {1} style = {{fontSize: responsiveFontSize(2.5), color: 'black', fontFamily: 'Nunito-Bold', paddingLeft: 10}} >{order.name}</Text>
								</View>
								<View style ={{marginTop: 5}}>
									<Text style = {{fontSize: responsiveFontSize(2), color: 'black', fontFamily: 'Nunito-Bold', paddingLeft: 10}} >{order.email}</Text>
								</View>
							</View>
							<View style ={{marginTop: 5, alignItems: 'flex-end',justifyContent: 'center', width: responsiveWidth(5)}}>
								<Ionicons name = 'ios-arrow-forward' color = "grey"  size = {20} />
							</View>
						</View>
						{order.status !== 0 ? <View style = {{height: responsiveHeight(5), justifyContent: 'center'}}>
													<Text style = {{fontSize: responsiveFontSize(1.8), color: 'red', fontFamily: 'Nunito-Bold', paddingLeft: 10}}>{(status).toUpperCase()}</Text>
												</View> : <View style = {{height: responsiveHeight(5), justifyContent: 'center'}}>
													<Text style = {{fontSize: responsiveFontSize(1.8), color: 'green', fontFamily: 'Nunito-Bold', paddingLeft: 10}}>{(status).toUpperCase()}</Text>
												</View>}
						<View style={{ flexDirection: 'row',justifyContent: 'center'}}>
							<TouchableOpacity style ={{backgroundColor: '#F1C65A',width: responsiveWidth(45), height: responsiveHeight(6), alignItems:'center', justifyContent:'center'}} onPress={() => this.props.navigation.navigate('checkout', {invoice_url : order.invoice_url})} >
								<Text style = {{fontSize: responsiveFontSize(2), color: 'black', fontFamily: 'Nunito-Bold'}}>Self Pay</Text>
							</TouchableOpacity>
							<TouchableOpacity style ={{backgroundColor: '#F1C65A',width: responsiveWidth(45), height: responsiveHeight(6), alignItems:'center', justifyContent:'center',marginLeft: 10}} onPress={() => Share.open(shareImageBase64)} >
								<Text style = {{fontSize: responsiveFontSize(2), color: 'black', fontFamily: 'Nunito-Bold'}}>Share Invoice Url</Text>
							</TouchableOpacity>
					</View>
					</View>
				</View>

		)
	}
}
