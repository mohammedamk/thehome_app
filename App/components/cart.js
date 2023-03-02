import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  AsyncStorage,
  ListView,
  BackHandler,
  Platform
} from 'react-native'
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions'
import Url from './../utils/Api'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Toast from 'react-native-easy-toast'
import PopupDialog from 'react-native-popup-dialog'
import * as Progress from 'react-native-progress'
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding'
let discount, discountPer, amount

export default class Cart extends Component {
  state = {
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => true
    }),
    cart_count: 0,
    emptyCart: false,
    item: '',
    totalva: '',
    customer: false,
    customerData: '',
    productArray: ''
  }

  componentDidMount() {
    this.getProducts()
    this.getCustomer()
    this.getNumberCart()
    BackHandler.addEventListener('hardwareBackbutton', this.handleBack.bind(this))
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackbutton')
  }

  handleBack() {
    this.props.navigation.goBack()
    return true
  }

  getCustomer() {
    AsyncStorage.getItem('Architect').then((value) => {
      var tmp = JSON.parse(value)
      if (tmp != null) {
        this.setState({
          customerData: tmp,
          customer: true
        })
      } else {
        this.setState({
          customerData: '',
          customer: false
        })
      }
    })
  }

  getNumberCart() {
    var tmpproduct = {}
    AsyncStorage.getItem('Architect_cart').then((value) => {
      if (value != null) {
        tmpproduct = JSON.parse(value)
        var tmppro = Object.keys(tmpproduct).map((key) => {
          return (tmpproduct[key])
        })
        this.setState({
          cart_count: tmppro.length,
          productArray: tmppro
        })
      } else {
        this.setState({
          cart_count: 0
        })
      }
    }).done()
  }

  getProducts() {
    var tmpprod = {}
    AsyncStorage.getItem('Architect_cart').then((value) => {
      if (value == null) {
        tmpprod = null
        this.setState({
          emptyCart: true
        })
      } else {
        tmpprod = JSON.parse(value)
        var pro = Object.keys(tmpprod).map((key) => {
          return (tmpprod[key])
        })
        if (pro.length === 0) {
          this.setState({
            emptyCart: true
          })
        } else {
          this.setState({
            proarr: pro,
            emptyCart: false,
            dataSource: this.state.dataSource.cloneWithRows(pro)
          })
        }
        this.rendertotal(pro)
      }
    }).done()
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBarPaddingIOS/>
        <View style={{ backgroundColor: '#232f3e', height: responsiveHeight(9) }}>
          <View style={{ height: responsiveHeight(8), flexDirection: 'row' }}>
            {Platform.OS === 'ios' && <View style={{ width: responsiveWidth(10), alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity onPress={() => this.handleBack()}>
                <Entypo name="chevron-small-left" size={28} color="white" />
              </TouchableOpacity>
            </View>}
            <View style={{ width: responsiveWidth(15), alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('DrawerToggle')}>
                <Entypo name="menu" size={28} color="white" />
              </TouchableOpacity>
            </View>
            <View style={{ width: Platform.OS === 'ios' ? responsiveWidth(56) : responsiveWidth(66), justifyContent: 'center' }}>
              <Text style={{ fontFamily: 'Nunito-Bold', fontSize: responsiveFontSize(3), color: 'white' }} >{Url.title}</Text>
            </View>
            {/* <View style={{width:responsiveWidth(8),justifyContent:"center",alignItems:'center',}}>
              <TouchableOpacity onPress={() => {this.props.navigation.navigate('search')}}>
              <FontAwesome name="search" size={20} color="white" />
              </TouchableOpacity>
              </View> */}
            <View style={{ width: responsiveWidth(22), justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => { this.props.navigation.navigate('cart') }} style={{ alignItems: 'flex-start' }}>
                <MaterialCommunityIcons name="cart-outline" size={25} color="white" />
              </TouchableOpacity>
              <View style={{ height: responsiveHeight(2.5), width: responsiveWidth(5), backgroundColor: 'white', borderRadius: 10, position: 'absolute', left: 45, top: 10, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: responsiveFontSize(1.5), color: '#232f3e', fontFamily: 'Nunito-Bold' }}>{this.state.cart_count}</Text>
              </View>
            </View>
          </View>
        </View>
        {this.state.emptyCart === false && <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderProduct.bind(this)}
          contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}
        />}
        {this.state.emptyCart === true && <View style={{ alignItems: 'center', justifyContent: 'center', height: responsiveHeight(91) }}>
          <Text style={{ fontFamily: 'Nunito-Regular', fontSize: responsiveFontSize(2), color: 'black' }}>Your cart is empty!</Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('categories')} style={{ height: responsiveHeight(6), marginTop: 10, width: responsiveWidth(40), backgroundColor: '#F1C65A', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
            <Text style={{ fontFamily: 'Nunito-Regular', fontSize: responsiveFontSize(2), color: 'black' }}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
        }
        {this.state.emptyCart === false && <View style={{ height: responsiveHeight(10), backgroundColor: '#f6f3ed', flexDirection: 'row' }}>
          <View style={{ width: responsiveWidth(60), flexDirection: 'column' }} >
            <View style={{ height: responsiveHeight(5), justifyContent: 'flex-end' }}>
              <Text style={{ fontSize: responsiveFontSize(3), color: 'black', fontFamily: 'Nunito-Bold', paddingLeft: 10 }}>Total {Url.symbol} {Math.round(this.state.totalva)}</Text>
            </View>
            <View style={{ height: responsiveHeight(5), justifyContent: 'center' }}>
              <Text style={{ fontSize: responsiveFontSize(2.2), color: 'black', fontFamily: 'Nunito-Light', paddingLeft: 10 }}>({this.state.item} items)</Text>
            </View>
          </View>
          <View style={{ height: responsiveHeight(10), width: responsiveWidth(40), alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => this.createLineItem()} style={{ height: responsiveHeight(5), width: responsiveWidth(30), backgroundColor: '#F1C65A', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: responsiveFontSize(2.2), color: 'black', fontFamily: 'Nunito-Regular' }} >Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
        }
        <Toast ref="toast" />
        <PopupDialog dismissOnTouchOutside={false} dismissOnHardwareBackPress={false} overlayOpacity={0.9} overlayBackgroundColor="#A9A9A9" width={responsiveWidth(75)} height={responsiveHeight(10)} ref={(popupDialog) => { this.popupDialog = popupDialog }}>
          <View style={{ height: responsiveHeight(10), width: responsiveWidth(75), flexDirection: 'row' }}>
            <View style={{ width: responsiveWidth(20), justifyContent: 'center', alignItems: 'center' }}>
              <Progress.CircleSnail color={['#008744', '#0057e7', '#d62d20', '#ffa700', '#eee']} duration={700} />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={{ fontFamily: 'Nunito-Regular', fontSize: responsiveFontSize(2), color: 'black' }}>Loading...</Text>
            </View>
          </View>
        </PopupDialog>
      </View>
    )
  }

  renderProduct(product) {
    var id
    if (product.node.variants.length > 1) {
      id = product.var_id
    } else {
      id = 0
    }
    if (product.node.images.length === 0) {
      var image = 'https://www.123securityproducts.com/media/catalog/product/cache/1/image/265x/5e06319eda06f020e43594a9c230972d/placeholder/default/Pho_Unavail_base.jpg'
    } else {
      var image = product.node.images[0].src
    }

    if (product.discount_details != null) {
      if (product.discount_details.type === 'fixed_amount') {
        discount = product.discount_details.value
        discountPer = Math.round((discount / product.node.variants[id].price) * 100)
        amount = product.node.variants[id].price - discount
      } else if (product.discount_details.type === 'percentage') {
        discountPer = product.discount_details.value
        discount = (product.node.variants[id].price * discountPer) / 100
        amount = product.node.variants[id].price - discount
      } else {
        compare = false
        amount = product.node.variants[id].price
      }
    } else {
      compare = false
      amount = product.node.variants[id].price
    }

    return (
      <View style={{ flexDirection: 'column' }} >
        <View style={{ height: responsiveHeight(34), flexDirection: 'row', backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#e2e2e2', marginTop: 10 }}>
          <View style={{ height: responsiveHeight(34), width: responsiveWidth(38), alignItems: 'center', justifyContent: 'center', marginLeft: 10 }}>
            <Image source={{ uri: image }} style={{ height: responsiveHeight(30), width: responsiveWidth(37), alignSelf: 'center' }} resizeMode="contain" />
          </View>
          <View style={{ flexDirection: 'column', width: responsiveWidth(60) }}>
            <View style={{ height: responsiveHeight(5), marginLeft: 10, marginTop: 10 }}>
              <Text numberOfLines={1} style={{ fontSize: responsiveFontSize(2), color: 'black', fontFamily: 'Nunito-Regular' }}>{product.node.title}</Text>
            </View>
            {product.node.variants.length > 1 && <View style={{ height: responsiveHeight(5), marginLeft: 10 }}>
              <Text numberOfLines={1} style={{ fontFamily: 'Nunito-Regular', fontSize: responsiveFontSize(1.8), color: 'black' }}>{product.node.variants[id].title}</Text>
            </View>}
            <View style={{ height: responsiveHeight(5), flexDirection: 'row', marginLeft: 8 }}>
								<Entypo name = 'check' color = 'green' size = {20}/>
								<Text style = {{fontFamily: 'Nunito-Regular', fontSize: responsiveFontSize(1.8),  color: 'green', paddingLeft: 5}} >In Stock {product.node.variants[id].inventory_quantity} Units Left</Text>
							</View>
							<View style = {{height: responsiveHeight(5), flexDirection:'row', marginLeft:8}}>
								<TouchableOpacity onPress = {() => this.deleteItem(product)} style = {{flexDirection:'row'}}>
									<MaterialIcons name = 'delete' color = 'grey' size = {20}/>
									<Text style = {{fontFamily: 'Nunito-Regular', fontSize: responsiveFontSize(1.8),  color: 'grey', paddingLeft: 5}} >Remove</Text>
								</TouchableOpacity>
							</View>
							<View style = {{flexDirection:'row'}}>
								<View style = {{ alignItems:'flex-start', justifyContent:'center', marginLeft: 10}}>
									<Text style = {{fontFamily: 'Nunito-Bold', fontSize: responsiveFontSize(2), color: '#b12704',  }}>{Url.symbol} {Math.round(((amount)* product.quantity).toFixed(2))}</Text>
								</View>
								{product.discount_details != null && <View style = {{alignItems:'flex-start', justifyContent:'center', marginLeft: 10}}>
									<Text style = {{fontFamily: 'Nunito-Regular', fontSize: responsiveFontSize(2), color: 'grey', textDecorationLine: 'line-through'}}>{Url.symbol} {Math.round(((product.node.variants[id].price)* product.quantity).toFixed(2))}</Text>
								</View>}
							</View>
							{product.node.variants[id].inventory_quantity > 1 && <View style = {{flexDirection:'row', marginTop: 10}}>
															<View style ={{flexDirection:'row', backgroundColor:'#e2e2e2',borderRadius: 5,  height:responsiveHeight(5),   width:responsiveWidth(30),  alignSelf:'flex-start', marginLeft: 10}}>
																	<TouchableOpacity onPress ={() => {this.minusValue(product)}}>
																		<View style = {{width:responsiveWidth(10),alignItems:'center',paddingTop:3,}}>
																			<Entypo name = 'minus' size ={23} color = 'black' style={{paddingTop:0}} />
																		</View>
																	</TouchableOpacity>
																<View style = {{width:responsiveWidth(8), alignItems:'center', paddingTop:3,}}>
																	<Text style={{fontFamily:'Nunito-Regular',fontSize:responsiveFontSize(2.5),color:'black',}}>{product.quantity}</Text>
																</View>
																<TouchableOpacity onPress ={() => {this.addValue(product)}}>
																<View style = {{width:responsiveWidth(10), alignItems:'center', paddingTop:3,}}>
																	<Ionicons name = 'md-add' size ={23} color = 'black' style={{paddingTop:0}} />
																</View>
																</TouchableOpacity>
															</View>
														</View>}
						</View>
					</View>
				</View>
		);
	}

	createLineItem(){
		if(this.state.customerData == ''){
			this.props.navigation.navigate('architectsignin');
		}else{
			this.popupDialog.show();
		var lineItems = new Array();
		var product = this.state.productArray;
		//alert(JSON.stringify(product));
		Object.keys(product).map(function(key) {
			var pro = {
				"product_var_id" : product[key].variant_id,
				"qty" : product[key].quantity,
			}
			lineItems.push(pro);
		})
		//alert(JSON.stringify(lineItems))
		this.props.navigation.navigate('checkoutform', {line_items: lineItems});
			//this.checkout(lineItems);
		}

		//alert(JSON.stringify(lineItems));
	}

	checkout(lineItems){
		fetch(Url.main + '/draftOrder',{
			method : 'POST',
    		headers : {
    			'Accept': 'application/json',
      			'Content-Type': 'application/json'
    		},
    		body : JSON.stringify({
				"shopnamefull": Url.shopFullName,
				"shopname": Url.shopName,
				"line_items" : lineItems,
				"customer_id": this.state.customerData.id
    		})
		}).then((response) => response.json())
			.then((responseData) => {
				if(responseData.code == 200){
					this.popupDialog.dismiss();
					AsyncStorage.removeItem('Architect_cart');
					//alert(JSON.stringify(responseData))
					this.props.navigation.navigate('checkout', {invoice : responseData.result.invoice_url});
				}else{
					this.refs.toast.show(responseData.msg, 500);
				}
			});
	}

	addValue(product){
		var tmppro = {};
		AsyncStorage.getItem("Architect_cart").then((value) => {
			if(value != null)
			{
			tmppro = JSON.parse(value);
			}
			if(tmppro!=null && tmppro[product.variant_id]){
				var tmpdic = tmppro[product.variant_id];
				if(tmpdic.quantity === product.node.variants[product.var_id].inventory_quantity){
					tmpdic.quantity = tmpdic.quantity;
				}
				else{
					tmpdic.quantity = tmpdic.quantity + 1;
				}
				tmppro[product.variant_id] = tmpdic;
				AsyncStorage.mergeItem("Architect_cart", JSON.stringify(tmppro));
			}
		}).done(()=> {AsyncStorage.getItem("Architect_cart").then((value) => {
			var tmpproduct = JSON.parse(value);
			var tmppro = Object.keys(tmpproduct).map(function(key) {
				return(tmpproduct[key])
			});
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(tmppro),
			});
			this.rendertotal(tmppro);
			this.getNumberCart();
		}).done()});
	}

	minusValue(product){
		var tmppro = {};
		AsyncStorage.getItem("Architect_cart").then((value) => {
			if(value != null)
			{
			tmppro = JSON.parse(value);
			}
			if(tmppro != null && tmppro[product.variant_id]){
				var tmpdic = tmppro[product.variant_id];
				if(tmpdic.quantity === 1){
					tmpdic.quantity = 1;
				}else{
					tmpdic.quantity = tmpdic.quantity - 1;
				}
				tmppro[product.variant_id] = tmpdic;
				AsyncStorage.mergeItem("Architect_cart", JSON.stringify(tmppro));
			}
		}).done(()=> {AsyncStorage.getItem("Architect_cart").then((value) => {
			var tmpproduct = JSON.parse(value);
			var tmppro = Object.keys(tmpproduct).map(function(key) {
				return(tmpproduct[key])
			});
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(tmppro),
			});
			 this.rendertotal(tmppro);

			this.getNumberCart();
		}).done()});
	}

	deleteItem(product){
		var tmppro = {};
		AsyncStorage.getItem("Architect_cart").then((value) => {
			if(value != null)
			{
			tmppro = JSON.parse(value);
			}
			if(tmppro!=null && tmppro[product.variant_id]){
				delete tmppro[product.variant_id];
				 AsyncStorage.removeItem("Architect_cart");
				 AsyncStorage.setItem("Architect_cart", JSON.stringify(tmppro));
			}
		}).done(() => {AsyncStorage.getItem("Architect_cart").then((value) => {
				if(value == ''){
					var tmppro1 = JSON.parse(value);
					this.setState({
						dataSource: this.state.dataSource.cloneWithRows({}),
					});
					this.rendertotal(value);
					//this.renderNot();
				}else{
					var tmpproduct = JSON.parse(value);
					var tmppro = Object.keys(tmpproduct).map(function(key) {
						return(tmpproduct[key])
					});
					this.setState({
						dataSource: this.state.dataSource.cloneWithRows(tmppro),
					});
					this.rendertotal(tmppro);
				}
			}).done(() => {this.getNumberCart(); this.getProducts()})});
	}

	rendertotal(product){
		//alert(JSON.stringify(product))
		if(product == ''){
			this.setState({
				item: 0,
				totalva: 0,
			})
		}
		if(product == null){
			this.setState({
				item: 0,
				totalva: 0,
			})
		}else{
				var add=0;
				//alert(JSON.stringify(product))
				for(var i = 0; i< product.length; i++){
					var quantity = product[i].quantity;
					//alert('hehehehehe'+JSON.stringify(product[i].node.variants[id].price))
					var dis_count, dis_per_centage, am_ount;

					var id;
					if(product[i].node.variants.length > 1){
						id = product[i].var_id;
					}else{
						id = 0;
					}

					if(product[i].discount_details != null){
						if(product[i].discount_details.type == 'fixed_amount'){
							 dis_count = product[i].discount_details.value;
							 dis_per_centage = Math.round((dis_count/product[i].node.variants[id].price)* 100);
							 am_ount = product[i].node.variants[id].price - dis_count;
						}else if(product[i].discount_details.type == 'percentage'){
							 dis_per_centage = product[i].discount_details.value;
							 dis_count = (product[i].node.variants[id].price * dis_per_centage)/100;
							 am_ount = product[i].node.variants[id].price - dis_count;
						}else{
							 am_ount = product[i].node.variants[id].price;
						}
					}else{
						 dis_count=0;
						 am_ount = product[i].node.variants[id].price;
					}



					var price = product[i].node.variants[product[i].var_id].price - dis_count;
					total = quantity*price;
					add=add+total;
					this.setState({
						totalva: (add).toFixed(2)
					});
				}
				this.setState({
					item: product.length,
				})
				//alert("totalamount:- "+JSON.stringify(this.state.totalva))
			}
	}
}
