
// API to call the Collection and Stock Products
export const fetchDataForTeam = async (status, limit, offset, userData ,searchtext,noDay) => {

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData?.token}`);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    // Construct the API URL with the provided parameters
    let apiUrl = `https://gsidev.ordosolution.com/api/acc_sales_v2/?limit=${limit}&offset=${offset}&search_name=${searchtext}&status=${status}&days=${noDay}`;

    console.log("🚀 ~ fetchDataForTeam ~ apiUrl:", apiUrl)
    
    try {
        const response = await fetch(apiUrl, requestOptions);
        const result = await response.json();
        // console.log("🚀 ~ fetchDataForTeam ~ result:", result)

        return result;
    } catch (error) {
        console.error(`Error fetching sales orders for status ${status}:`, error);
        return [];
    }
};
