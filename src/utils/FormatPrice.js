const FormatPrice = (price, type = 'indian') => {
    if (price == null || price === '') {
        return '';
    }

    const formattedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if (type === 'indian') {
        const parts = formattedPrice.split(',');
        const lastDigits = parts.pop();
        const remainingDigits = parts.join(',');
        return `${remainingDigits},${lastDigits}`;
    } else {
        return formattedPrice;
    }
};

export default FormatPrice;