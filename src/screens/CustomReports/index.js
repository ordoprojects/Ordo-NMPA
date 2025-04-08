import React, { useContext, useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { AuthContext } from '../../Context/AuthContext'
import { StyleSheet } from 'react-native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Table, TableWrapper, Row, Cell } from 'react-native-reanimated-table';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../constants/Colors';
import { ms } from '../../utils/Metrics';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import generatePDF from './generatePdf';






const CustomReports = ({ navigation, module }) => {
    const { userData } = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [modules, setModules] = useState([]);
    const [masterData, setMasterData] = useState([]);
    const [fields, setFields] = useState([]);

    const [tableData, setTableData] = useState([]);
    const [tableHeads, setTableHeads] = useState([]);

    const [selectedModule, setSelectedModule] = useState(null);
    const [selectedFields, setSelectedFields] = useState([]);


    useEffect(() => {
        fetchModules();
    }, [userData.token])


    useEffect(() => {
        if (masterData && selectedModule) {
            if (selectedModule in masterData) {
                const moduleFields = masterData[selectedModule].fields;
                // Convert fields data to the desired format
                const formattedFields = moduleFields.map(field => ({
                    label: field,
                    value: field
                }));
                setFields(formattedFields);
            } else {
                // Module not found in masterData
                console.log("Selected module not found in masterData");
            }
        }
    }, [masterData, selectedModule]);


    const generateReport = async () => {
        setLoading(true);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);


        var raw = JSON.stringify({
            model: selectedModule,
            fields: selectedFields,

        });

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        try {
            const response = await fetch("https://gsidev.ordosolution.com/api/fetch_fields/", requestOptions);
            const data = await response.json();
            const tableHeads = Object.keys(data[0]);
            setTableHeads(tableHeads);
            setTableData(data);
        } catch (error) {
            console.log("error", error);
        } finally {
            setLoading(false);
        }

    }

    const renderPDF = async () => {
        const generatedPDF = await generatePDF(module, tableData, tableHeads);
        const filePath = generatedPDF.filePath;
        console.log("filepath received in custom reports", filePath)
        navigation.navigate('ViewReportPDF', { filePath: filePath })
    }

    const fetchModules = async () => {
        setLoading(true);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);

        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        try {
            const response = await fetch("https://gsidev.ordosolution.com/api/custom_report/", requestOptions);
            const data = await response.json();
            setMasterData(data);
            // Extracting module names and formatting them
            const modules = Object.entries(data).map(([key, value]) => ({
                label: key,
                value: key,
            }));
            // Storing the modules in state
            setModules(modules);
        } catch (error) {
            console.log("error", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <View style={{ marginVertical: '5%', marginBottom: '50%', paddingHorizontal: '5%', flex: 1 }}>
            <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 19, color: 'black' }}>Custom Reports</Text>
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                itemTextStyle={{fontSize: 16,fontFamily: 'AvenirNextCyr-Medium',color:'black'}}
                iconStyle={styles.iconStyle}
                data={modules}
                search
                maxHeight={400}
                labelField="label"
                valueField="value"
                placeholder="Select module"
                searchPlaceholder="Search..."
                value={selectedModule}
                onChange={item => {
                    setSelectedModule(item.value);
                    setSelectedFields([]);
                }}
                renderLeftIcon={() => (
                    <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
                )}
            />

            {selectedModule && <MultiSelect
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                itemTextStyle={{fontSize: 16,fontFamily: 'AvenirNextCyr-Medium',color:'black'}}
                iconStyle={styles.iconStyle}
                search
                data={fields}
                labelField="label"
                valueField="value"
                placeholder={selectedFields.length > 0 ? '...' : "Select fields"}
                searchPlaceholder="Search..."
                value={selectedFields}
                onChange={item => {
                    setSelectedFields(item);

                }}
                renderLeftIcon={() => (
                    <AntDesign
                        style={styles.icon}
                        color="black"
                        name="Safety"
                        size={20}
                    />
                )}
                renderSelectedItem={(item, unSelect) => (
                    <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                        <View style={styles.selectedStyle}>
                            <Text style={styles.textSelectedStyle}>{item.label}</Text>
                            <AntDesign color="black" name="closecircleo" size={17} />
                        </View>
                    </TouchableOpacity>
                )}
            />
            }
            {selectedFields.length > 0 && <TouchableOpacity
                onPress={() => { setSelectedFields([]); setTableData([]); setTableHeads([]);}}
                style={{ marginTop: '2%' }}>
                <Text style={{ textAlign: 'right', color: 'tomato', fontFamily: 'AvenirNextCyr-Medium' }}>Clear all</Text>
            </TouchableOpacity>}



            {selectedFields.length > 0 &&

                <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'space-between', marginTop: '3%' }}>

                    <LinearGradient
                        colors={Colors.linearColors}
                        start={Colors.start}
                        end={Colors.end}
                        locations={Colors.ButtonsLocation}
                        style={{
                            borderRadius: ms(25),
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                            width: '48%'

                        }}
                    >
                        <TouchableOpacity
                            style={styles.button}
                            onPress={generateReport}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.btnText}>Generate Report</Text>
                        </TouchableOpacity>
                    </LinearGradient>

                    <TouchableOpacity
                        style={{ borderColor: 'black', width: '48%', borderWidth: 1, justifyContent: 'center', alignItems: 'center', borderRadius: ms(25), flexDirection: 'row', gap: 5 }}
                        onPress={renderPDF}
                    // activeOpacity={0.8}
                    >
                        <Text style={[styles.btnText, { color: 'black' }]}>Export PDF</Text>
                        <AntDesign name="pdffile1" color="black" size={18} />
                    </TouchableOpacity>
                </View>
            }

            {tableData && tableHeads.length > 0 && <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ marginVertical: '5%' }}>
                <View>
                    <Table borderStyle={styles.tableBorder}>


                        <TableWrapper style={styles.header}>
                            {tableHeads.map((cellData, cellIndex) => (
                                <Cell key={cellIndex} data={cellData} textStyle={styles.headerText} width={150} />
                            ))}
                        </TableWrapper>
                    </Table>
                    <ScrollView
                        style={styles.dataWrapper}
                        showsVerticalScrollIndicator={false}
                    >
                        <Table borderStyle={styles.tableBorder}>
                            {tableData.map((rowData, index) => (
                                <TableWrapper key={index} style={styles.row}>
                                    {tableHeads.map((key, cellIndex) => (
                                        <Cell key={cellIndex} data={rowData[key]} textStyle={styles.text} width={150} />
                                    ))}
                                </TableWrapper>
                            ))}
                        </Table>
                    </ScrollView>
                </View>
            </ScrollView>}

        </View>
    )
}


