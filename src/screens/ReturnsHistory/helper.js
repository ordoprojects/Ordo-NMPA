
// API to call the Collection and Stock Products
export const fetchDataForReturn = async (status, limit, offset, userData ,searchtext,types) => {

    console.log("API Request Parameters:", {
        status,
        limit,
        offset,
        userData,
        searchtext,
        types,
    });

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData?.token}`);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    let apiUrl = `https://gsidev.ordosolution.com/api/custom_purchase_list/?limit=${limit}&offset=${offset}&search_name=${searchtext}&status=${status}&types=${types}&user=${userData.id}`;

    try {
        const response = await fetch(apiUrl, requestOptions);
        const result = await response.json();

        console.log("🚀 ~ fetchDataForReturn ~ result:", result?.results[0]?.product_list)

        return result;
    } catch (error) {
        console.error(`Error fetching sales orders for status ${status}:`, error);
        return [];
    }
};
