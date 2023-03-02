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
	WebView,
  NetInfo
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

export default class Checkoutform extends Component{

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
		productArray: '',
    customer_name:'',
    customer_email:'',
    phone_no:'',
    customer_note:'',
    customer_mobile: '',
    emptyview: 0
	}

  componentDidMount(){
    //alert(JSON.stringify(this.props.navigation.state.params.line_items));
    this.getNumberCart();
    this.getCustomer();
		BackHandler.addEventListener('hardwareBackbutton', this.handleBack.bind(this));
  }

  componentWillUnmount(){
		BackHandler.removeEventListener('hardwareBackbutton');
	}

	handleBack(){
 		this.props.navigation.navigate('cart');
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
      })
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

  checkout(){
    this.popupDialog.show();
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
   fetch(Url.domain + '/makeorder',{
      method : 'POST',
        headers : {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body : JSON.stringify({
        "cname": this.state.customer_name,
        "cemail": this.state.customer_email,
        "cmobile": this.state.customer_mobile,
        "cnote":this.state.customer_note,
        "cart" : this.props.navigation.state.params.line_items,
        "architectId": this.state.customerData._id
        })
    }).then((response) => response.json())
      .then((responseData) => {
        if(responseData.code == 200){
          this.popupDialog.dismiss();
          AsyncStorage.removeItem('Architect_cart');
         this.refs.toast.show(responseData.msg, 800);
          this.goToOrders()


        }else{
          this.refs.toast.show(responseData.msg, 500);
        }
      });
      }else{
        alert("No Network ,Try Again");
      }
  })
    
  }

  goToOrders(){
    setTimeout(() => {
      this.call();
    }, 900)
  }

  changeHeight(){
    this.setState({
      emptyview: responsiveHeight(33)
    }, () => {
      
    })
  }

  call(){
    this.props.navigation.navigate('orders');
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
        <ScrollView ref={ref => this.scrollView = ref}>
        <View style ={{flexDirection: 'column', alignSelf:'center', }}>
          <View style = {{width: responsiveWidth(88), alignSelf:'center',marginTop: 10}}>
            <View style = {{marginBottom:10, justifyContent:'center', alignItems:'center'}}>
              <Text style = {{fontFamily:'Nunito-Bold', fontSize: responsiveFontSize(2.6), color: 'black'}}>Customer Details</Text>
            </View>
            <View style = {{marginBottom: 10}}>
              <Text style = {{fontFamily:'Nunito-Bold', fontSize: responsiveFontSize(2.2), color: 'black'}}>Customer Name</Text>
            </View>
            <TextInput
                underlineColorAndroid='transparent'
                placeholder="Customer Name"
                defaultValue = {this.state.customer_name}
                placeholderTextColor = "grey"
                onChangeText={(name) => this.setState({customer_name:name})}
                    style={{width:responsiveWidth(88),fontFamily: 'Nunito-Regular',height:responsiveHeight(6.5),borderRadius: 3,backgroundColor:'white',borderWidth: 0.7,borderColor:'#e2e2e2'}}
              />
          </View>
          <View style = {{width: responsiveWidth(88), alignSelf:'center', marginTop: 10}}>
            <View style = {{marginBottom: 10}}>
              <Text style = {{fontFamily:'Nunito-Bold', fontSize: responsiveFontSize(2.2), color: 'black'}}>Customer Mobile No.</Text>
            </View>
            <TextInput
                underlineColorAndroid='transparent'
                placeholder="Customer Mobile No."
                defaultValue = {this.state.customer_mobile}
                placeholderTextColor = "grey"
                onChangeText={(number) => this.setState({customer_mobile:number})}
                    style={{width:responsiveWidth(88),fontFamily: 'Nunito-Regular',height:responsiveHeight(6.5),borderRadius: 3,backgroundColor:'white',borderWidth: 0.7,borderColor:'#e2e2e2'}}
              />
          </View>
          <View style = {{width: responsiveWidth(88), alignSelf:'center', marginTop: 10}}>
            <View style = {{marginBottom: 10}}>
              <Text style = {{fontFamily:'Nunito-Bold', fontSize: responsiveFontSize(2.2), color: 'black'}}>Customer Email</Text>
            </View>
            <TextInput
                underlineColorAndroid='transparent'
                placeholder="Customer Email"
                defaultValue = {this.state.customer_email}
                placeholderTextColor = "grey"
                onChangeText={(email) => this.setState({customer_email:email})}
                    style={{width:responsiveWidth(88),fontFamily: 'Nunito-Regular',height:responsiveHeight(6.5),borderRadius: 3,backgroundColor:'white',borderWidth: 0.7,borderColor:'#e2e2e2'}}
              />
          </View>
          <View style = {{width: responsiveWidth(88), alignSelf:'center', marginTop: 10}}>
            <View style = {{marginBottom: 10}}>
              <Text style = {{fontFamily:'Nunito-Bold', fontSize: responsiveFontSize(2.2), color: 'black'}}>Note</Text>
            </View>
            <TextInput
                underlineColorAndroid='transparent'
                placeholder="Note"
                defaultValue = {this.state.customer_note}
                placeholderTextColor = "grey"
                onFocus={() => {this.scrollView.scrollToEnd({animated: true})}}
                onChangeText={(note) => this.setState({customer_note:note})}
                    style={{width:responsiveWidth(88),fontFamily: 'Nunito-Regular',height:responsiveHeight(6.5),borderRadius: 3,backgroundColor:'white',borderWidth: 0.7,borderColor:'#e2e2e2'}}
              />
          </View>
          <View style = {{width: responsiveWidth(88), alignSelf:'center', marginTop: 15, marginBottom: 15}}>
            <TouchableOpacity onPress = {() => this.checkout()} style = {{backgroundColor: '#F1C65A', width: responsiveWidth(88), height: responsiveHeight(6.5), borderRadius: 3, alignItems:'center', justifyContent:'center'}}>
              <Text style = {{fontFamily:'Nunito-Bold', fontSize: responsiveFontSize(2.2), color: 'black'}}>Complete</Text>
            </TouchableOpacity>
          </View>
        </View>
        {Platform.OS === 'ios' && <View style={{height: responsiveHeight(33)}} />}
        </ScrollView>
        <Toast ref="toast"/>
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
}
