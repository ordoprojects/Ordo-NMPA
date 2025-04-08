import React, { useContext,useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import UserList from "../screens/UsersList";
import Chat from "../screens/Chat";
import { createStackNavigator } from "@react-navigation/stack";
import Search from "../screens/Search";
import Login from "../screens/Login";
import BottomTab from "./BottomTab";
import MIList from "../screens/MIList";
import MIListDetail from "../screens/MIListDetail";
import CreatePlan from "../screens/CreatePlan";
import OrderwiseReport from "../screens/OrderwiseReport";
import PlanDetails from "../screens/PlanDetails";
import Map from "../screens/Map";
import CheckIn from "../screens/CheckIn";
import ReturnsCart from "../screens/ReturnsCart";
import ProductDetails from "../screens/ProductDetails";
import CheckInInventory from "../screens/CheckInventory";
import CompetitorIntelligence from "../screens/CompetitorIntelligence";
import Invoice from "../screens/Invoice";
import ReturnOrderDetails from "../screens/ReturnOrderDetails";
import PreviousVisits from "../screens/PreviousVisits";
import MyPerformance from "../screens/MyPerformance";
import AdminPromotions from "../screens/AdminPromotions";
import AdminHome from "../screens/AdminHome";
import AdminOrders from "../screens/AdminOrders";
import AdminStores from "../screens/AdminStores";
import AdminOrderCart from "../screens/AdminOrderCart";
import AdminCreateOrder from "../screens/AdminCreateOrder";
// import Scanner from '../screens/AdminOrderCart/scanner';
import AdminOrderReview from "../screens/AdminOrderReview";
import SalesManagerHome from "../screens/SalesManagerHome";
import { AuthContext } from "../Context/AuthContext";
import MerchHome from "../screens/MerchHome";
import SMTourPlanDetails from "../screens/SMTourPlanDetails";
import SMApprovedPlanDetails from "../screens/SMAprrovedPlanDetails";
import SMCreatePlan from "../screens/SMCreatePlan";
import OrderMgmt from "../screens/OrderMgmt";
import MerchAddProduct from "../screens/MerchAddProduct";
import MerchAttendance from "../screens/MerchAttendance";
import MerchInventory from "../screens/MerchInventory";
import Report from "../screens/PlanDetails/report";
import SKUHistoryList from "../screens/SKUHistoryList";
import SKUHistoryDetails from "../screens/SKUHistoryDetails";
import EditPlan from "../screens/EditPlan";
import PDFViewer from "../screens/SMAprrovedPlanDetails/pdfViewer";
import ReturnAddProduct from "../screens/ReturnAddProduct";
import ReturnsHistory from "../screens/ReturnsHistory";
import ReturnDetails from "../screens/ReturnDetails";
import Payment from "../screens/Payment";
import AddPayment from "../screens/AddPayment";
import PaymentDetails from "../screens/PaymentDetails";
import Attendacnce from "../screens/Attendance";
import Attendance from "../screens/Attendance";
import AddShelfDisplay from "../screens/AddShelfDisplay";
import MerchCreatePlan from "../screens/MerchCreatePlan";
import ListShelfDisplay from "../screens/ListSheflDisplay";
import ApproveMerchPlans from "../screens/ApproveMerchPlans";
import MerchPlanDetails from "../screens/MerchPlanDetails";
import ShelfDisplayDetails from "../screens/ShelfDisplayDetails";
import MiscTask from "../screens/MiscTask";
import MiscTaskDetails from "../screens/MiscTaskDetails";
import MerchDashboard from "../screens/MerchDashboard";
import MerchIntake from "../screens/MerchIntake";
import MerchIntakeDetails from "../screens/MerchIntakeDetails";
import LiveLocation from "../screens/LiveLocation";
import CustomerDetail from "../screens/CustomerDetail";
import BirthdayList from "../screens/BirthdayList";
import AddInventory from "../screens/AddInventory";
import SelectCustomer from "../screens/SelectCustomer";
import DeviateCustomers from "../screens/DeviateCustomers";
import ListGifts from "../screens/ListGifts";
import SecondarySales from "../screens/SecondarySales";
import DeviatedPlans from "../screens/DeviatedPlans";
import Expense from "../screens/Expense";
import AddProduct from "../screens/AddProduct";
import ShelfManagement from "../screens/ShelfManagement";
import DeliveryHome from "../screens/DeliveryHome";
import AddDriver from "../screens/AddDriver";
import AddVehicle from "../screens/AddVehicle";
import AssignRoutes from "../screens/AssignRoutes";
import Insights from "../screens/Insides";
import ListVehicles from "../screens/ListVehicles";
import ListDrivers from "../screens/ListDrivers";
import RequestCredit from "../screens/RequestCredit";
import SalesMgmt from "../screens/SalesMgmt";
import Activities from "../screens/Activities";
import ActivityDetails from "../screens/ActivityDetails";
import Inventory from "../screens/Inventory";
import BrandInventory from "../screens/BrandInventory";
import AddBrand from "../screens/AddBrand";
import InventoryMgmt from "../screens/InventoryMgmt";
import InventoryAging from "../screens/InventoryAging";
import Visits from "../screens/Visits";
import SelCust from "../screens/SelCust";
import SupplierList from "../screens/SupplierList";
import ChooseProducts from "../screens/ChooseProducts";
import SupplierCart from "../screens/SupplierCart";
import UserMgmt from "../screens/UserMgmt";
import CreateRFQ from "../screens/CreateRFQ";
import SupplierMgmt from "../screens/SupplierMgmt";
import AddSupplier from "../screens/AddSupplier";
import Warehouse from "../screens/Warehouse";
import AddUser from "../screens/AddUser";
import CustomerList from "../screens/CustomerList";
import CheckOut from "../screens/CheckOut";
import SalesOrder from "../screens/SalesOrder";
import SalesReturn from "../screens/SalesReturn";
import SalesOrderHistory from "../screens/SalesOrderHistory";
import RFQHistory from "../screens/RFQHistory";
import RFQDetails from "../screens/RFQDetails";
import SalesOrderDetails from "../screens/SalesOrderDetails";
import RFQProducts from "../screens/RFQProducts";
import SupplierDetailes from "../screens/SupplierList/SupplierDetailes";
import UserDetails from "../screens/UserMgmt/UserDetails";
import VehicleDetails from "../screens/VehicleDetails";
import Maintenance from "../screens/Maintenance";
import FuelUsage from "../screens/FuelUsage";
import MaintenanceHistory from "../screens/MaintenanceHistory";
import MaintenanceDetails from "../screens/MaintenanceDetails";
import DriverDetails from "../screens/DriverDetails";
import DispatchOrder from "../screens/DispatchOrder";
import DispatchVehicleList from "../screens/DispatchVehicleList";
import CreateDispatchOrder from "../screens/CreateDispatchOrder";
import OnBoarding from "../screens/OnBoarding/Index";
import AddOnBoarding from "../screens/AddOnBoarding/Index";
import AllCoustomer from "../screens/AllCoustomer";
import OrderMangHome from "../screens/OrderMangHome";
import SuppMangHome from "../screens/SuppMangHome";
import ViewSupplier from "../screens/ViewSupplier";
import ReturnsCartReview from "../screens/ReturnsCartReview";
import PurchaseOrder from "../screens/PurchaseOrder";
import OrderDetails from "../screens/OrderDetails";
import InvtryMangHome from "../screens/InvtryMangHome";
import Space from "../screens/Space";
import InvtryReg from "../screens/InvtryReg";
import ListWarehouse from "../screens/ListWarehouse";
import WareDetail from "../screens/WareDetail";
import TrackingDetails from "../screens/TrackingDetails";
import InventoryLog from "../screens/InventoryLog";
import SalesMangHome from "../screens/SalesMangHome";
import Customer from "../screens/Customer";
import Products from "../screens/Products";
import Updates from "../screens/Updates";
import FleetMangHome from "../screens/FleetMangHome";
import DriversAndVehicles from "../screens/DriversAndVehicles";
import FuelHistory from "../screens/FuelHistory";
import ListInspections from "../screens/ListInspections";
import InspectionForm from "../screens/InspectionForm";
import ManageDeliveries from "../screens/ManageDeliveries";
import ManageDelDetails from "../screens/ManageDelDetails";
import AllPlans from "../screens/AllPlans";
import FinMangHome from "../screens/FinMangHome";
import CustomersAndVendors from "../screens/CustomersAndVendors";
import ManageAccounts from "../screens/ManageAccounts";
import AddAccount from "../screens/AddAccounts";
import ManageInvoices from "../screens/ManageInvoices";
import InvoiceDetails from "../screens/InvoiceDetails";
import GeneralLegder from "../screens/GeneralLedger";
import CashFlowReports from "../screens/CashFlowReports";
import OrderReports from "../screens/OrderReports";
import ViewReportPDF from "../screens/CustomReports/ViewReportPDF";
import AssignWarehouse from "../screens/AssignWarehouse";
import AssignWareDetails from "../screens/AssignWareDetails";
import MainChat from "../components/MainChat";
import SupplierReports from "../screens/SupplierReports";
import OrderReturn from "../screens/OrderReturn";
import CreditNotes from "../screens/CreditNotes";
import FinReports from "../screens/FinReports";
import InventoryReports from "../screens/InventoryReports";
import FleetReports from "../screens/FleetReports";
import ListRoutes from "../screens/ListRoutes";
import AddRoute from "../screens/AddRoute";
import RouteDetails from "../screens/RouteDetails";
import BottomSheetComponent from "../screens/BottomSheetComponent";
import OrderReview from "../screens/OrderReview";
import OrderReviewDetails from "../screens/OrderReviewDetails";
import OrderReviewStock from "../screens/OrderReviewStock";
import OrderRevStockDetails from "../screens/OrderRevStockDetails";
import DriverDashboard from "../screens/DriverDashboard";
import DriverOrderDetails from "../screens/DriverOrderDetails";
import DriverOrdersReview from "../screens/DriverOrdersReview";
import DriverDeliveryHistory from "../screens/DriverDeliveryHistory/Index";
import CreatePlanMulti from "../screens/CreatePlanMulti";
import SelectCustMulti from "../screens/SelectCustMulti";
import ReviewPlan from "../screens/ReviewPlan";
import DriverNotification from "../screens/DriverNotification/Index";
import ChatUserList from "../screens/ChatUserList/Index";
import ChatInput from "../screens/ChatInput";
import VisitSummary from "../screens/VisitSummary";
import CreatePO from "../screens/CreatePO";
import OrderApproval from "../screens/OrderApproval";
import OrderApprovalDetails from "../screens/OrderApprovalDetails";
import OrdoCustomerDetails from "../screens/OrdoCustomerDetails/Index";
import VisitRecord from "../screens/VisitRecordHistory/Index";
import Incentives from "../screens/Incentives";
import POReview from "../screens/POReview";
import POReviewDetails from "../screens/POReviewDetails";
import ViewQuotations from "../screens/ViewQuotations";
import QuotationDetails from "../screens/QuotationDetails";
import EditSalesOrder from "../screens/EditSalesOrder";
import EditAdminOrderReview from "../screens/EditAdminOrderReview";
import versionModel from "../components/versionModel";
import OrderRevStockDetailsEdit from "../screens/OrderRevStockDetailsEdit";
import Comments from "../components/Comments";
import CollMangHome from "../screens/CollMangHome";
import CollInvoice from "../screens/Invoice/CollInvoice";
import CollInvoiceDetails from "../screens/InvoiceDetails/CollInvoiceDetails";
import OdoMeter from "../screens/OdoMeter";
import ManageDelDetailsStock from "../screens/ManageDelDetails/StockTeam";
import DispatchOrderDetails from "../screens/DispatchOrderDetails";
import DispatchOrderReview from "../screens/DispatchOrderReview";
import ProductionReview from "../screens/ProductionReview";
import OnlyOrderMangHome from "../screens/OnlyOrderMangHome";
import ProductionReviewDetails from "../screens/ProductionReviewDetails";
import ProductionMgmt from "../screens/ProductionMgmt";
import ProductionDispatch from "../screens/ProductionDispatch/Index";
import ProductionAccess from "../screens/ProductionAccess";
import ProductionAccessDetails from "../screens/ProductionAccessDetails";
import ProductionList from "../screens/ProductionList";
import ProductionRouteDetails from "../screens/ProductionRouteDetails/Index";
import ProductionManage from "../screens/ProductionManage";
import ProductionManageDetails from "../screens/ProductionManageDetails";

export default function AppStack() {
  const { merch, admin, delivery, salesManager, collectionTeam, stockTeam,driver,userData,salesEx ,production } = useContext(AuthContext);
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    console.log("userData has changed:", userData?.app_config);
    // Perform any necessary actions when userData changes
  }, [userData]);

  // Set default app_config values to show all screens if userData or app_config is not present
  const defaultConfig = {
    Financial: 1,
    Fleet: 1,
    Inventory: 1,
    Order: 1,
    Report: 1,
    Sales: 1,
    Supplier: 1,
    User: 1,
    Warehouse: 1,
    Production:1
  };
  
  const app_config = (userData?.app_config && Object.keys(userData.app_config).length > 0) ? userData.app_config : defaultConfig;

  // If userData is not yet loaded, show a loading indicator or null
  // if (!userData) {
  //   return null; // or you can return a loading spinner component
  // }


  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {collectionTeam && <Stack.Screen name="CollMangHome" component={CollMangHome} />}
      {collectionTeam && <Stack.Screen name="OrderReview" component={OrderReview} />}
      {collectionTeam && <Stack.Screen name="OrderReviewDetails" component={OrderReviewDetails} />}
      {collectionTeam && <Stack.Screen name="CollInvoiceDetails" component={CollInvoiceDetails} />}
      {/* {stockTeam && <Stack.Screen name="OrderRevStockDetails" component={OrderRevStockDetails} />} */}

      {driver && <Stack.Screen name="DriverDashboard" component={DriverDashboard} />}
      {driver && <Stack.Screen name="DriverOrderDetails" component={DriverOrderDetails} />}
      {driver && <Stack.Screen name="DriverOrdersReview" component={DriverOrdersReview} />}
      {driver && <Stack.Screen name="DriverDeliveryHistory" component={DriverDeliveryHistory} />}
      {driver && <Stack.Screen name="DriverNotification" component={DriverNotification} />}
      {driver && <Stack.Screen name="ChatUserList" component={ChatUserList} />}
      {driver && <Stack.Screen name="ChatInput" component={ChatInput} />}

      {(salesManager || salesEx) && <Stack.Screen name="OnlyOrderMangHome" component={OnlyOrderMangHome} />}

 

      {app_config.Supplier === 1 && <Stack.Screen name="SuppMangHome" component={SuppMangHome} />}
      {app_config.Order === 1 && <Stack.Screen name="OrderMangHome" component={OrderMangHome} />}
      {(app_config.Inventory === 1 || stockTeam) && (
        <Stack.Screen name="InvtryMangHome" component={InvtryMangHome} />
      )}
      {app_config.Sales === 1 && <Stack.Screen name="SalesMangHome" component={SalesMangHome} />}
      {app_config.Financial === 1 && <Stack.Screen name="FinMangHome" component={FinMangHome} />}
      {app_config.Fleet === 1 && <Stack.Screen name="FleetMangHome" component={FleetMangHome} />}
      {app_config.User === 1 && <Stack.Screen name="UserMgmt" component={UserMgmt} />}
      {app_config.Production === 1 && <Stack.Screen name="ProductionMgmt" component={ProductionMgmt}/>}

      {merch && <Stack.Screen name="MerchHome" component={MerchHome} />}
      {delivery && (<Stack.Screen name="DeliveryHome" component={DeliveryHome} />)}

      <Stack.Screen name="BottomTab" component={BottomTab} />
      {admin && <Stack.Screen name="AdminHome" component={AdminHome} />}
      <Stack.Screen name="Visits" component={Visits} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="MIList" component={MIList} />
      <Stack.Screen name="MIListDetail" component={MIListDetail} />
      <Stack.Screen name="CreatePlan" component={CreatePlan} />
      <Stack.Screen name="CreatePlanMulti" component={CreatePlanMulti} />
      <Stack.Screen name="ReviewPlan" component={ReviewPlan} />
      <Stack.Screen name="OrderwiseReport" component={OrderwiseReport} />
      <Stack.Screen name="PlanDetails" component={PlanDetails} />
      <Stack.Screen name="VisitSummary" component={VisitSummary} />
      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen name="CheckIn" component={CheckIn} />
      <Stack.Screen name="CheckOut" component={CheckOut} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="UserList" component={UserList} />
      <Stack.Screen name="CheckInInventory" component={CheckInInventory} />
      <Stack.Screen
        name="CompetitorIntelligence"
        component={CompetitorIntelligence} />
      <Stack.Screen name="Invoice" component={Invoice} />
      <Stack.Screen name="ReturnsCart" component={ReturnsCart} />
      <Stack.Screen name="ReturnOrderDetails" component={ReturnOrderDetails} />
      <Stack.Screen name="PreviousVisits" component={PreviousVisits} />
      <Stack.Screen name="MyPerformance" component={MyPerformance} />
      <Stack.Screen name="AdminOrders" component={AdminOrders} />
      <Stack.Screen name="AdminPromotions" component={AdminPromotions} />
      <Stack.Screen name="AdminStores" component={AdminStores} />
      <Stack.Screen name="AdminOrderCart" component={AdminOrderCart} />
      <Stack.Screen name="AdminCreateOrder" component={AdminCreateOrder} />
      <Stack.Screen name="AdminOrderReview" component={AdminOrderReview} />
      <Stack.Screen name="SMTourPlanDetails" component={SMTourPlanDetails} />
      <Stack.Screen
        name="SMApprovedPlanDetails"
        component={SMApprovedPlanDetails}
      />
      <Stack.Screen name="SalesManagerHome" component={SalesManagerHome} />
      <Stack.Screen name="SMCreatePlan" component={SMCreatePlan} />
      <Stack.Screen name="MerchInventory" component={MerchInventory} />
      <Stack.Screen name="MerchAddProduct" component={MerchAddProduct} />
      <Stack.Screen name="MerchAttendance" component={MerchAttendance} />
      <Stack.Screen name="Report" component={Report} />
      <Stack.Screen name="SKUHistoryList" component={SKUHistoryList} />
      <Stack.Screen name="SKUHistoryDetails" component={SKUHistoryDetails} />
      <Stack.Screen name="EditPlan" component={EditPlan} />
      <Stack.Screen name="PDFViewer" component={PDFViewer} />
      <Stack.Screen name="ReturnAddProduct" component={ReturnAddProduct} />
      <Stack.Screen name="ReturnsHistory" component={ReturnsHistory} />
      <Stack.Screen name="ReturnDetails" component={ReturnDetails} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="AddPayment" component={AddPayment} />
      <Stack.Screen name="PaymentDetails" component={PaymentDetails} />
      <Stack.Screen name="Attendance" component={Attendance} />
      <Stack.Screen name="AddShelfDisplay" component={AddShelfDisplay} />
      <Stack.Screen name="MerchCreatePlan" component={MerchCreatePlan} />
      <Stack.Screen name="ListShelfDisplay" component={ListShelfDisplay} />
      <Stack.Screen name="ApproveMerchPlans" component={ApproveMerchPlans} />
      <Stack.Screen name="MerchPlanDetails" component={MerchPlanDetails} />
      <Stack.Screen
        name="ShelfDisplayDetails"
        component={ShelfDisplayDetails}
      />
      <Stack.Screen name="MiscTask" component={MiscTask} />
      <Stack.Screen name="MiscTaskDetails" component={MiscTaskDetails} />
      <Stack.Screen name="MerchDashboard" component={MerchDashboard} />
      <Stack.Screen name="MerchIntake" component={MerchIntake} />
      <Stack.Screen name="MerchIntakeDetails" component={MerchIntakeDetails} />
      <Stack.Screen name="LiveLocation" component={LiveLocation} />
      <Stack.Screen name="CustomerDetail" component={CustomerDetail} />
      <Stack.Screen name="BirthdayList" component={BirthdayList} />
      <Stack.Screen name="SelectCustomer" component={SelectCustomer} />
      <Stack.Screen name="SelectCustMulti" component={SelectCustMulti} />
      <Stack.Screen name="CustomerList" component={CustomerList} />
      <Stack.Screen name="AddInventory" component={AddInventory} />
      <Stack.Screen name="DeviateCustomers" component={DeviateCustomers} />
      <Stack.Screen name="ListGifts" component={ListGifts} />
      <Stack.Screen name="SecondarySales" component={SecondarySales} />
      <Stack.Screen name="DeviatedPlans" component={DeviatedPlans} />
      <Stack.Screen name="Expense" component={Expense} />
      <Stack.Screen name="AddProduct" component={AddProduct} />
      <Stack.Screen name="ShelfManagement" component={ShelfManagement} />
      <Stack.Screen name="AddDriver" component={AddDriver} />
      <Stack.Screen name="ListVehicles" component={ListVehicles} />
      <Stack.Screen name="ListDrivers" component={ListDrivers} />
      <Stack.Screen name="AddVehicle" component={AddVehicle} />
      <Stack.Screen name="AssignRoutes" component={AssignRoutes} />
      <Stack.Screen name="Insights" component={Insights} />
      <Stack.Screen name="OrderMgmt" component={OrderMgmt} />
      <Stack.Screen name="RequestCredit" component={RequestCredit} />
      <Stack.Screen name="SalesMgmt" component={SalesMgmt} />
      <Stack.Screen name="Activities" component={Activities} />
      <Stack.Screen name="ActivityDetails" component={ActivityDetails} />
      <Stack.Screen name="Inventory" component={Inventory} />
      <Stack.Screen name="BrandInventory" component={BrandInventory} />
      <Stack.Screen name="AddBrand" component={AddBrand} />
      <Stack.Screen name="InventoryMgmt" component={InventoryMgmt} />
      <Stack.Screen name="InventoryAging" component={InventoryAging} />
      <Stack.Screen name="SelCust" component={SelCust} />
      <Stack.Screen name="SupplierMgmt" component={SupplierMgmt} />
      <Stack.Screen name="SupplierList" component={SupplierList} />
      <Stack.Screen name="ChooseProducts" component={ChooseProducts} />
      <Stack.Screen name="SupplierCart" component={SupplierCart} />
      <Stack.Screen name="AddUser" component={AddUser} />
      <Stack.Screen name="CreateRFQ" component={CreateRFQ} />
      <Stack.Screen name="CreatePO" component={CreatePO} />
      <Stack.Screen name="AddSupplier" component={AddSupplier} />
      <Stack.Screen name="Warehouse" component={Warehouse} />
      <Stack.Screen name="SalesOrder" component={SalesOrder} />
      <Stack.Screen name="SalesOrderDetails" component={SalesOrderDetails} />
      <Stack.Screen name="OrderApprovalDetails" component={OrderApprovalDetails} />
      <Stack.Screen name="SalesOrderHistory" component={SalesOrderHistory} />
      <Stack.Screen name="OrderApproval" component={OrderApproval} />
      <Stack.Screen name="RFQHistory" component={RFQHistory} />
      <Stack.Screen name="RFQDetails" component={RFQDetails} />
      <Stack.Screen name="SalesReturn" component={SalesReturn} />
      <Stack.Screen name="RFQProducts" component={RFQProducts} />
      <Stack.Screen name="SupplierDetails" component={SupplierDetailes} />
      <Stack.Screen name="UserDetails" component={UserDetails} />
      <Stack.Screen name="VehicleDetails" component={VehicleDetails} />
      <Stack.Screen name="Maintenance" component={Maintenance} />
      <Stack.Screen name="FuelUsage" component={FuelUsage} />
      <Stack.Screen name="MaintenanceHistory" component={MaintenanceHistory} />
      <Stack.Screen name="FuelHistory" component={FuelHistory} />

      <Stack.Screen name="MaintenanceDetails" component={MaintenanceDetails} />
      <Stack.Screen name="DriverDetails" component={DriverDetails} />
      <Stack.Screen name="DispatchOrder" component={DispatchOrder} />
      <Stack.Screen name="CreateDispatchOrder" component={CreateDispatchOrder}/>
      <Stack.Screen name="DispatchVehicleList" component={DispatchVehicleList}/>
      <Stack.Screen name="OnBoarding" component={OnBoarding} />
      <Stack.Screen name="AddOnBoarding" component={AddOnBoarding} />
      <Stack.Screen name="AllCoustomer" component={AllCoustomer} />
      <Stack.Screen name="ViewSupplier" component={ViewSupplier} />
      <Stack.Screen name="ReturnsCartReview" component={ReturnsCartReview} />
      <Stack.Screen name="PurchaseOrder" component={PurchaseOrder} />
      <Stack.Screen name="OrderDetails" component={OrderDetails} />
      <Stack.Screen name="Space" component={Space} />
      <Stack.Screen name="InvtryReg" component={InvtryReg} />
      <Stack.Screen name="ListWarehouse" component={ListWarehouse} />
      <Stack.Screen name="WareDetail" component={WareDetail} />
      <Stack.Screen name="TrackingDetails" component={TrackingDetails} />
      <Stack.Screen name="InventoryLog" component={InventoryLog} />
      <Stack.Screen name="Customer" component={Customer} />
      <Stack.Screen name="Products" component={Products} />
      <Stack.Screen name="Updates" component={Updates} />
      <Stack.Screen name="DriversAndVehicles" component={DriversAndVehicles} />
      <Stack.Screen name="ListInspections" component={ListInspections} />
      <Stack.Screen name="InspectionForm" component={InspectionForm} />
      <Stack.Screen name="ManageDeliveries" component={ManageDeliveries} />
      <Stack.Screen name="ManageDelDetails" component={ManageDelDetails} />
      <Stack.Screen name="AllPlans" component={AllPlans} />
      <Stack.Screen name="CustomersAndVendors" component={CustomersAndVendors} />
      <Stack.Screen name="ManageAccounts" component={ManageAccounts} />
      <Stack.Screen name="AddAccount" component={AddAccount} />
      <Stack.Screen name="ManageInvoices" component={ManageInvoices} />
      <Stack.Screen name="InvoiceDetails" component={InvoiceDetails} />
      <Stack.Screen name="GeneralLegder" component={GeneralLegder} />
      <Stack.Screen name="CashFlowReports" component={CashFlowReports} />
      <Stack.Screen name="OrderReports" component={OrderReports} />
      <Stack.Screen name="MainChat" component={MainChat} />
      <Stack.Screen name="Incentives" component={Incentives} />
      <Stack.Screen name="SupplierReports" component={SupplierReports} />
      <Stack.Screen name="OrderReturn" component={OrderReturn} />
      <Stack.Screen name="CreditNotes" component={CreditNotes} />
      <Stack.Screen name="FinReports" component={FinReports} />
      <Stack.Screen name="InventoryReports" component={InventoryReports} />
      <Stack.Screen name="FleetReports" component={FleetReports} />
      <Stack.Screen name="ViewReportPDF" component={ViewReportPDF} />
      <Stack.Screen name="ListRoutes" component={ListRoutes} />
      <Stack.Screen name="RouteDetails" component={RouteDetails} />
      <Stack.Screen name="AddRoute" component={AddRoute} />
      <Stack.Screen name="OrdoCustomerDetails" component={OrdoCustomerDetails} />
      <Stack.Screen name="VisitRecord" component={VisitRecord} />
      <Stack.Screen name="ViewQuotations" component={ViewQuotations} />
      <Stack.Screen name="QuotationDetails" component={QuotationDetails} />
      <Stack.Screen name="EditSalesOrder" component={EditSalesOrder} />
      <Stack.Screen name="EditAdminOrderReview" component={EditAdminOrderReview} />
      <Stack.Screen name="versionModel" component={versionModel} />
     <Stack.Screen name="OrderReviewStock" component={OrderReviewStock} /> 
     <Stack.Screen name="OrderRevStockDetails" component={OrderRevStockDetails} /> 
     <Stack.Screen name="POReview" component={POReview} /> 
     <Stack.Screen name="Comments" component={Comments} /> 
     <Stack.Screen name="POReviewDetails" component={POReviewDetails} /> 
     <Stack.Screen name="OrderRevStockDetailsEdit" component={OrderRevStockDetailsEdit}/>
     <Stack.Screen name="CollInvoice" component={CollInvoice}/>
     <Stack.Screen name="OdoMeter" component={OdoMeter}/>
     <Stack.Screen name="ManageDelDetailsStock" component={ManageDelDetailsStock}/>
     <Stack.Screen name="DispatchOrderReview" component={DispatchOrderReview}/>
     <Stack.Screen name="DispatchOrderDetails" component={DispatchOrderDetails}/>
     <Stack.Screen name="ProductionReview" component={ProductionReview}/>
      <Stack.Screen name="ProductionReviewDetails" component={ProductionReviewDetails}/>
      <Stack.Screen name="ProductionDispatch" component={ProductionDispatch}/>
      <Stack.Screen name="ProductionAccess" component={ProductionAccess}/>
      <Stack.Screen name="ProductionList" component={ProductionList}/>
      <Stack.Screen name="ProductionAccessDetails" component={ProductionAccessDetails}/>
      <Stack.Screen name="ProductionRouteDetails" component={ProductionRouteDetails}/>
      <Stack.Screen name="ProductionManage" component={ProductionManage}/>
      <Stack.Screen name="ProductionManageDetails" component={ProductionManageDetails}/>
      <Stack.Screen name="BottomSheetComponent" component={BottomSheetComponent} />

    </Stack.Navigator>
  );
}
