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
