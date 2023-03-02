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
	Alert,
	BackHandler
} from 'react-native';

import ImageSlider from 'react-native-image-slider';
import { responsiveHeight, responsiveWidth, responsiveFontSize} from 'react-native-responsive-dimensions';
import Url from './../utils/Api';
import Entypo from 'react-native-vector-icons/Entypo';
import Zocial from 'react-native-vector-icons/Zocial';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackNavigator, navigation, DrawerNavigator } from 'react-navigation';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import Toast, {DURATION} from 'react-native-easy-toast';
import PopupDialog from 'react-native-popup-dialog';
import * as Progress from 'react-native-progress';

export default class SignIn extends Component{

	constructor(props) {
	        super(props);

	        this.state = {
	        	customerlogin:true,
	        	createvisible:false,
	        	colorChangeLogin: 'white',
	        	colorChangeReg: 'grey',
	        	Name: '',
	        	Password: '',
	        	MobileNo:'',
	        	Email:'',
	        	Login_Email:'',
	        	Login_Password:''
	        };
	    }

	onSelect(index, value){
		if(index==0){
			this.setState({
			    customerlogin:false,
			    createvisible:true,
			    colorChangeLogin: 'grey',
			    colorChangeReg:'white'
			})
		}else{
			this.setState({
			    customerlogin:true,
			    createvisible:false,
			    colorChangeLogin: 'white',
			    colorChangeReg:'grey'
			  })
			}
	}

	componentDidMount(){
		BackHandler.addEventListener('hardwareBackbutton', this.handleBack.bind(this));
	}

	handleBack(){
 		this.props.navigation.navigate('home');
 		return true;
 	}

	componentWillUnmount(){
		BackHandler.removeEventListener('hardwareBackbutton');
	}


	registration(){
		this.popupDialog.show();
		fetch(Url.main + '/registration',{
			method : 'POST',
    		headers : {
    			'Accept': 'application/json',
      			'Content-Type': 'application/json'
    		},
    		body : JSON.stringify({
				"name" : this.state.Name,
				"email": this.state.Email,
				"shopName": Url.shopFullName,
				"mobileNo": this.state.MobileNo,
				"password": this.state.Password
    		})
		}).then((response) => response.json())
			.then((responseData) => {
				if(responseData.code == 100){
					this.popupDialog.dismiss();
					this.refs.toast.show(responseData.msg, 2000);
				}else{
					this.popupDialog.dismiss();
					this.refs.toast.show(responseData.msg, 500);
					this.saveCustomer(responseData.result);
					
				}
			});
	}

	login(){
		this.popupDialog.show();
		fetch(Url.main + '/login',{
			method : 'POST',
    		headers : {
    			'Accept': 'application/json',
      			'Content-Type': 'application/json'
    		},
    		body : JSON.stringify({
				"email": this.state.Login_Email,
				"shopFullName": Url.shopFullName,
				"password": this.state.Login_Password
    		})
		}).then((response) => response.json())
			.then((responseData) => {
				if(responseData.code == 404){
					this.popupDialog.dismiss();
					this.refs.toast.show(responseData.msg, 2000);
				}else{
					this.popupDialog.dismiss();
					this.refs.toast.show(responseData.msg, 500);
					this.saveCustomer(responseData.result);
					
				}
			});
	}

	saveCustomer(customer){
		AsyncStorage.setItem("Customer", JSON.stringify(customer));
		setTimeout(() =>{this.gotohome();},600);
	}

	gotohome(){
	this.props.navigation.navigate('home');	
	}

