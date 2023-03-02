
import { StackNavigator, DrawerNavigator } from 'react-navigation'
import Categories from './categories'
import CategorizedProducts from './categorizedProducts'
import ExclusiveProduct from './exclusiveProduct'
import Cart from './cart'
import ViewProduct from './viewproduct'
import Checkout from './checkout'
import Orders from './orders'
import ViewOrder from './vieworder'
import Account from './account'
import ArchitectSignin from './architectsignin'
import Checkoutform from './checkoutform'
import ForgotPassword from './forgetpassword'
import BasicDetailEdit from './basicDetailEdit'
import Search from './search'
import Contactus from './contactus'
import Privacy from './privacy'
import NavigationDrawer from './../utils/components/navigationDrawer'

const RootDrawer = DrawerNavigator({
  categories: { screen: Categories },
  exclusiveProduct: { screen: ExclusiveProduct },
  cart: { screen: Cart },
  viewProduct: { screen: ViewProduct },
  checkout: { screen: Checkout },
  checkoutform: { screen: Checkoutform },
  orders: { screen: Orders },
  vieworder: { screen: ViewOrder },
  account: { screen: Account },
  categorizedProducts: { screen: CategorizedProducts },
  contact: { screen : Contactus},
  privacy: { screen: Privacy }
}, {
  contentComponent: NavigationDrawer
})

const RootNavigator = StackNavigator({
  drawerstack: { screen: RootDrawer },
  architectsignin: { screen: ArchitectSignin },
  forgotpassword: { screen: ForgotPassword },
  basicdetailedit: { screen: BasicDetailEdit },
  search: { screen: Search },
},
{
  headerMode: 'none'
})

export default RootNavigator
