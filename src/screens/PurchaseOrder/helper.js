
// API to call the Collection and Stock Products
export const fetchDataForRFQ = async (status, limit, offset, userData ,searchtext,types) => {

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData?.token}`);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    // Construct the API URL with the provided parameters
    let apiUrl = `https://gsidev.ordosolution.com/api/custom_purchase_list/?limit=${limit}&offset=${offset}&search_name=${searchtext}&status=${status}&types=${types}&user=${userData.id}`;
    console.log("url--------------------->", apiUrl)

    try {
        const response = await fetch(apiUrl, requestOptions);
        const result = await response.json();

        console.log('================Result===================');
        console.log(result);
        console.log('=========================================');

        return result;
    } catch (error) {
        console.error(`Error fetching sales orders for status ${status}:`, error);
        return [];
    }
};