export default CustomReports;

const styles = StyleSheet.create({
    dropdown: {
        marginVertical: 16,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 5,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
        fontFamily: 'AvenirNextCyr-Medium',
        color:'black'
    },
    selectedTextStyle: {
        fontSize: 16,
        fontFamily: 'AvenirNextCyr-Medium',
        color:'black',
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        fontFamily: 'AvenirNextCyr-Medium',
        color:'black'

    },
    selectedStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: 'white',
        marginTop: 8,
        marginRight: 12,
        paddingHorizontal: '3%',
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'black',
        color:'black'

    },
    textSelectedStyle: {
        marginRight: 5,
        fontSize: 16,
        color:'black'
    },


    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: '#177AD5',
        // paddingHorizontal: '4%',
        borderRadius: 22,
        marginBottom: 2
    },


    // header: {
    //     height: 60,
    //      paddingHorizontal: 20,
    //     backgroundColor: '#177AD5',
    //     borderRadius: 24,
    //     borderBottomColor: 'white',
    //     borderBottomWidth: 10,
    //     // borderBottomLeftRadius: 30,
    // },

    headerText: { textAlign: 'center', color: 'white', fontFamily: 'AvenirNextCyr-Medium', flexWrap: 'wrap' },
    text: { textAlign: 'center', fontWeight: '500', color: '#1C1C1C' },
    dataWrapper: { marginTop: -1 },
    // row: {
    //     height: 40,
    //     backgroundColor: '#F3F5F9',
    //     paddingHorizontal: '2%',
    //     borderRadius: 22,
    //     marginVertical: 2
    //     // alignItems: 'center',
    //     // justifyContent: 'center',
    // },
    row: {
        flexDirection: 'row',
        backgroundColor: '#F3F5F9',
        height: 40,
        backgroundColor: '#F3F5F9',
        // paddingHorizontal: '2%',
        borderRadius: 22,
        marginVertical: 2
    },

    button: {
        // height: vs(35),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: ms(5),
        borderRadius: 50,
        // backgroundColor: 'red',
        width: '100%',
        paddingVertical: '5%'
    },
    btnText: {
        fontFamily: "AvenirNextCyr-Medium",
        color: "#fff",
        fontSize: 16,
    },

});