import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import firestore from '@react-native-firebase/firestore';
export const AuthContext = React.createContext();
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";
import RNFS from 'react-native-fs';

export const AuthProvider = ({ children, navigation }) => {
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [checkInDocId, setCheckInDocId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [dealerData, setDealerData] = useState('');
    const [salesManager, setSalesManager] = useState(false);
    const [merch, setMerch] = useState(false);
    const [delivery, setDelivery] = useState(false);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [tourPlanId, setTourPlanId] = useState('');
    const [tourPlanName, setTourPlanName] = useState('');
    const [admin, setAdmin] = useState(false);
    const [collectionTeam, setCollectionTeam] = useState(false);
    const [stockTeam, setStockTeam] = useState(false);
    const [driver, setDriver] = useState(false);
    const [salesEx, setSalesEx] = useState(false);
    const [dispatchTeam, setDispatchTeam] = useState(false);
    const [planName, setPlanName] = useState('');
    const [date, setDate] = useState(new Date())
    const [enddate, setEndDate] = useState(new Date())
    const [selectedItem, setSelectedItem] = useState(null);
    const [production, setProduction] = useState(false);


    //counts data states
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalWarehouses, setTotalWarehouses] = useState(0);
    const [totalCategories, setTotalCategories] = useState(0);
    const [totalQuotationRequested, setTotalQuotationRequested] = useState(0);
    const [purchaseOrderCreated, setPurchaseOrderCreated] = useState(0);
    const [totalSupplier, setTotalSupplier] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalReturns, setTotalReturns] = useState(0);
    const [totalVehicles, setTotalVehicles] = useState(0);
    const [totalDrivers, setTotalDrivers] = useState(0);
    const [totalTransitOrders, setTotalTransit] = useState(0);
    const [totalAccSales, setAccSales] = useState(0);
    const [totalPurchase, setTotalPurchases] = useState(0);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [appConfig, setAppConfig] = useState(false);




    // const [products, setProducts] = useState([]);
    // const [customerMaster, setCustomerMaster] = useState([]);
    // const [splashScreen, setSplashScreen] = useState(false);



    useEffect(() => {
        const fetchData = async () => {
            if (userData) {
                try {
                    const myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    myHeaders.append("Authorization", `Bearer ${userData.token}`);
                    console.log('token', userData.token)

                    const requestOptions = {
                        method: 'GET',
                        headers: myHeaders,
                        redirect: 'follow'
                    };

                    const response = await fetch('https://gsidev.ordosolution.com/api/dashboard_report/', requestOptions);
                    const data = await response.json();
                    const { order_management, supplier_management, inventory_management, fleet_management, finance_management } = data;

                    setTotalProducts(inventory_management.total_products);
                    setTotalWarehouses(inventory_management.total_warehouses);
                    setTotalCategories(inventory_management.total_categories);

                    setTotalQuotationRequested(supplier_management.total_quotation_requested);
                    setPurchaseOrderCreated(supplier_management.purchase_order_created);
                    setTotalSupplier(supplier_management.total_supplier);

                    setTotalSales(order_management.total_sales);
                    setTotalOrders(order_management.total_orders);
                    setTotalReturns(order_management.total_returns);

                    setTotalDrivers(fleet_management.total_drivers);
                    setTotalVehicles(fleet_management.total_vehicles);
                    setTotalTransit(fleet_management.in_transit_orders);

                    setAccSales(finance_management.total_acc_sales);
                    setTotalPurchases(finance_management.total_acc_purchase);
                    setTotalTransactions(finance_management.total_general_transactions);

                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        fetchData();
    }, [userData]);



    //code for initiall calling of products and customers and saving it in local file system
    // useEffect(() => {
    //     const fetchProductsAndCustomers = async () => {
    //         if (userData) {
    //             try {
    //                 setSplashScreen(true);

    //                 const path = RNFS.DocumentDirectoryPath + '/data_master.json';
    //                 const fileExists = await RNFS.exists(path);

    //                 if (fileExists) {
    //                     const fileContent = await RNFS.readFile(path, 'utf8');
    //                     const data = JSON.parse(fileContent);
    //                     const productTimestamp = new Date(data.productTimestamp);
    //                     const customerTimestamp = new Date(data.customerTimestamp);
    //                     const currentTime = new Date();

    //                     const productTimeDifference = (currentTime - productTimestamp) / 1000; // Time difference in seconds
    //                     const customerTimeDifference = (currentTime - customerTimestamp) / 1000; // Time difference in seconds

    //                     if (productTimeDifference < 120 && customerTimeDifference < 120) { // Less than 2 minutes
    //                         setProducts(data.products);
    //                         setCustomerMaster(data.customers);
    //                         setSplashScreen(false);
    //                         return;
    //                     }
    //                 }

    //                 const myHeaders = new Headers();
    //                 myHeaders.append("Content-Type", "application/json");
    //                 myHeaders.append("Authorization", `Bearer ${userData.token}`);

    //                 const requestOptions = {
    //                     method: 'GET',
    //                     headers: myHeaders,
    //                     redirect: 'follow'
    //                 };

    //                 // Fetch products
    //                 const productResponse = await fetch('https://gsidev.ordosolution.com/api/product/', requestOptions);
    //                 const productResult = await productResponse.json();

    //                 // Fetch customers
    //                 const customerResponse = await fetch('https://gsidev.ordosolution.com/api/customer/?all=true', requestOptions);
    //                 const customerResult = await customerResponse.json();

    //                 // Get the current time
    //                 const currentTime = new Date().toISOString();

    //                 // Create an object to save in the file system
    //                 const dataToSave = {
    //                     productTimestamp: currentTime,
    //                     customerTimestamp: currentTime,
    //                     products: productResult,
    //                     customers: customerResult,
    //                 };

    //                 // Save the results to the state
    //                 setProducts(productResult);
    //                 setCustomerMaster(customerResult);

    //                 // Save the data to the local file system
    //                 await RNFS.writeFile(path, JSON.stringify(dataToSave), 'utf8');
    //                 console.log('File written to:', path);

    //                 setSplashScreen(false);
    //             } catch (error) {
    //                 console.error('Error fetching data:', error);
    //                 setSplashScreen(false);
    //             }
    //         }
    //     };

    //     fetchProductsAndCustomers();
    // }, [userData]);

    const changeToken = (val) => {
        setToken(val);
    };

    const changeDocId = (val) => {
        setCheckInDocId(val);
    };

    const changeDealerData = (val) => {
        setDealerData(val);
    };

    const [approvedPlans, setApprovedPlans] = useState('');

    const changeApprovedPlans = (val) => {
        setApprovedPlans(val);
    };

    const changeAdmin = (val) => {
        setAdmin(val);
    };

    const changeDelivery = (val) => {
        setDelivery(val);
    };

    const changeTourPlanId = (val) => {
        setTourPlanId(val);
    };

    const clearToken = async () => {
        if (token) {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${userData.token}`);

            const raw = JSON.stringify({
                user_id: userData.id
            });

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            try {
                const response = await fetch("https://gsidev.ordosolution.com/api/logout/", requestOptions);
                const result = await response.json();
                if (result.msg === "Successfully logged out.") {
                    console.log("Successfully logged out.");
                } else {
                    console.log("Log out failed");
                }
                await AsyncStorage.clear();
                setIsLoading(false);
                if (admin) setAdmin(false);
                if (stockTeam) setStockTeam(false);
                if (collectionTeam) setCollectionTeam(false);
                if (salesEx) setSalesEx(false);
                if (dispatchTeam) setDispatchTeam(false);

                if (salesManager) setSalesManager(false);
                if (driver) setDriver(false);
                if (merch) setMerch(false);
                if (production) setProduction(false);

                if (appConfig) setAppConfig(false)

            } catch (error) {
                console.error('Error logging out:', error);
            }
        } else {
            alert('Please fill all the details');
        }
    };



    const logout = async () => {
        setIsLoading(true);
        setToken(null);
        setUserData(null);
        try {
            clearToken();
        } catch (error) {
            console.log("Error while removing data", error);
        }
    };

    const isLoggenIn = async () => {
        try {
            setIsLoading(true);
            let storedUserData = await AsyncStorage.getItem("userData");
            if (storedUserData) {
                setUserData(JSON.parse(storedUserData));
            }
            let storedUserToken = await AsyncStorage.getItem("token");
            if (storedUserToken) {
                setToken(storedUserToken);
            }
            let storedAppConfig = await AsyncStorage.getItem("isAppConfig");
            if (storedAppConfig) {
                setAppConfig(storedAppConfig);
            }
            let storedIsAdmin = await AsyncStorage.getItem("isAdmin");
            if (storedIsAdmin) {
                setAdmin(storedIsAdmin);
                setToken(storedIsAdmin);
            }
            let storedIsDelivery = await AsyncStorage.getItem("isDelivery");
            if (storedIsDelivery) {
                setDelivery(storedIsDelivery);
            }
            let storedIsCollectionTeam = await AsyncStorage.getItem("isCollectionTeam");
            if (storedIsCollectionTeam) {
                setCollectionTeam(storedIsCollectionTeam);
            }
            let storedIsStockTeam = await AsyncStorage.getItem("isStockTeam");
            if (storedIsStockTeam) {
                setStockTeam(storedIsStockTeam);
            }
            let storedIsSalesEx = await AsyncStorage.getItem("isSalesEx");
            if (storedIsSalesEx) {
                setSalesEx(storedIsSalesEx);
            }
            let storedIsSalesManager = await AsyncStorage.getItem("isSalesManager");
            if (storedIsSalesManager) {
                setSalesManager(storedIsSalesManager);
            }
            let storedIsDriver = await AsyncStorage.getItem("isDriver");
            if (storedIsDriver) {
                setDriver(storedIsDriver);
            }
            let storedIsDispatchTeam = await AsyncStorage.getItem("isDispatchTeam");
            if (storedIsDispatchTeam) {
                setDispatchTeam(storedIsDispatchTeam);
            }
            let storedIsMerch = await AsyncStorage.getItem("isMerch");
            if (storedIsMerch) {
                setMerch(storedIsMerch);
                setToken(storedIsMerch);
                changeDealerData({ id: JSON.parse(storedUserData)?.account_id });
            }
            let storedIsProduction = await AsyncStorage.getItem("isProduction");
            if (storedIsProduction) {
                setProduction(storedIsProduction);
            }
            setIsLoading(false);
        } catch (error) {
            console.log("Error retrieving data", error);
        }
    };

    const [pendingArray, setPendingArray] = useState([]);
    const [completedArray, setCompletedArray] = useState([]);
    const [returnArray, setReturnArray] = useState([]);
    const [approvedArray, setApprovedArray] = useState([]);
    const [tourPlanArray, setTourPlanArray] = useState([]);

    useEffect(() => {
        isLoggenIn();
    }, []);

    return (
        <AuthContext.Provider value={{
            token,
            setToken,
            changeToken,
            logout,
            changeDocId,
            checkInDocId,
            isLoading,
            dealerData,
            changeDealerData,
            approvedPlans,
            changeApprovedPlans,
            admin,
            changeAdmin,
            delivery,
            changeDelivery,
            tourPlanId,
            changeTourPlanId,
            pendingArray,
            setPendingArray,
            completedArray,
            setCompletedArray,
            returnArray,
            setReturnArray,
            salesManager,
            setSalesManager,
            approvedArray,
            setApprovedArray,
            tourPlanArray,
            setTourPlanArray,
            userData,
            setUserData,
            merch,
            setMerch,
            tourPlanName,
            setTourPlanName,
            ordersLoading,
            setOrdersLoading,
            totalProducts,
            totalCategories,
            totalWarehouses,
            totalQuotationRequested,
            purchaseOrderCreated,
            totalSupplier,
            totalSales,
            totalOrders,
            totalReturns,
            totalTransitOrders,
            totalDrivers,
            totalVehicles,
            totalAccSales,
            totalPurchase,
            totalTransactions,
            collectionTeam,
            setCollectionTeam,
            stockTeam,
            setStockTeam,
            salesEx,
            setSalesEx,
            driver,
            setDriver,
            dispatchTeam,
            setDispatchTeam,
            appConfig,
            setAppConfig,
            planName, setPlanName,
            date, setDate,
            enddate, setEndDate,
            selectedItem, setSelectedItem,
            setProduction,
            production
            // products, setProducts,
            // splashScreen

        }}>
            {children}
        </AuthContext.Provider>
    );
};
