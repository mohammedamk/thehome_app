import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  AsyncStorage,
  ListView,
  BackHandler,
  BackAndroid
} from 'react-native'

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions'
import Url from './../utils/Api'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Item from './item'
import Toast from 'react-native-easy-toast'
import PopupDialog from 'react-native-popup-dialog'
import * as Progress from 'react-native-progress'

export default class ExclusiveProduct extends Component {
  constructor(props) {
    super(props)
    this.data = []
    this.cartDictionary = []
    AsyncStorage.setItem('cart', {})
    this.state = {
      cart_count: 0,
      position: 1,
      interval: null,
      showcomapreprice: true,
      customerData: '',
      customer: false,
      variant_id: '',
      var_id: 0,
      product_page: 1,
      total_page: 0,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    }
  }

  componentDidMount() {
    this.popupDialog.show()
    BackHandler.addEventListener('hardwareBackbutton', this.handleBack.bind(this))
    // this.fetchProducts(this.props.navigation.state.params.collection_id)
    this.getCustomer()
    this.getNumberCart()
    this.getproductcount()
  }

  getproductcount() {
    fetch(Url.domain + '/getProductCount', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((response) => response.json())
      .then((responseData) => {
        // alert(JSON.stringify(responseData));
        if (responseData.code === 200) {
          const count = responseData.productCount
          const page = Math.ceil(count / 50)
          this.setState({
            total_page: page
          })
          this.fetchProducts()
        }
        // this.setState({
        //   dataSource: this.state.dataSource.cloneWithRows(responseData),
        // })
      }).done()
  }

  getCustomer() {
    AsyncStorage.getItem('Architect').then((value) => {
      const tmp = JSON.parse(value)
      if (tmp !== null) {
        this.setState({
          customerData: tmp,
          customer: true
        })
      // alert('helloooooo')
      } else {
        this.setState({
          customerData: '',
          customer: false
        })
        this.props.navigation.navigate('architectsignin')
      }
    })
  }

  getNumberCart() {
    let tmpproduct = {}
    AsyncStorage.getItem('Architect_cart').then((value) => {
      if (value !== null) {
        tmpproduct = JSON.parse(value)
        const tmppro = Object.keys(tmpproduct).map((key) => {
          return (tmpproduct[key])
        })
        this.setState({
          cart_count: tmppro.length
        })
      } else {
        this.setState({
          cart_count: 0
        })
      }
    }).done()
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackbutton')
  }

  handleBack() {
    this.props.navigation.navigate('categories');
    //BackAndroid.exitApp()
    return true
  }

  fetchProducts() {
    fetch(Url.domain + '/getProducts/' + this.state.product_page, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((response) => response.json())
      .then((responseData) => {
        // alert(JSON.stringify(responseData))
        if (responseData.code === 200) {
          this.data = this.data.concat(responseData.products)
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.data),
            product_page: this.state.product_page + 1
          })
        }
      }).done(() => this.popupDialog.dismiss())
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: '#232f3e', height: responsiveHeight(9) }}>
          <View style={{ height: responsiveHeight(8), flexDirection: 'row' }}>
            <View style={{ width: responsiveWidth(15), alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('DrawerToggle')}>
                <Entypo name="menu" size={28} color="white" />
              </TouchableOpacity>
            </View>
            <View style={{ width: responsiveWidth(66), justifyContent: 'center' }}>
              <Text style={{ fontFamily: 'Nunito-Bold', fontSize: responsiveFontSize(3), color: 'white' }}>{Url.title}</Text>
            </View>
            {/* <View style={{width:responsiveWidth(8),justifyContent:"center",alignItems:'center',}}>
              <TouchableOpacity onPress={() => {this.props.navigation.navigate('search')}}>
                <FontAwesome name="search" size={20} color="white" />
              </TouchableOpacity>
            </View> */}
            <View style={{ width: responsiveWidth(22), justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => { this.props.navigation.navigate('cart') }} style={{ alignItems: 'flex-start' }} >
                <MaterialCommunityIcons name="cart-outline" size={25} color="white" />
              </TouchableOpacity>
              <View style={{ height: responsiveHeight(2.5), width: responsiveWidth(5), backgroundColor: 'white', borderRadius: 10, position: 'absolute', left: 45, top: 10, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: responsiveFontSize(1.5), color: '#232f3e', fontFamily: 'Nunito-Bold' }}>{this.state.cart_count}</Text>
              </View>
            </View>
          </View>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderProduct.bind(this)}
          onEndReached={this.onEndReached.bind(this)}
          contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}
        />
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

  onEndReached() {
    if (this.state.product_page <= this.state.total_page) {
      this.fetchProducts()
    }
  }

  renderProduct(product) {
    let compare = true
    let addToCart = true
    let showPerView = false
    let discount, discountPer, amount
    if (product.productDiscount !== null) {
      if (product.productDiscount.type === 'fixed_amount') {
        showPerView = false
         discount = product.productDiscount.value
         discountPer = Math.round((discount / product.productDetails.variants[0].price) * 100)
         amount = product.productDetails.variants[0].price - discount
      } else if (product.productDiscount.type === 'percentage') {
        showPerView = true
         discountPer = product.productDiscount.value
         discount = (product.productDetails.variants[0].price * discountPer)/100
         amount = product.productDetails.variants[0].price - discount
      } else {
        compare = false
         amount = product.productDetails.variants[0].price
      }
    } else {
      compare = false
       amount = product.productDetails.variants[0].price
    }
    let image
    if (product.productDetails.image !== null) {
      image = product.productDetails.image.src
    } else {
      image = 'https://www.123securityproducts.com/media/catalog/product/cache/1/image/265x/5e06319eda06f020e43594a9c230972d/placeholder/default/Pho_Unavail_base.jpg'
    }
    // if(product.variants[0].compare_at_price==null){
    // compare=false;
    // }else{
    // var discount = product.variants[0].compare_at_price - product.variants[0].price;
    // var discountPer = Math.round((discount/product.variants[0].compare_at_price)* 100);
    // }
    if (product.productDetails.variants[0].inventory_quantity === 0) {
      addToCart = false
    }

    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('viewProduct', { product: product, flag: 'categorizedProduct' })}>
        <View style={{ height: responsiveHeight(44), width: responsiveWidth(45.8), borderRightWidth: 1, borderColor: '#e2e2e2', marginTop: 10, borderBottomWidth: 1, backgroundColor: 'white', marginLeft: 10, flexDirection: 'column'}}>
          <View style = {{height: responsiveHeight(25), alignItems: 'center'}}>