	render(){
		return(
			<View style={{flex:1, backgroundColor:'white'}}>
				<View style = {{height: responsiveHeight(7.5), borderBottomWidth: 1, borderColor: '#e2e2e2', alignItems: 'center', justifyContent: 'center', backgroundColor:'#e2e2e2'}} >
					<Text style = {{fontFamily: 'Nunito-Bold', color: 'black', fontSize: responsiveFontSize(3)}} >Shopify App</Text>
				</View>
				<View style = {{flexDirection: 'column'}}>
					<View style = {{height: responsiveHeight(7.5), width: responsiveWidth(92), alignSelf:'center'}} > 
						<Text style = {{fontFamily: "Nunito-ExtraBold", color: 'black', fontSize: responsiveFontSize(3.5)}}>Welcome</Text>
					</View>
					<View style = {{ width: responsiveWidth(92), alignSelf:'center',borderWidth: 1, borderColor: '#e2e2e2'}}>
						<RadioGroup color='grey' activeColor = 'orange' highlightColor = '' selectedIndex={1} onSelect = {(index, value) => this.onSelect(index, value)}>
							<RadioButton style = {{}}>
								<View>
									<View style = {{flexDirection:'row'}}>
									  <View>
							          	<Text style = {{fontSize:responsiveFontSize(2), fontFamily: 'Nunito-ExtraBold', color: 'black'}}>Create an account.</Text>
							          </View>
							          <View style={{ alignItems: 'center', justifyContent: 'center'}}>
											<Text style = {{fontSize:responsiveFontSize(1.5), fontFamily: 'Nunito-Regular', color: 'black'}}>  New to ShopifyApp?</Text>
										</View>
							        </View>
							        {this.state.createvisible &&
							        	<View style={{marginTop:10,width:responsiveWidth(92)}}>
							        		<View style={{height: responsiveHeight(35),justifyContent:'center'}}>
												<View style={{width:responsiveWidth(75)}}>
													<TextInput
									  					 underlineColorAndroid='transparent'
									  					 placeholder="Name"
									  					 placeholderTextColor = "grey"
									  					 onChangeText={(name) => this.setState({Name:name})}
											             style={{width:responsiveWidth(75),fontFamily: 'Nunito-Regular',height:responsiveHeight(6.5),borderRadius: 3,backgroundColor:'white',borderWidth: 0.7,borderColor:'#e2e2e2'}}
									  					/>
												</View>
												<View style={{marginTop:5}}>
													<TextInput
									  					 underlineColorAndroid='transparent'
									  					 placeholder="Email Address"
									  					 placeholderTextColor = "grey"
									  					 onChangeText={(email) => this.setState({Email:email})}
											             style={{width:responsiveWidth(75), fontFamily: 'Nunito-Regular',height:responsiveHeight(6.5),borderRadius: 3,backgroundColor:'white',borderWidth: 0.7,borderColor:'#e2e2e2'}}
									  					/>
												</View>
												<View style={{marginTop:5}}>
													<TextInput
									  					 underlineColorAndroid='transparent'
									  					 placeholder="Mobile No."
									  					 placeholderTextColor = "grey"
									  					 onChangeText={(mobileNo) => this.setState({MobileNo:mobileNo})}
											             style={{width:responsiveWidth(75), fontFamily: 'Nunito-Regular',height:responsiveHeight(6.5),borderRadius: 3,backgroundColor:'white',borderWidth: 0.7,borderColor:'#e2e2e2'}}
									  					/>
												</View>
												<View style={{marginTop:5}}>
													<TextInput
									  					 underlineColorAndroid='transparent'
									  					 placeholder="Password"
									  					 secureTextEntry = {true}
									  					 placeholderTextColor = "grey"
									  					 onChangeText={(password) => this.setState({Password:password})}
											             style={{width:responsiveWidth(75), fontFamily: 'Nunito-Regular',height:responsiveHeight(6.5),borderRadius: 3,backgroundColor:'white',borderWidth: 0.7,borderColor:'#e2e2e2'}}
									  					/>
												</View>
												<View style={{marginTop:5}}>
													<TouchableOpacity onPress = {() => this.registration()} style = {{height: responsiveHeight(7),width:responsiveWidth(75), borderRadius: 3, borderWidth: 1, alignItems: 'center', justifyContent:'center', borderColor:'#e2e2e2', backgroundColor:'#F1C65A'}}>
														<Text>Continue</Text>
													</TouchableOpacity>
												</View>
											</View>
							        	</View>
							        }
							    </View>
					        </RadioButton>
					 
					        <RadioButton style = {{}}>
					        	<View style={{}}>
							         <View style = {{flexDirection:'row'}}>
							         	<View>
											<Text style = {{fontSize:responsiveFontSize(2), fontFamily: 'Nunito-ExtraBold', color: 'black'}}>Login.</Text>
										</View>
										<View style={{ alignItems: 'center', justifyContent: 'center'}}>
											<Text style = {{fontSize:responsiveFontSize(1.5), fontFamily: 'Nunito-Regular', color: 'black'}}>  Already a customer?</Text>
										</View>
									</View>
									{this.state.customerlogin && 
										<View style={{marginTop:10,width:responsiveWidth(92)}}>
											<View style={{height: responsiveHeight(13),justifyContent:'center',}}>
												<View style={{width:responsiveWidth(75)}}>
													<TextInput
									  					 underlineColorAndroid='transparent'
									  					 placeholder="Email"
									  					 placeholderTextColor = "grey"
									  					 onChangeText={(login_email) => this.setState({Login_Email:login_email})}
											             style={{width:responsiveWidth(75),fontFamily: 'Nunito-Regular',height:responsiveHeight(6.5),borderRadius: 3,backgroundColor:'white',borderWidth: 0.7,borderColor:'#e2e2e2e2'}}
									  					/>
												</View>
												<View style={{marginTop:5}}>
													<TextInput
									  					 underlineColorAndroid='transparent'
									  					 placeholder="password"
									  					 secureTextEntry = {true}
									  					 placeholderTextColor = "grey"
									  					 onChangeText={(login_password) => this.setState({Login_Password:login_password})}
									  					 style={{width:responsiveWidth(75), fontFamily: 'Nunito-Regular',height:responsiveHeight(6.5),borderRadius: 3,backgroundColor:'white',borderWidth: 0.7,borderColor:'#e2e2e2e2'}}
									  					/>
												</View>
											</View>
											<View style = {{width: responsiveWidth(68),marginTop:5, justifyContent: 'center', alignItems: 'center',alignSelf:'flex-end',}} >
									    		<TouchableOpacity >
									    			<Text style = {{fontFamily:'Nunito-Regular', fontSize:15, color:'#46b07b'}} >Forgot Password?</Text>
									    		</TouchableOpacity>
									    	</View>
											<View style={{width:responsiveWidth(75),height:responsiveHeight(7),marginTop:5,alignItems: 'center',justifyContent:'center'}}>
												<TouchableOpacity onPress = {() => this.login()} style = {{height: responsiveHeight(7),width:responsiveWidth(75), borderRadius: 3, borderWidth: 1, alignItems: 'center', justifyContent:'center', borderColor:'#e2e2e2', backgroundColor:'#F1C65A'}}>
													<Text>Continue</Text>
												</TouchableOpacity>
											</View>
										</View>
									}
								</View>
					        </RadioButton>
						</RadioGroup>
					</View>
				</View>
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
		);
	}
}