<Image source = {{uri: image}} style = {{height: responsiveHeight(25), width: responsiveWidth(45)}} />
</View>
<View style={{flexDirection:'row'}}>
<View style = {{height: responsiveHeight(5), alignItems:'flex-start', marginTop: 10}}>
<Text style = {{fontSize: responsiveFontSize(1.8), color: '#b12704', fontFamily: 'Nunito-Bold', paddingLeft: 10}} >{Url.symbol} {amount}</Text>
</View>
{compare &&
<View style = {{flexDirection: 'row'}}>
<View style = {{width:responsiveWidth(15),height: responsiveHeight(3), alignSelf:'center',justifyContent:'center',paddingLeft: '5%'}}>
<Text numberOfLines = {1} style = {{fontSize: responsiveFontSize(1.8), color: 'grey', fontFamily: 'Nunito-Light',textDecorationLine:'line-through'}} >{Url.symbol} {product.productDetails.variants[0].price}</Text>
</View>
{showPerView && <View style = {{backgroundColor: "#F1C65A", marginLeft: '5%', borderRadius: 5, height: responsiveHeight(3), width: responsiveWidth(7), alignSelf: 'center', alignItems: 'center', justifyContent:'center'}} >
<Text numberOfLines = {1} style = {{fontSize: responsiveFontSize(1.5), color: '#b12704', fontFamily: 'Nunito-Bold'}}>{discountPer}%</Text>
</View>}
</View>
}
</View>
<View style = {{height: responsiveHeight(5), width: responsiveWidth(40), alignItems:'flex-start', alignSelf: 'center'}}>
<Text numberOfLines = {1} style = {{fontSize: responsiveFontSize(2), color: 'black', fontFamily: 'Nunito-Regular'}} >{product.productDetails.title}</Text>
</View>
{addToCart && <View style = {{height: responsiveHeight(6), alignItems: 'center'}}>
<TouchableOpacity onPress={() => this.addToCart(product)} style = {{height: responsiveHeight(5), borderRadius: 3, borderWidth: 1, alignItems: 'center', justifyContent:'center', borderColor:'#e2e2e2', width: responsiveWidth(40), backgroundColor:'#F1C65A'}} >
<Text style = {{fontSize: responsiveFontSize(2), color:'black', fontFamily:'Nunito-Regular'}} >Add to Cart</Text>
</TouchableOpacity>
</View>
}
{addToCart == false && <View style = {{height: responsiveHeight(6), alignItems: 'center'}}>
<View style = {{height: responsiveHeight(5), borderRadius: 3, borderWidth: 1, alignItems: 'center', justifyContent:'center', borderColor:'#fff', width: responsiveWidth(40), backgroundColor:'transparent'}} >
<Text style = {{fontSize: responsiveFontSize(2), color:'red', fontFamily:'Nunito-Regular'}} >Out of Stock</Text>
</View>
</View>
}
</View>
</TouchableOpacity>
);
}



	addToCart(products){
		console.log("Add to cart called");
		this.refs.toast.show('Added to cart', 500);
		var product = new Item();
		product.node = products.productDetails;
		product.variant_id = products.productDetails.variants[this.state.var_id].id;
		product.var_id = this.state.var_id;
		product.discount_details = products.productDiscount;
		console.log(product);
		var tmpCartDictionary ={};
		var tmpCartDictionaryImmutable = {}
		AsyncStorage.getItem("Architect_cart").then((value) => {
			if(value != null)
			{
				tmpCartDictionary = JSON.parse(value);
			}
				if(tmpCartDictionary!=null && tmpCartDictionary[product.variant_id])
				{
					console.log("temp dict had data");
					var tmpQuantity = (tmpCartDictionary[product.variant_id]).quantity;
					//alert(tmpQuantity)
					console.log("tmp quantity:- "+ tmpQuantity);
					//condn to check total qty
					if(tmpQuantity === products.productDetails.variants[this.state.var_id].inventory_quantity){
						product.quantity = tmpQuantity
					}else{
						product.quantity = tmpQuantity + 1;
					}

					tmpCartDictionary[product.variant_id] = product;
					AsyncStorage.mergeItem("Architect_cart", JSON.stringify(tmpCartDictionary));
				}else {
					if(tmpCartDictionary ==null)
					{
							tmpCartDictionary = {};
					}

					console.log("temp dict didn't had data");
					product.quantity = 1;
					tmpCartDictionary[product.variant_id] = product;
					AsyncStorage.setItem("Architect_cart",JSON.stringify(tmpCartDictionary));
			}
 		}).done(() => {this.getNumberCart()});
	 console.log("After set item to cart:- " +JSON.stringify(tmpCartDictionary));
			console.log("After set item to cart:- " + JSON.stringify(tmpCartDictionary));

	}

}
